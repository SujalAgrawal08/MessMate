from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.database import get_session
from app.services.ml_engine import (
    generate_demand_forecast, 
    generate_waste_regression_chart,
    predict_tomorrow_waste 
)

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