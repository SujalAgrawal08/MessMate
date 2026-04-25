import os
import sys
import pandas as pd
import numpy as np
import joblib
from sklearn.metrics import mean_absolute_error, mean_squared_error

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.train_model import fetch_data, engineer_features

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')

def evaluate_model():
    latest_model_path = os.path.join(MODELS_DIR, 'waste_model_latest.pkl')
    if not os.path.exists(latest_model_path):
        print("❌ No trained model found. Run train_model.py first.")
        return
        
    print("Loading model and data...")
    pipeline = joblib.load(latest_model_path)
    
    df = fetch_data()
    if df is None:
        print("No data available.")
        return
        
    df = engineer_features(df)
    
    # We will evaluate on the last 20% of the data chronologically
    train_size = int(len(df) * 0.8)
    test_df = df.iloc[train_size:]
    
    if len(test_df) == 0:
        print("Not enough data to create a test set.")
        return
        
    numeric_features = ['student_count', 'rolling_avg_attendance', 'previous_day_waste']
    categorical_features = ['meal_type', 'day_of_week']
    
    X_test = test_df[numeric_features + categorical_features]
    y_test = test_df['total_waste_kg']
    
    print("Running inference on test set...")
    predictions = pipeline.predict(X_test)
    
    mae_model = mean_absolute_error(y_test, predictions)
    rmse_model = np.sqrt(mean_squared_error(y_test, predictions))
    
    # Baseline: Predict the mean of the training set
    train_df = df.iloc[:train_size]
    mean_waste = train_df['total_waste_kg'].mean()
    baseline_preds = [mean_waste] * len(y_test)
    
    mae_baseline = mean_absolute_error(y_test, baseline_preds)
    rmse_baseline = np.sqrt(mean_squared_error(y_test, baseline_preds))
    
    improvement = (mae_baseline - mae_model) / mae_baseline * 100 if mae_baseline > 0 else 0
    
    print("\n" + "="*40)
    print("📊 MODEL EVALUATION METRICS")
    print("="*40)
    print(f"Model MAE:      {mae_model:.2f} kg")
    print(f"Model RMSE:     {rmse_model:.2f} kg")
    print("-" * 40)
    print(f"Baseline MAE:   {mae_baseline:.2f} kg")
    print(f"Baseline RMSE:  {rmse_baseline:.2f} kg")
    print("-" * 40)
    print(f"🎯 Improvement vs Baseline: {improvement:.1f}%")
    print("="*40)

if __name__ == '__main__':
    evaluate_model()
