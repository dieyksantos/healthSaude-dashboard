from pydantic import BaseModel
from datetime import date

class HealthCreate(BaseModel):
    weight: float
    height: float
    date: date

class HealthResponse(HealthCreate):
    id: int
    bmi: float   
    category: str 
    class Config:
        from_attributes = True