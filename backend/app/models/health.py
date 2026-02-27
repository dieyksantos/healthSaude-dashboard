from sqlalchemy import Column, Integer, Float, Date
from app.core.database import Base

class Health(Base):
    __tablename__ = "health"

    id = Column(Integer, primary_key=True, index=True)
    weight = Column(Float)
    height = Column(Float)
    date = Column(Date)