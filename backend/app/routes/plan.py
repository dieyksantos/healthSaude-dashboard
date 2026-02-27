import io
import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from app.core.database import SessionLocal
from app.models.health import Health
from app.models.plan import Plan

router = APIRouter(prefix="/plan", tags=["plan"])


# ── Dependency ──────────────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Cores ───────────────────────────────────────────────────────
ACCENT = colors.HexColor("#00e5a0")
BLACK = colors.HexColor("#1a1a2e")
MUTED = colors.HexColor("#6b7280")
LIGHT_BG = colors.HexColor("#f3f4f6")


# ── IMC ─────────────────────────────────────────────────────────
def _calc_bmi(weight: float, height: float) -> float:
    return round(weight / (height ** 2), 2)


def _bmi_category(bmi: float) -> str:
    if bmi < 18.5:
        return "Abaixo do peso"
    if bmi < 25:
        return "Peso normal"
    if bmi < 30:
        return "Sobrepeso"
    if bmi < 35:
        return "Obesidade grau I"
    if bmi < 40:
        return "Obesidade grau II"
    return "Obesidade grau III"


def _ideal_weight(height: float, bmi_target: float) -> float:
    return round(bmi_target * (height ** 2), 2)


# Regra do peso alvo baseado em IMC saudável
def _weight_goal(weight: float, height: float) -> dict:
    bmi = _calc_bmi(weight, height)

    if bmi < 18.5:
        target_weight = _ideal_weight(height, 18.5)
        diff = round(target_weight - weight, 2)
        msg = (
            f"Você precisa ganhar aproximadamente {diff} kg para atingir o peso saudável "
            f"de {target_weight} kg (IMC 18.5)."
        )
        action = "ganhar"
    elif bmi > 24.9:
        target_weight = _ideal_weight(height, 24.9)
        diff = round(weight - target_weight, 2)
        msg = (
            f"Você precisa perder aproximadamente {diff} kg para atingir o peso saudável "
            f"de {target_weight} kg (IMC 24.9)."
        )
        action = "perder"
    else:
        target_weight = round(weight, 2)
        diff = 0.0
        msg = "Você está dentro do peso ideal (IMC entre 18.5 e 24.9)."
        action = "manter"

    return {
        "imc_atual": bmi,
        "acao": action,  # ganhar | perder | manter
        "peso_alvo": target_weight,
        "diferenca_kg": diff,
        "mensagem": msg,
        "categoria": _bmi_category(bmi),
    }


#  Direcionamento (texto) baseado no objetivo
def _guidance_by_action(action: str) -> dict:
    if action == "perder":
        titulo = "Direcionamento (Emagrecimento)"
        alimentacao = """
        <b>Objetivo:</b> déficit calórico (gastar mais do que consome) preservando a massa muscular.<br/><br/>
        <b>Prioridade Proteica:</b> Consuma proteínas em todas as refeições (ovo, frango, peixe, tofu). Elas saciam e protegem os músculos.<br/>
        <b>Carboidratos Inteligentes:</b> Troque farinha branca e açúcar por opções de baixo índice glicêmico (aveia, batata-doce, arroz integral).<br/>
        <b>Fibras:</b> Metade do prato deve ser vegetais verdes e legumes. Isso aumenta o volume da comida sem explodir as calorias.<br/>
        <b>Gorduras:</b> Use com moderação (azeite, abacate, castanhas).
        """
        treino = """
        <b>Musculação (Prioridade):</b> O músculo queima mais energia em repouso. Foque em treinos intensos de 45 a 60 minutos.<br/>
        <b>Cardio Estratégico:</b> 20 a 30 minutos de caminhada rápida ou inclinação após o treino de força.<br/>
        <b>Frequência:</b> 4 a 5 vezes por semana.
        """
        return {"titulo": titulo, "alimentacao": alimentacao, "treino": treino}

    if action == "ganhar":
        titulo = "Direcionamento (Ganho de Massa)"
        alimentacao = """
        <b>Objetivo:</b> superávit calórico (comer mais do que gasta), mas de forma limpa, para não ganhar apenas gordura abdominal.<br/><br/>
        <b>Densidade Calórica:</b> Adicione alimentos que ocupam pouco espaço mas têm muitas calorias (pasta de amendoim, azeite extra virgem, mel, frutas secas).<br/>
        <b>Líquidos Calóricos:</b> Se tiver dificuldade em comer muito, aposte em shakes de banana, aveia, whey e leite integral.<br/>
        <b>Fracionamento:</b> Coma de 5 a 6 vezes por dia para garantir o aporte necessário sem se sentir excessivamente cheio.<br/>
        <b>Proteína Constante:</b> Essencial para a construção do tecido muscular.
        """
        treino = """
        <b>Força Pura:</b> Foque em exercícios compostos (agachamento, supino, levantamento terra). Use cargas que te levem à falha entre 8 e 12 repetições.<br/>
        <b>Descanso:</b> O músculo cresce no descanso. Evite excesso de cardio (máximo 15 min de aquecimento) e durma pelo menos 7 a 8 horas.<br/>
        <b>Frequência:</b> 3 a 4 vezes por semana (treinos mais curtos, porém muito intensos).
        """
        return {"titulo": titulo, "alimentacao": alimentacao, "treino": treino}

    # manter
    titulo = "Direcionamento (Manutenção)"
    alimentacao = """
    <b>Objetivo:</b> manter saúde e composição corporal.<br/><br/>
    <b>Base:</b> proteína em todas as refeições, carboidratos de qualidade, fibras (vegetais e legumes) e gorduras boas com moderação.<br/>
    <b>Consistência:</b> evite excesso de açúcar/ultraprocessados, mantenha hidratação e horários regulares.
    """
    treino = """
    <b>Base:</b> musculação 3 a 4x/semana + cardio leve/moderado 2 a 3x/semana.<br/>
    <b>Progressão:</b> aumente cargas/repetições aos poucos e priorize sono/recuperação.
    """
    return {"titulo": titulo, "alimentacao": alimentacao, "treino": treino}


