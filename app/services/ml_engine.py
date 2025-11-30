# import pandas as pd
# import matplotlib
# matplotlib.use('Agg')
# import matplotlib.pyplot as plt
# import io
# import base64
# from sklearn.linear_model import LinearRegression
# from sqlmodel import Session, select
# from app.models import Attendance, WasteLog
# from datetime import date, timedelta

# def generate_demand_forecast(session: Session):
#     """
#     Predicts attendance for the next 7 days using Moving Average.
#     """
#     # 1. Fetch Data
#     records = session.exec(select(Attendance)).all()
#     if not records:
#         return []

#     df = pd.DataFrame([vars(r) for r in records])
#     df['log_date'] = pd.to_datetime(df['log_date'])
    
#     # 2. Group by Date to get daily counts
#     daily_counts = df.groupby('log_date').size().reset_index(name='count')
    
#     # 3. Predict Next 7 Days
#     predictions = []
#     today = date.today()
    
#     for i in range(1, 8):
#         future_date = today + timedelta(days=i)
#         day_name = future_date.strftime('%A') # e.g., 'Monday'
        
#         # Simple Logic: Find average of all past occurrences of this day (e.g., all past Mondays)
#         # In a real app, you might use ARIMA here.
#         past_dates = daily_counts[daily_counts['log_date'].dt.day_name() == day_name]
        
#         if not past_dates.empty:
#             predicted_val = int(past_dates['count'].mean())
#         else:
#             predicted_val = 100 # Default fallback
            
#         predictions.append({
#             "date": future_date.strftime('%Y-%m-%d'),
#             "day": day_name,
#             "predicted_count": predicted_val
#         })
        
#     return predictions

# def generate_waste_regression_chart(session: Session):
#     """
#     Trains a Linear Regression model (Student Count -> Waste)
#     and returns a Plot image as Base64.
#     """
#     # 1. Fetch Data
#     logs = session.exec(select(WasteLog)).all()
#     if len(logs) < 5:
#         return None 

#     df = pd.DataFrame([vars(l) for l in logs])
    
#     X = df[['student_count']] # Feature
#     y = df['total_waste_kg']  # Target

#     # 2. Train Model
#     model = LinearRegression()
#     model.fit(X, y)
    
#     # 3. Predict for plotting
#     predictions = model.predict(X)

#     # 4. Generate Plot
#     plt.figure(figsize=(10, 5))
#     plt.scatter(df['student_count'], df['total_waste_kg'], color='blue', label='Actual Data')
#     plt.plot(df['student_count'], predictions, color='red', linewidth=2, label='AI Prediction Line')
    
#     plt.title('Waste Estimation Model (Linear Regression)')
#     plt.xlabel('Number of Students')
#     plt.ylabel('Expected Waste (kg)')
#     plt.legend()
#     plt.grid(True, alpha=0.3)
    
#     # 5. Save to Base64 String
#     buf = io.BytesIO()
#     plt.savefig(buf, format='png')
#     buf.seek(0)
#     img_str = base64.b64encode(buf.read()).decode('utf-8')
#     plt.close()
    
#     return img_str


import pandas as pd
import io
import base64
import matplotlib
matplotlib.use('Agg') # Force non-GUI
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sqlmodel import Session, select
from app.models import Attendance, WasteLog
from datetime import date, timedelta

# --- SHARED LOGIC ---
def get_tomorrow_student_prediction(session: Session):
    """Reuses the logic from demand forecast to get just Tomorrow's count."""
    forecasts = generate_demand_forecast(session)
    if not forecasts:
        return None
    return forecasts[0] # Index 0 is always "Tomorrow"

def train_waste_model(session: Session):
    """Helper to train the model and return it."""
    logs = session.exec(select(WasteLog)).all()
    if len(logs) < 5:
        return None, None
    
    df = pd.DataFrame([vars(l) for l in logs])
    X = df[['student_count']]
    y = df['total_waste_kg']
    
    model = LinearRegression()
    model.fit(X, y)
    return model, df

# --- MAIN FUNCTIONS ---

def generate_demand_forecast(session: Session):
    """Predicts attendance for the next 7 days."""
    records = session.exec(select(Attendance)).all()
    if not records:
        return []

    df = pd.DataFrame([vars(r) for r in records])
    df['log_date'] = pd.to_datetime(df['log_date'])
    daily_counts = df.groupby('log_date').size().reset_index(name='count')
    
    predictions = []
    today = date.today()
    
    for i in range(1, 8):
        future_date = today + timedelta(days=i)
        day_name = future_date.strftime('%A')
        
        # Logic: Avg of past same-days
        past_dates = daily_counts[daily_counts['log_date'].dt.day_name() == day_name]
        
        if not past_dates.empty:
            predicted_val = int(past_dates['count'].mean())
        else:
            predicted_val = 120 # Fallback
            
        predictions.append({
            "date": future_date.strftime('%Y-%m-%d'),
            "day": day_name,
            "predicted_count": predicted_val
        })
    return predictions

def generate_waste_regression_chart(session: Session):
    """Generates the plot image."""
    model, df = train_waste_model(session)
    if not model:
        return None

    # Predict line for plotting
    X = df[['student_count']]
    predictions = model.predict(X)

    plt.figure(figsize=(10, 5))
    plt.scatter(df['student_count'], df['total_waste_kg'], color='blue', label='Actual Data')
    plt.plot(df['student_count'], predictions, color='red', linewidth=2, label='AI Prediction Line')
    plt.title('Waste Estimation Model')
    plt.xlabel('Number of Students')
    plt.ylabel('Waste (kg)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    return img_str

def predict_tomorrow_waste(session: Session):
    """
    COMBINES forecasts:
    1. Get Tomorrow's Predicted Students.
    2. Feed that number into the Waste Regression Model.
    3. Return the specific Waste Prediction (kg).
    """
    # 1. Get Tomorrow's Student Count
    student_pred = get_tomorrow_student_prediction(session)
    if not student_pred:
        return {"error": "Not enough data for student forecast"}
        
    count = student_pred['predicted_count']
    day_name = student_pred['day']
    
    # 2. Get Waste Model
    model, _ = train_waste_model(session)
    if not model:
        return {"error": "Not enough waste logs to train model"}
        
    # 3. Predict Waste for that specific student count
    # Predict expects a 2D array like [[150]]
    waste_pred = model.predict([[count]])[0]
    
    return {
        "day": day_name,
        "predicted_students": count,
        "predicted_waste_kg": round(max(0, waste_pred), 2) # ensure no negative waste
    }