from pydantic import BaseModel
from typing import Optional

class MenuCreate(BaseModel):
    item_name: str
    calories: Optional[int] = 0
    protein: Optional[float] = 0.0
    carbs: Optional[float] = 0.0
    fats: Optional[float] = 0.0
    day_of_week: str
    meal_type: str

# Keep the Feedback schemas as they are
class FeedbackCreate(BaseModel):
    name: str
    comment: str

class FeedbackRead(BaseModel):
    id: int
    name: str
    comment: str
    sentiment: Optional[str]
    score: Optional[float]
