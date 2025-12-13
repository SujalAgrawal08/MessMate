import random

# A "Knowledge Base" of common Indian Mess items (per serving)
FOOD_DATABASE = {
    "Poha": {"calories": 180, "protein": 4, "carbs": 25, "fats": 7},
    "Sprouts": {"calories": 60, "protein": 6, "carbs": 10, "fats": 0.5},
    "Aalu": {"calories": 140, "protein": 3, "carbs": 30, "fats": 0.2},
    "Soyabean": {"calories": 120, "protein": 11, "carbs": 8, "fats": 5},
    "Roti": {"calories": 100, "protein": 3, "carbs": 18, "fats": 2},
    "Tea": {"calories": 40, "protein": 1, "carbs": 8, "fats": 0.5},
    "Aalu Patties": {"calories": 250, "protein": 4, "carbs": 30, "fats": 12},
    "Khadai Chicken": {"calories": 300, "protein": 25, "carbs": 8, "fats": 18},
    "Rice": {"calories": 130, "protein": 2.5, "carbs": 28, "fats": 0.3},
    "Dal": {"calories": 150, "protein": 7, "carbs": 18, "fats": 4},
    "Rajma": {"calories": 240, "protein": 9, "carbs": 35, "fats": 6},
    "Paneer": {"calories": 200, "protein": 12, "carbs": 4, "fats": 15},
    "Egg Curry": {"calories": 180, "protein": 14, "carbs": 5, "fats": 12},
    "Samosa": {"calories": 200, "protein": 4, "carbs": 20, "fats": 10},
    "Dahi": {"calories": 60, "protein": 4, "carbs": 5, "fats": 3},
    # Add generic defaults for unknown items
    "default_veg": {"calories": 150, "protein": 4, "carbs": 20, "fats": 6},
    "default_nonveg": {"calories": 250, "protein": 20, "carbs": 5, "fats": 15},
}

def estimate_nutrition(item_name: str):
    """
    "Smartly" estimates nutrition. 
    1. Checks the local DB.
    2. If not found, uses keyword matching (AI-lite).
    3. Returns a default if unknown.
    """
    name_clean = item_name.strip()
    
    # 1. Direct Match
    if name_clean in FOOD_DATABASE:
        return FOOD_DATABASE[name_clean]
        
    # 2. Keyword "AI" Matching
    name_lower = name_clean.lower()
    if "chicken" in name_lower or "egg" in name_lower:
        base = FOOD_DATABASE["default_nonveg"].copy()
        # Add some random variation to make it feel dynamic/real
        base["calories"] += random.randint(-20, 20)
        return base
        
    if "paratha" in name_lower:
        return {"calories": 260, "protein": 5, "carbs": 35, "fats": 12}
        
    if "dal" in name_lower:
        return FOOD_DATABASE["Dal"]

    # 3. Fallback
    return FOOD_DATABASE["default_veg"]