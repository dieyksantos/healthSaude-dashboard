from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.health import Health

router = APIRouter(prefix="/health", tags=["health"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def _calc_bmi(weight: float, height: float) -> float:
    return round(weight / (height ** 2), 2)

def _bmi_category(bmi: float) -> str:
    if bmi < 18.5: return "Abaixo do peso"
    if bmi < 25: return "Peso normal"
    if bmi < 30: return "Sobrepeso"
    if bmi < 35: return "Obesidade grau I"
    if bmi < 40: return "Obesidade grau II"
    return "Obesidade grau III"

@router.get("/")
def list_health(db: Session = Depends(get_db)):
    rows = db.query(Health).order_by(Health.date).all()
    out = []
    for r in rows:
        bmi = _calc_bmi(r.weight, r.height)
        out.append({
            "id": r.id,
            "date": str(r.date),
            "weight": r.weight,
            "height": r.height,
            "bmi": bmi,
            "category": _bmi_category(bmi),
            "gender": getattr(r, "gender", None),
        })
    return out

@router.post("/")
def create_health(payload: dict, db: Session = Depends(get_db)):
    try:
        d = payload.get("date")
        d = date.fromisoformat(d) if d else date.today()
        weight = float(payload["weight"])
        height = float(payload["height"])
        gender = payload.get("gender")
    except Exception:
        raise HTTPException(status_code=400, detail="Payload inválido.")

    row = Health(date=d, weight=weight, height=height)
    if hasattr(row, "gender") and gender is not None:
        row.gender = gender

    db.add(row)
    db.commit()
    db.refresh(row)
    return {"id": row.id}