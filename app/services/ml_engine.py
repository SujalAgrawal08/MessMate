import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64
from sklearn.linear_model import LinearRegression
from sqlmodel import Session, select
from app.models import Attendance, WasteLog
from datetime import date, timedelta

def generate_demand_forecast(session: Session):
    """
    Predicts attendance for the next 7 days using Moving Average.
    """
    # 1. Fetch Data
    records = session.exec(select(Attendance)).all()
    if not records:
        return []

    df = pd.DataFrame([vars(r) for r in records])
    df['log_date'] = pd.to_datetime(df['log_date'])
    
    # 2. Group by Date to get daily counts
    daily_counts = df.groupby('log_date').size().reset_index(name='count')
    
    # 3. Predict Next 7 Days
    predictions = []
    today = date.today()
    
    for i in range(1, 8):
        future_date = today + timedelta(days=i)
        day_name = future_date.strftime('%A') # e.g., 'Monday'
        
        # Simple Logic: Find average of all past occurrences of this day (e.g., all past Mondays)
        # In a real app, you might use ARIMA here.
        past_dates = daily_counts[daily_counts['log_date'].dt.day_name() == day_name]
        
        if not past_dates.empty:
            predicted_val = int(past_dates['count'].mean())
        else:
            predicted_val = 100 # Default fallback
            
        predictions.append({
            "date": future_date.strftime('%Y-%m-%d'),
            "day": day_name,
            "predicted_count": predicted_val
        })
        
    return predictions

def generate_waste_regression_chart(session: Session):
    """
    Trains a Linear Regression model (Student Count -> Waste)
    and returns a Plot image as Base64.
    """
    # 1. Fetch Data
    logs = session.exec(select(WasteLog)).all()
    if len(logs) < 5:
        return None 

    df = pd.DataFrame([vars(l) for l in logs])
    
    X = df[['student_count']] # Feature
    y = df['total_waste_kg']  # Target

    # 2. Train Model
    model = LinearRegression()
    model.fit(X, y)
    
    # 3. Predict for plotting
    predictions = model.predict(X)

    # 4. Generate Plot
    plt.figure(figsize=(10, 5))
    plt.scatter(df['student_count'], df['total_waste_kg'], color='blue', label='Actual Data')
    plt.plot(df['student_count'], predictions, color='red', linewidth=2, label='AI Prediction Line')
    
    plt.title('Waste Estimation Model (Linear Regression)')
    plt.xlabel('Number of Students')
    plt.ylabel('Expected Waste (kg)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # 5. Save to Base64 String
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    
    return img_str