import random
from datetime import date, timedelta
from sqlmodel import Session, select
from app.database import engine
from app.models import WasteLog, Attendance, User, Menu

# Configuration
DAYS_TO_SEED = 30
MEALS = ["Breakfast", "Lunch", "Snacks", "Dinner"]

# Realistic Stats (Average students per meal)
STATS = {
    "Breakfast": {"avg": 120, "var": 15}, # Avg 120 students, +/- 15
    "Lunch":     {"avg": 145, "var": 20},
    "Snacks":    {"avg": 80,  "var": 10},
    "Dinner":    {"avg": 135, "var": 15},
}

def seed_history():
    with Session(engine) as session:
        # 1. Get a dummy student to link attendance to (or create one)
        student = session.exec(select(User).where(User.role == "student")).first()
        if not student:
            print("❌ No student found! Please register a student first via Swagger/Frontend.")
            return

        print(f"🌱 Seeding data for the last {DAYS_TO_SEED} days...")
        
        today = date.today()
        
        for i in range(DAYS_TO_SEED):
            current_date = today - timedelta(days=DAYS_TO_SEED - i)
            day_name = current_date.strftime("%A")
            
            # Skip Sundays for Lunch/Dinner if you want (Optional realism)
            
            for meal in MEALS:
                # --- A. Generate Attendance Count ---
                base = STATS[meal]["avg"]
                variation = random.randint(-STATS[meal]["var"], STATS[meal]["var"])
                
                # Weekend dip logic
                if day_name in ["Saturday", "Sunday"]:
                    base = int(base * 0.8) 
                
                actual_count = base + variation
                
                # --- B. Create Fake Attendance Entries (Just count is enough for forecasting, 
                # but we'll add 1 real entry for the test user to see in their history)
                # Note: We won't insert 100+ rows per meal to save DB space, 
                # we will just trust the 'waste_logs.student_count' for the regression model.
                
                if i == DAYS_TO_SEED - 1: # Only for today/yesterday, add real attendance
                     session.add(Attendance(student_id=student.id, log_date=current_date, meal_type=meal))

                # --- C. Generate Waste Log (The Training Data) ---
                # Logic: More students = Less waste (usually), but random mistakes happen.
                prepared_kg = (actual_count * 0.4) + random.uniform(0, 5) # 400g per person + buffer
                consumed_kg = actual_count * 0.35 # 350g per person avg
                waste_kg = max(0, prepared_kg - consumed_kg)
                
                # Create Log
                log = WasteLog(
                    log_date=current_date,
                    meal_type=meal,
                    total_prepared_kg=round(prepared_kg, 2),
                    total_waste_kg=round(waste_kg, 2),
                    student_count=actual_count
                )
                session.add(log)
        
        session.commit()
        print("✅ Successfully seeded 30 days of Waste & Attendance data!")

if __name__ == "__main__":
    # Ensure you run this from the root folder: python seed_data.py
    seed_history()