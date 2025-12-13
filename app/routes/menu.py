from fastapi import APIRouter
from datetime import datetime
from app.services.nutrition_estimator import estimate_nutrition

router = APIRouter(prefix="/menu", tags=["Menu"])

full_schedule = {
    'Monday': {'Breakfast': ['Poha', 'Sprouts'], 'Lunch': ['Aalu', 'Soyabean', 'Roti'], 'Snacks': ['Tea', 'Aalu Patties'], 'Dinner': ['Khadai Chicken', 'Rice']},
    'Tuesday': {'Breakfast': ['Seasonal Paratha'], 'Lunch': ['White Chole', 'Jeera Rice'], 'Snacks': ['Tea', 'Samosa'], 'Dinner': ['Chana Dal', 'Laddu']},
    'Wednesday': {'Breakfast': ['Missa Paratha', 'Dahi'], 'Lunch': ['Aalu Matar', 'Dal'], 'Snacks': ['Tea', 'Bhelpuri'], 'Dinner': ['Butter Chicken', 'Urad Dal']},
    'Thursday': {'Breakfast': ['Pav Bhaji', 'Butter'], 'Lunch': ['Black Chane', 'Dam Aalu'], 'Snacks': ['Tea', 'Biscuit'], 'Dinner': ['Dal Makhni', 'Fruit Raita']},
    'Friday': {'Breakfast': ['Aloo Paratha', 'Chutney'], 'Lunch': ['Rajma', 'Veg Raita'], 'Snacks': ['Tea', 'Pasta'], 'Dinner': ['Egg Curry', 'Moong Dal']},
    'Saturday': {'Breakfast': ['Bread Sandwich'], 'Lunch': ['Gaajar Matar', 'Dal'], 'Snacks': ['Tea', 'Kulcha'], 'Dinner': ['Seasonal Veg', 'Halwa']},
    'Sunday': {'Breakfast': ['Boil Egg', 'Bread Jam'], 'Lunch': ['Chole Bhature', 'Lassi'], 'Snacks': ['Tea', 'Biscuit'], 'Dinner': ['Masoor Dal', 'Kheer']}
}

@router.get("/weekly")
def get_weekly_menu():
    """Returns the hardcoded static schedule for the table view."""
    return full_schedule

@router.get("/today")
def get_today_menu_with_nutrition():
    """
    Dynamically fetches today's items from the hardcoded list 
    and generates nutrition values on the fly.
    """
    # 1. Get Today's Day Name 
    today_name = datetime.now().strftime('%A')
    
    if today_name not in full_schedule:
        today_name = 'Monday'

    today_items_raw = full_schedule[today_name]
    
    # 2. Structure the response
    enriched_menu = {
        "Breakfast": [],
        "Lunch": [],
        "Snacks": [],
        "Dinner": []
    }

    # 3. Loop through each meal and enrich with nutrition
    for meal_type, items in today_items_raw.items():
        for item_name in items:
            # Call our "Smart Estimator"
            nutrition = estimate_nutrition(item_name)
            
            # Append the enriched object
            enriched_menu[meal_type].append({
                "id": 1, # Dummy ID for frontend compatibility
                "item_name": item_name,
                **nutrition # Unpack calories, protein, etc.
            })

    return enriched_menu