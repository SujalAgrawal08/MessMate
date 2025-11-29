from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Menu
from app.schemas import MenuCreate
from datetime import datetime

router = APIRouter(prefix="/menu", tags=["Menu"])

# Hardcoded full weekly schedule for display
full_schedule = {
    'Monday': {'Breakfast': ['Poha', 'Sprouts'], 'Lunch': ['Aalu', 'Soyabean', 'Roti'], 'Snacks': ['Tea', 'Aalu Patties'], 'Dinner': ['Khadai Chicken', 'Rice']},
    'Tuesday': {'Breakfast': ['Seasonal Paratha'], 'Lunch': ['White Chole', 'Jeera Rice'], 'Snacks': ['Tea', 'Samosa'], 'Dinner': ['Chana Dal', 'Laddu']},
    'Wednesday': {'Breakfast': ['Missa Paratha', 'Dahi'], 'Lunch': ['Aalu Matar', 'Dal'], 'Snacks': ['Tea', 'Bhelpuri'], 'Dinner': ['Butter Chicken', 'Urad Dal']},
    'Thursday': {'Breakfast': ['Pav Bhaji', 'Butter'], 'Lunch': ['Black Chane', 'Dam Aalu'], 'Snacks': ['Tea', 'Biscuit'], 'Dinner': ['Dal Makhni', 'Fruit Raita']},
    'Friday': {'Breakfast': ['Aloo Paratha', 'Chutney'], 'Lunch': ['Rajma', 'Veg Raita'], 'Snacks': ['Tea', 'Pasta'], 'Dinner': ['Egg Curry', 'Moong Dal']},
    'Saturday': {'Breakfast': ['Bread Sandwich'], 'Lunch': ['Gaajar Matar', 'Dal'], 'Snacks': ['Tea', 'Kulcha'], 'Dinner': ['Seasonal Veg', 'Halwa']},
    'Sunday': {'Breakfast': ['Boil Egg', 'Bread Jam'], 'Lunch': ['Chole Bhature', 'Lassi'], 'Snacks': ['Tea', 'Biscuit'], 'Dinner': ['Masoor Dal', 'Kheer']}
}

@router.get("/full-schedule")
def get_full_schedule():
    """Returns the hardcoded full weekly schedule."""
    return full_schedule

@router.get("/today")
def get_today_menu(session: Session = Depends(get_session)):
    """Fetches all menu items for the current day from the database."""
    today_name = datetime.now().strftime('%A')  # Gets day name like "Friday"
    statement = select(Menu).where(Menu.day_of_week == today_name)
    results = session.exec(statement).all()
    
    if not results:
        return {"message": f"No menu items found for {today_name}."}
        
    # Group items by meal type
    today_menu = {"Breakfast": [], "Lunch": [], "Snacks": [], "Dinner": []}
    for item in results:
        if item.meal_type in today_menu:
            today_menu[item.meal_type].append(item)
            
    return today_menu

@router.post("/")
def add_menu_item(item: MenuCreate, session: Session = Depends(get_session)):
    """Adds a new menu item with nutritional info."""
    new_item = Menu.from_orm(item)
    session.add(new_item)
    session.commit()
    session.refresh(new_item)
    return new_item