# ── PDF PROFISSIONAL (limpo/premium) ─────────────────────────────
def _generate_pdf(plan: dict, records: list[dict]) -> bytes:
    buffer = io.BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    styles = getSampleStyleSheet()

    s_title = ParagraphStyle(
        "TitleStyle",
        parent=styles["Title"],
        fontSize=22,
        textColor=ACCENT,
        spaceAfter=6,
    )

    s_sub = ParagraphStyle(
        "Sub",
        parent=styles["Normal"],
        fontSize=10,
        textColor=MUTED,
        spaceAfter=12,
    )

    s_section = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontSize=14,
        textColor=BLACK,
        spaceAfter=6,
    )

    s_body = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=11,
        textColor=BLACK,
        spaceAfter=8,
        leading=14,
    )

    story = []

    # Header
    story.append(Paragraph("Plano de Saúde Personalizado", s_title))
    story.append(Paragraph(f"Gerado em {datetime.now().strftime('%d/%m/%Y')}", s_sub))

    # Linha divisória
    story.append(Spacer(1, 6))
    story.append(Paragraph('<font color="#D1D5DB">_____________________________________________________</font>', s_sub))
    story.append(Spacer(1, 10))

    # Cards (IMC / Categoria / Ação / Peso alvo)
    imc = plan.get("imc_atual", "")
    categoria = plan.get("categoria", "")
    acao = plan.get("acao", "")
    peso_alvo = plan.get("peso_alvo", "")
    diff = plan.get("diferenca_kg", "")

    summary_table = Table(
        [
            ["IMC Atual", "Categoria", "Ação", "Peso Alvo", "Diferença (kg)"],
            [str(imc), str(categoria), str(acao), str(peso_alvo), str(diff)],
        ],
        colWidths=[2.2 * cm, 4.2 * cm, 2.2 * cm, 2.6 * cm, 3.0 * cm],
        hAlign="LEFT",
    )
    summary_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), LIGHT_BG),
                ("TEXTCOLOR", (0, 0), (-1, 0), BLACK),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 9),

                ("BACKGROUND", (0, 1), (-1, 1), colors.white),
                ("TEXTCOLOR", (0, 1), (-1, 1), BLACK),
                ("FONTSIZE", (0, 1), (-1, 1), 10),

                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(summary_table)
    story.append(Spacer(1, 14))

    # Análise IMC
    story.append(Paragraph("Análise do Peso (IMC)", s_section))
    story.append(Paragraph(plan.get("analise_peso", ""), s_body))
    story.append(Spacer(1, 10))

    # Direcionamento
    story.append(Paragraph(plan.get("guidance_titulo", "Direcionamento"), s_section))
    story.append(Paragraph("<b>Alimentação</b><br/>" + plan.get("guidance_alimentacao", ""), s_body))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Treino</b><br/>" + plan.get("guidance_treino", ""), s_body))

    doc.build(story)
    buffer.seek(0)
    return buffer.read()


# ── ENDPOINT GERAR PLANO ────────────────────────────────────────
@router.post("/generate")
async def generate_plan(db: Session = Depends(get_db)):
    records_raw = db.query(Health).order_by(Health.date).all()

    if not records_raw:
        raise HTTPException(status_code=400, detail="Nenhum registro encontrado.")

    records = [
        {
            "date": str(r.date),
            "weight": r.weight,
            "height": r.height,
            "bmi": _calc_bmi(r.weight, r.height),
            "category": _bmi_category(_calc_bmi(r.weight, r.height)),
        }
        for r in records_raw
    ]

    last = records[-1]
    goal = _weight_goal(last["weight"], last["height"])
    guidance = _guidance_by_action(goal["acao"])

    # ✅ AGORA O PLAN_DATA NÃO TEM MAIS MOCKS
    plan_data = {
        "imc_atual": goal["imc_atual"],
        "categoria": goal["categoria"],
        "peso_alvo": goal["peso_alvo"],
        "diferenca_kg": goal["diferenca_kg"],
        "analise_peso": goal["mensagem"],
        "acao": goal["acao"],

        "guidance_titulo": guidance["titulo"],
        "guidance_alimentacao": guidance["alimentacao"],
        "guidance_treino": guidance["treino"],
    }

    plan = Plan(
        content=json.dumps(plan_data, ensure_ascii=False),
        records_used=len(records),
        created_at=datetime.utcnow(),
    )

    db.add(plan)
    db.commit()
    db.refresh(plan)

    return {"id": plan.id, "plan": plan_data}


# ── PDF ─────────────────────────────────────────────────────────
@router.get("/{plan_id}/pdf")
async def download_pdf(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plano não encontrado.")

    plan_data = json.loads(plan.content)

    # Recarrega histórico (mantido caso queira usar no futuro)
    records_raw = db.query(Health).order_by(Health.date).all()
    records = [
        {
            "date": str(r.date),
            "weight": r.weight,
            "height": r.height,
            "bmi": _calc_bmi(r.weight, r.height),
            "category": _bmi_category(_calc_bmi(r.weight, r.height)),
        }
        for r in records_raw
    ]

    pdf_bytes = _generate_pdf(plan_data, records)
    filename = f"plano-saude-{datetime.now().strftime('%Y%m%d')}.pdf"

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )