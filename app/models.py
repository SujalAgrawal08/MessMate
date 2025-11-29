from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date

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
