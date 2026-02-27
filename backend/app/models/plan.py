from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from app.core.database import Base


class Plan(Base):
    __tablename__ = "plans"

    id           = Column(Integer, primary_key=True, index=True)
    content      = Column(Text, nullable=False)   
    records_used = Column(Integer, default=0)     
    created_at   = Column(DateTime, default=datetime.utcnow)