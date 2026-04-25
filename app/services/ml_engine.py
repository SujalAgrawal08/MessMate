import pandas as pd
import io
import base64
import matplotlib
import json
import os
from datetime import datetime
# Force non-GUI backend
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sqlmodel import Session, select
from app.models import Attendance, WasteLog
from datetime import date, timedelta
import joblib

# Global model loading (loaded at startup)
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'models')
LOGS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'logs')
MODEL_PATH = os.path.join(MODELS_DIR, 'waste_model_latest.pkl')
METRICS_LOG_PATH = os.path.join(LOGS_DIR, 'model_metrics.json')

# We load the pipeline lazily or globally
_model_pipeline = None

def get_model():
    global _model_pipeline
    if _model_pipeline is None:
        if os.path.exists(MODEL_PATH):
            _model_pipeline = joblib.load(MODEL_PATH)
    return _model_pipeline

def generate_demand_forecast(session: Session):
    """
    Predicts attendance for the next 7 days using Moving Average.
    """
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
        
        past_dates = daily_counts[daily_counts['log_date'].dt.day_name() == day_name]
        
        if not past_dates.empty:
            predicted_val = int(past_dates['count'].mean())
        else:
            predicted_val = 120
            
        predictions.append({
            "date": future_date.strftime('%Y-%m-%d'),
            "day": day_name,
            "predicted_count": predicted_val
        })
        
    return predictions

def get_tomorrow_student_prediction(session: Session):
    forecasts = generate_demand_forecast(session)
    if not forecasts:
        return None
    return forecasts[0]

def log_prediction_metrics(features, prediction):
    """Logs the prediction to model_metrics.json for monitoring"""
    if not os.path.exists(LOGS_DIR):
        os.makedirs(LOGS_DIR)
        
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "features": features,
        "prediction": float(prediction)
    }
    
    logs = []
    if os.path.exists(METRICS_LOG_PATH):
        try:
            with open(METRICS_LOG_PATH, 'r') as f:
                logs = json.load(f)
        except json.JSONDecodeError:
            pass
            
    logs.append(log_entry)
    
    with open(METRICS_LOG_PATH, 'w') as f:
        json.dump(logs, f, indent=4)

def predict_waste_fast(meal_type: str, student_count: int, day_of_week: str, rolling_avg: float, prev_waste: float):
    """Fast inference endpoint logic"""
    model = get_model()
    if not model:
        return {"error": "Model not loaded. Run offline training first."}
        
    # Construct DataFrame for the pipeline
    features = {
        'student_count': [student_count],
        'meal_type': [meal_type],
        'day_of_week': [day_of_week],
        'rolling_avg_attendance': [rolling_avg],
        'previous_day_waste': [prev_waste]
    }
    
    df_features = pd.DataFrame(features)
    
    # Predict
    waste_pred = model.predict(df_features)[0]
    waste_pred = round(max(0, waste_pred), 2)
    
    # Log for monitoring
    log_prediction_metrics(features, waste_pred)
    
    return {
        "predicted_waste_kg": waste_pred,
        "model_version": "latest",
        "features_used": features
    }

def predict_tomorrow_waste(session: Session):
    """
    Combines tomorrow's attendance forecast with the loaded ML model.
    To use the new model, we need rolling avg and previous day waste.
    We will extract these from the DB dynamically.
    """
    model = get_model()
    if not model:
         return {"error": "Model not loaded. Please train offline first."}
         
    student_pred = get_tomorrow_student_prediction(session)
    if not student_pred:
        return {"error": "Not enough data for student forecast"}
        
    count = student_pred['predicted_count']
    day_name = student_pred['day']
    meal_type = "Lunch" # Defaulting to Lunch for this legacy method
    
    # Fetch previous data for rolling avg and prev waste
    logs = session.exec(select(WasteLog).where(WasteLog.meal_type == meal_type).order_by(WasteLog.log_date.desc())).all()
    
    if len(logs) < 3:
        return {"error": "Not enough historical waste logs for advanced features"}
        
    prev_waste = logs[0].total_waste_kg
    rolling_avg = sum([l.student_count for l in logs[:3]]) / 3.0
    
    return predict_waste_fast(meal_type, count, day_name, rolling_avg, prev_waste)

def generate_waste_regression_chart(session: Session):
    """Generates the plot image showing actual vs predicted on historical data"""
    model = get_model()
    if not model:
        return None
        
    # Fetch historical
    from scripts.train_model import fetch_data, engineer_features
    df = fetch_data()
    if df is None: return None
    df = engineer_features(df)
    
    if len(df) == 0: return None
    
    # Predict historical
    features = ['student_count', 'rolling_avg_attendance', 'previous_day_waste', 'meal_type', 'day_of_week']
    df['predictions'] = model.predict(df[features])
    
    # --- THEME SETTINGS ---
    text_color = "#e2e8f0"
    point_color = "#22d3ee"
    line_color = "#f87171"

    fig, ax = plt.subplots(figsize=(10, 5))
    fig.patch.set_alpha(0.0)
    ax.set_facecolor('#00000000')

    # Plot Actual vs Predicted
    ax.scatter(df['total_waste_kg'], df['predictions'], color=point_color, s=60, alpha=0.8, label='Predictions vs Actual', edgecolors='white', linewidth=0.5)
    
    # Perfect prediction line
    min_val = min(df['total_waste_kg'].min(), df['predictions'].min())
    max_val = max(df['total_waste_kg'].max(), df['predictions'].max())
    ax.plot([min_val, max_val], [min_val, max_val], color=line_color, linestyle='--', linewidth=2, label='Perfect Fit')

    ax.set_title('Waste Estimation Model Performance', color="white", fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel('Actual Waste (kg)', color=text_color, labelpad=10)
    ax.set_ylabel('Predicted Waste (kg)', color=text_color, labelpad=10)
    
    legend = ax.legend(facecolor='#0f172a', edgecolor='#334155', fontsize=9)
    for text in legend.get_texts():
        text.set_color(text_color)

    ax.tick_params(axis='x', colors=text_color)
    ax.tick_params(axis='y', colors=text_color)
    ax.grid(True, color='#334155', linestyle=':', alpha=0.6)
    
    for spine in ax.spines.values():
        spine.set_edgecolor('#334155')

    plt.tight_layout()
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', transparent=True)
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    
    return img_str