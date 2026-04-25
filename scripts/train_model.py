import os
import sys
import pandas as pd
import joblib
from datetime import datetime

# Add root project to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import Session, select
from app.database import engine
from app.models import WasteLog
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LinearRegression

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')

def fetch_data():
    with Session(engine) as session:
        logs = session.exec(select(WasteLog)).all()
        if not logs:
            return None
        return pd.DataFrame([vars(l) for l in logs])

def engineer_features(df):
    df['log_date'] = pd.to_datetime(df['log_date'])
    df['day_of_week'] = df['log_date'].dt.day_name()
    
    # Ensure sorted order for shift/rolling operations
    df = df.sort_values(by=['log_date', 'meal_type'])
    
    # Feature 1: Previous day's waste for the same meal
    df['previous_day_waste'] = df.groupby('meal_type')['total_waste_kg'].shift(1)
    
    # Feature 2: Rolling average attendance for the same meal type (past 3 occurrences)
    df['rolling_avg_attendance'] = df.groupby('meal_type')['student_count'].transform(
        lambda x: x.rolling(window=3, min_periods=1).mean().shift(1)
    )
    
    # Drop rows with NaN (the first few occurrences per meal_type)
    df = df.dropna(subset=['previous_day_waste', 'rolling_avg_attendance'])
    return df

def train_and_save_model():
    print("Loading historical data...")
    df = fetch_data()
    
    if df is None or len(df) < 10:
        print("Not enough data to train the model. Run seed_data.py first.")
        return
        
    print(f"Loaded {len(df)} records. Engineering features...")
    df = engineer_features(df)
    
    if len(df) < 5:
        print("Not enough data after feature engineering.")
        return
        
    # Define Features and Target
    numeric_features = ['student_count', 'rolling_avg_attendance', 'previous_day_waste']
    categorical_features = ['meal_type', 'day_of_week']
    
    X = df[numeric_features + categorical_features]
    y = df['total_waste_kg']
    
    # Create Pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])
        
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', LinearRegression())
    ])
    
    print("Training model...")
    pipeline.fit(X, y)
    
    # Save Model
    if not os.path.exists(MODELS_DIR):
        os.makedirs(MODELS_DIR)
        
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    versioned_model_path = os.path.join(MODELS_DIR, f'waste_model_{timestamp}.pkl')
    latest_model_path = os.path.join(MODELS_DIR, 'waste_model_latest.pkl')
    
    joblib.dump(pipeline, versioned_model_path)
    joblib.dump(pipeline, latest_model_path) # Overwrite latest
    
    print(f"✅ Model trained and saved successfully to {versioned_model_path}")
    print(f"✅ Latest model symlinked/copied to {latest_model_path}")

if __name__ == '__main__':
    train_and_save_model()
