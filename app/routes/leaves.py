from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import LeaveRecord, User
from app.routes.auth_routes import get_current_user
from datetime import date

router = APIRouter(prefix="/leaves", tags=["Leaves"])

@router.post("/apply")
def apply_leave(
    leave_date: date, 
    meal_type: str, 
    user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    # 1. Prevent duplicate leave
    existing = session.exec(select(LeaveRecord).where(
        LeaveRecord.student_id == user.id,
        LeaveRecord.leave_date == leave_date,
        LeaveRecord.meal_type == meal_type
    )).first()
    
    if existing:
        return {"message": "Leave already applied."}

    # 2. Apply Leave
    # In a real app, you'd add a check: if (leave_date - today) < 12 hours, deny it.
    new_leave = LeaveRecord(student_id=user.id, leave_date=leave_date, meal_type=meal_type)
    session.add(new_leave)
    session.commit()
    
    return {"message": "Leave applied! Rebate added.", "status": "success"}

@router.get("/my-leaves")
def get_my_leaves(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(LeaveRecord).where(LeaveRecord.student_id == user.id)).all()