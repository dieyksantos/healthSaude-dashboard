import io
import json
from datetime import datetime
from sqlalchemy.orm import Session
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

from app.core.database import SessionLocal
from app.models.health import Health
from app.models.plan import Plan
from app.routes.plan import _calc_bmi, _bmi_category, _generate_pdf  # reutiliza funções

# ── Conexão com o banco ──────────────────────────────
db: Session = SessionLocal()

# ── Busca o último plano ─────────────────────────────
plan = db.query(Plan).order_by(Plan.created_at.desc()).first()
if not plan:
    print("Nenhum plano encontrado. Gere um plano primeiro.")
    exit()

# ── Busca registros de saúde ─────────────────────────
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

# ── Gera o PDF ──────────────────────────────────────
pdf_bytes = _generate_pdf(json.loads(plan.content), records)

# ── Salva em arquivo ───────────────────────────────
filename = f"plano-saude-{datetime.now().strftime('%Y%m%d')}.pdf"
with open(filename, "wb") as f:
    f.write(pdf_bytes)

print(f"PDF gerado com sucesso: {filename}")