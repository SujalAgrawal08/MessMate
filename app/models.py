from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date, datetime

class Menu(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    item_name: str
    
    # Nutritional Info
    calories: Optional[int] = 0
    protein: Optional[float] = 0.0
    carbs: Optional[float] = 0.0
    fats: Optional[float] = 0.0
    
    # Scheduling
    day_of_week: str  # e.g., "Monday", "Tuesday"
    meal_type: str    # e.g., "Breakfast", "Lunch"

class Feedback(SQLModel, table=True):
    # Keep the Feedback model as it is
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    comment: str
    sentiment: Optional[str]
    score: Optional[float]
    created_at: date = Field(default_factory=date.today)

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: str
    role: str = Field(default="student") # 'admin' or 'student'
    roll_no: Optional[str] = None

class WasteLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    log_date: date = Field(default_factory=date.today)
    meal_type: str # Breakfast, Lunch, etc.
    total_prepared_kg: float
    total_waste_kg: float
    student_count: int # How many students scanned/attended

class Attendance(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int
    log_date: date = Field(default_factory=date.today) 
    meal_type: str 
    status: str = "Present"
class LeaveRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int
    leave_date: date
    meal_type: str 
    created_at: date = Field(default_factory=date.today)