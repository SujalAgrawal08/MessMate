# app/routes/attendance.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Attendance, User
from datetime import date
from app.models import LeaveRecord

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/mark")
def mark_attendance(student_email: str, meal_type: str, session: Session = Depends(get_session)):
    # 1. Find the student
    user = session.exec(select(User).where(User.email == student_email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student not found")
    
    on_leave = session.exec(select(LeaveRecord).where(
        LeaveRecord.student_id == user.id,
        LeaveRecord.leave_date == date.today(),
        LeaveRecord.meal_type == meal_type
    )).first()

    if on_leave:
        # Throw error so the Scanner turns RED
        raise HTTPException(status_code=400, detail="BLOCKED: Student marked LEAVE")

    # 2. Check if already marked for this meal
    existing = session.exec(select(Attendance).where(
        Attendance.student_id == user.id,
        Attendance.log_date == date.today(), 
        Attendance.meal_type == meal_type
    )).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already marked present")

    # 3. Mark Present
    new_entry = Attendance(student_id=user.id, meal_type=meal_type, log_date=date.today()) # <--- AND HERE
    session.add(new_entry)
    session.commit()
    return {"message": f"Attendance marked for {user.full_name}"}

@router.get("/today")
def get_today_count(session: Session = Depends(get_session)):
    # Used for Admin Dashboard KPI
    count = session.query(Attendance).filter(Attendance.log_date == date.today()).count()
    return {"total_students_eaten": count}