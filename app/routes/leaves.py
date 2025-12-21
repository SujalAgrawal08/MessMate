from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import LeaveRecord, User
from app.routes.auth_routes import get_current_user
from datetime import date, datetime, time

router = APIRouter(prefix="/leaves", tags=["Leaves"])

CUTOFFS = {
    "Breakfast": time(7, 45),
    "Lunch":     time(11, 45),
    "Snacks":    time(16, 45),
    "Dinner":    time(19, 15)
}

@router.post("/apply")
def apply_leave(
    leave_date: date, 
    meal_type: str, 
    user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    # 1. TIME VALIDATION 
    if leave_date == date.today():
        current_time = datetime.now().time()
        
        if meal_type not in CUTOFFS:
            raise HTTPException(status_code=400, detail="Invalid Meal Type")
            
        cutoff_time = CUTOFFS[meal_type]
        
        if current_time > cutoff_time:
             raise HTTPException(
                 status_code=400, 
                 detail=f"Too late! Cutoff for {meal_type} was {cutoff_time.strftime('%H:%M')}."
             )
    
    # 2. Prevent duplicate leave
    existing = session.exec(select(LeaveRecord).where(
        LeaveRecord.student_id == user.id,
        LeaveRecord.leave_date == leave_date,
        LeaveRecord.meal_type == meal_type
    )).first()
    
    if existing:
        return {"message": "Leave already applied."}

    # 3. Apply Leave
    new_leave = LeaveRecord(student_id=user.id, leave_date=leave_date, meal_type=meal_type)
    session.add(new_leave)
    session.commit()
    
    return {"message": f"Leave applied for {meal_type}! Rebate added.", "status": "success"}

@router.get("/my-leaves")
def get_my_leaves(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(LeaveRecord).where(LeaveRecord.student_id == user.id)).all()