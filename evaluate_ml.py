import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sqlmodel import Session, select
from app.database import engine
from app.models import WasteLog, Attendance
from app.services.ml_engine import generate_demand_forecast, train_waste_model

def evaluate():
    with Session(engine) as session:
        logs = session.exec(select(WasteLog)).all()
        if not logs:
            print("No waste logs in DB. Run seed_data.py first.")
            return
            
        df = pd.DataFrame([vars(l) for l in logs])
        
        # 1. Evaluate Waste Model
        # The model is trained on all data in the actual app, let's just do a train/test split 
        # or calculate in-sample MAE/RMSE to see what the baseline error is.
        # Alternatively, let's use 80/20 split to make it honest.
        
        # Sort by date
        df = df.sort_values('log_date')
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
        
        # Baseline waste: Predict mean of training set
        baseline_preds = [y_train.mean()] * len(y_test)
        mae_baseline_waste = mean_absolute_error(y_test, baseline_preds)
        rmse_baseline_waste = np.sqrt(mean_squared_error(y_test, baseline_preds))
        
        print(f"--- Waste Prediction Model (Linear Regression) ---")
        print(f"Model MAE: {mae_waste:.2f} kg, RMSE: {rmse_waste:.2f} kg")
        print(f"Baseline (Mean) MAE: {mae_baseline_waste:.2f} kg, RMSE: {rmse_baseline_waste:.2f} kg")
        print(f"Improvement over baseline: {(mae_baseline_waste - mae_waste) / mae_baseline_waste * 100:.1f}%\n")
        
        # 2. Evaluate Student Attendance Forecasting
        # To do this correctly, let's just compute the error of the Moving Average logic.
        # Let's see the error for the test_df where we predict based on train_df mean for the same day.
        
        train_counts = train_df.groupby(train_df['log_date'].dt.day_name())['student_count'].mean()
        
        test_predictions = []
        for day in test_df['log_date'].dt.day_name():
            if day in train_counts:
                test_predictions.append(train_counts[day])
            else:
                test_predictions.append(train_df['student_count'].mean()) # Fallback
                
        mae_student = mean_absolute_error(test_df['student_count'], test_predictions)
        rmse_student = np.sqrt(mean_squared_error(test_df['student_count'], test_predictions))
        
        # Baseline Student: Predict global mean of train_df
        baseline_student_preds = [train_df['student_count'].mean()] * len(test_df)
        mae_baseline_student = mean_absolute_error(test_df['student_count'], baseline_student_preds)
        rmse_baseline_student = np.sqrt(mean_squared_error(test_df['student_count'], baseline_student_preds))
        
        print(f"--- Student Demand Model (Moving Average by Day) ---")
        print(f"Model MAE: {mae_student:.2f} students, RMSE: {rmse_student:.2f} students")
        print(f"Baseline (Global Mean) MAE: {mae_baseline_student:.2f} students, RMSE: {rmse_baseline_student:.2f} students")
        print(f"Improvement over baseline: {(mae_baseline_student - mae_student) / mae_baseline_student * 100:.1f}%\n")

if __name__ == '__main__':
    evaluate()
