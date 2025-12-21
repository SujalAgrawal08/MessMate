# app/routes/waste.py
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.models import WasteLog
from datetime import date

router = APIRouter(prefix="/waste", tags=["Waste Management"])

@router.post("/")
def log_waste(log: WasteLog, session: Session = Depends(get_session)):
    """Admin uses this to log daily waste"""
    session.add(log)
    session.commit()
    return {"message": "Waste data logged successfully"}

@router.get("/analytics")
def get_waste_analytics(session: Session = Depends(get_session)):
    """Returns data for the Admin Dashboard Charts"""
    logs = session.exec(select(WasteLog)).all()
    return logs