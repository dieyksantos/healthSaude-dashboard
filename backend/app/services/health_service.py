from sqlalchemy.orm import Session
from app.models.health import Health
from app.schemas.health import HealthCreate

def calculate_bmi(weight: float, height: float) -> float:
    return round(weight / (height * height), 2)

def classify_bmi(bmi: float) -> str:
    if bmi < 18.5:
        return "Abaixo do peso"
    elif bmi < 25:
        return "Peso normal"
    elif bmi < 30:
        return "Sobrepeso"
    else:
        return "Obesidade"

def create_health(db: Session, data: HealthCreate):
    new_health = Health(**data.model_dump())
    db.add(new_health)
    db.commit()
    db.refresh(new_health)

    bmi = calculate_bmi(new_health.weight, new_health.height)
    category = classify_bmi(bmi)

    return {
        "id": new_health.id,
        "weight": new_health.weight,
        "height": new_health.height,
        "date": new_health.date,
        "bmi": bmi,
        "category": category
    }

def get_all_health(db: Session):
    records = db.query(Health).all()
    result = []

    for r in records:
        bmi = calculate_bmi(r.weight, r.height)
        category = classify_bmi(bmi)

        result.append({
            "id": r.id,
            "weight": r.weight,
            "height": r.height,
            "date": r.date,
            "bmi": bmi,
            "category": category
        })

    return result
def delete_health(db: Session, health_id: int):
    record = db.query(Health).filter(Health.id == health_id).first()
    if record:
        db.delete(record)
        db.commit()
        return {"message": "Deletado com sucesso"}
    return {"error": "Registro não encontrado"}
def update_health(db: Session, health_id: int, data: HealthCreate):
    record = db.query(Health).filter(Health.id == health_id).first()
    if record:
        record.weight = data.weight
        record.height = data.height
        record.date = data.date
        db.commit()
        db.refresh(record)

        bmi = calculate_bmi(record.weight, record.height)
        category = classify_bmi(bmi)

        return {
            "id": record.id,
            "weight": record.weight,
            "height": record.height,
            "date": record.date,
            "bmi": bmi,
            "category": category
        }

    return {"error": "Registro não encontrado"}