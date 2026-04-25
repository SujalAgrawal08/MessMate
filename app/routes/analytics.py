from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.database import get_session
from app.services.ml_engine import (
    generate_demand_forecast, 
    generate_waste_regression_chart,
    predict_tomorrow_waste,
    predict_waste_fast,
    METRICS_LOG_PATH
)
from pydantic import BaseModel
import os
import json

class PredictWasteRequest(BaseModel):
    meal_type: str
    student_count: int
    day_of_week: str
    rolling_avg_attendance: float
    previous_day_waste: float

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/forecast/demand")
def get_demand_forecast(session: Session = Depends(get_session)):
    """Returns the predicted student count for next 7 days."""
    return generate_demand_forecast(session)

@router.get("/forecast/waste-chart")
def get_waste_model_chart(session: Session = Depends(get_session)):
    """Returns a regression plot (Base64) showing Waste vs Students relationship."""
    chart_data = generate_waste_regression_chart(session)
    if chart_data:
        return {"chart": chart_data}
    return {"message": "Not enough data to train model yet."}

@router.get("/forecast/waste-tomorrow")
def get_tomorrow_waste_prediction(session: Session = Depends(get_session)):
    """Returns the text-based prediction for tomorrow's waste."""
    return predict_tomorrow_waste(session)

@router.post("/predict_waste")
def fast_predict_waste(request: PredictWasteRequest):
    """Fast inference endpoint for predicting waste (<100ms)"""
    return predict_waste_fast(
        meal_type=request.meal_type,
        student_count=request.student_count,
        day_of_week=request.day_of_week,
        rolling_avg=request.rolling_avg_attendance,
        prev_waste=request.previous_day_waste
    )

@router.get("/model_metrics")
def get_model_metrics():
    """Returns the logged metrics and predictions for the model."""
    if os.path.exists(METRICS_LOG_PATH):
        try:
            with open(METRICS_LOG_PATH, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return []
    return []