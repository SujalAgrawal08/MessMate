import random
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error

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

data = []
from datetime import date, timedelta
today = date.today()

for i in range(DAYS_TO_SEED):
    current_date = today - timedelta(days=DAYS_TO_SEED - i)
    day_name = current_date.strftime("%A")
    for meal in MEALS:
        base = STATS[meal]["avg"]
        variation = random.randint(-STATS[meal]["var"], STATS[meal]["var"])
        if day_name in ["Saturday", "Sunday"]:
            base = int(base * 0.8) 
        actual_count = base + variation
        
        prepared_kg = (actual_count * 0.4) + random.uniform(0, 5) # 400g per person + buffer
        consumed_kg = actual_count * 0.35 # 350g per person avg
        waste_kg = max(0, prepared_kg - consumed_kg)
        
        data.append({
            "log_date": current_date,
            "day_name": day_name,
            "meal": meal,
            "student_count": actual_count,
            "total_waste_kg": waste_kg
        })

df = pd.DataFrame(data)

# 1. Evaluate Waste Model (Linear Regression)
train_size = int(len(df) * 0.8)
train_df = df.iloc[:train_size]
test_df = df.iloc[train_size:]

X_train = train_df[['student_count']]
y_train = train_df['total_waste_kg']
X_test = test_df[['student_count']]
y_test = test_df['total_waste_kg']

model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)

mae_waste = mean_absolute_error(y_test, predictions)
rmse_waste = np.sqrt(mean_squared_error(y_test, predictions))

baseline_preds = [y_train.mean()] * len(y_test)
mae_baseline_waste = mean_absolute_error(y_test, baseline_preds)
rmse_baseline_waste = np.sqrt(mean_squared_error(y_test, baseline_preds))

print(f"--- Waste Prediction Model (Linear Regression) ---")
print(f"Model MAE: {mae_waste:.2f} kg, RMSE: {rmse_waste:.2f} kg")
print(f"Baseline (Mean) MAE: {mae_baseline_waste:.2f} kg, RMSE: {rmse_baseline_waste:.2f} kg")
print(f"Improvement over baseline: {(mae_baseline_waste - mae_waste) / mae_baseline_waste * 100:.1f}%\n")

# 2. Evaluate Student Attendance Forecasting
train_counts = train_df.groupby('day_name')['student_count'].mean()
test_predictions = []
for day in test_df['day_name']:
    if day in train_counts:
        test_predictions.append(train_counts[day])
    else:
        test_predictions.append(train_df['student_count'].mean())

mae_student = mean_absolute_error(test_df['student_count'], test_predictions)
rmse_student = np.sqrt(mean_squared_error(test_df['student_count'], test_predictions))

baseline_student_preds = [train_df['student_count'].mean()] * len(test_df)
mae_baseline_student = mean_absolute_error(test_df['student_count'], baseline_student_preds)
rmse_baseline_student = np.sqrt(mean_squared_error(test_df['student_count'], baseline_student_preds))

print(f"--- Student Demand Model (Moving Average by Day) ---")
print(f"Model MAE: {mae_student:.2f} students, RMSE: {rmse_student:.2f} students")
print(f"Baseline (Global Mean) MAE: {mae_baseline_student:.2f} students, RMSE: {rmse_baseline_student:.2f} students")
print(f"Improvement over baseline: {(mae_baseline_student - mae_student) / mae_baseline_student * 100:.1f}%\n")
