import pandas as pd
import io
import base64
import matplotlib
# Force non-GUI backend
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sqlmodel import Session, select
from app.models import Attendance, WasteLog
from datetime import date, timedelta



def generate_demand_forecast(session: Session):
    """
    Predicts attendance for the next 7 days using Moving Average.
    """
    # Fetch Data
    records = session.exec(select(Attendance)).all()
    if not records:
        return []

    df = pd.DataFrame([vars(r) for r in records])
    df['log_date'] = pd.to_datetime(df['log_date'])
    
    # Group by Date
    daily_counts = df.groupby('log_date').size().reset_index(name='count')
    
    predictions = []
    today = date.today()
    
    for i in range(1, 8):
        future_date = today + timedelta(days=i)
        day_name = future_date.strftime('%A') # e.g., 'Monday'
        
        # Logic: Find average of all past occurrences of this day
        past_dates = daily_counts[daily_counts['log_date'].dt.day_name() == day_name]
        
        if not past_dates.empty:
            predicted_val = int(past_dates['count'].mean())
        else:
            predicted_val = 120 # Default fallback
            
        predictions.append({
            "date": future_date.strftime('%Y-%m-%d'),
            "day": day_name,
            "predicted_count": predicted_val
        })
        
    return predictions

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
    waste_pred = model.predict([[count]])[0]
    
    return {
        "day": day_name,
        "predicted_students": count,
        "predicted_waste_kg": round(max(0, waste_pred), 2)
    }


def generate_waste_regression_chart(session: Session):
    """Generates the plot image with Cyber-Dark Theme."""
    model, df = train_waste_model(session)
    if not model:
        return None

    # Predict line for plotting
    X = df[['student_count']]
    predictions = model.predict(X)

    # --- THEME SETTINGS ---
    text_color = "#e2e8f0"  # Slate-200
    point_color = "#22d3ee" # Cyan-400 (Matches your theme)
    line_color = "#f87171"  # Red-400 (High contrast)

    # Create Figure with Transparent Background
    fig, ax = plt.subplots(figsize=(10, 5))
    fig.patch.set_alpha(0.0)
    ax.set_facecolor('#00000000')

    # Plot Data
    ax.scatter(df['student_count'], df['total_waste_kg'], color=point_color, s=60, alpha=0.8, label='Actual Data', edgecolors='white', linewidth=0.5)
    ax.plot(df['student_count'], predictions, color=line_color, linewidth=2.5, label='AI Trend Line')

    # Styling Axis & Text
    ax.set_title('Waste Estimation Model', color="white", fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel('Number of Students', color=text_color, labelpad=10)
    ax.set_ylabel('Waste (kg)', color=text_color, labelpad=10)
    
    # Legend
    legend = ax.legend(facecolor='#0f172a', edgecolor='#334155', fontsize=9)
    for text in legend.get_texts():
        text.set_color(text_color)

    # Ticks
    ax.tick_params(axis='x', colors=text_color)
    ax.tick_params(axis='y', colors=text_color)
    
    # Grid
    ax.grid(True, color='#334155', linestyle=':', alpha=0.6)
    
    # Spines (Borders)
    for spine in ax.spines.values():
        spine.set_edgecolor('#334155')

    plt.tight_layout()
    
    # Save to Base64
    buf = io.BytesIO()
    plt.savefig(buf, format='png', transparent=True)
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    
    return img_str