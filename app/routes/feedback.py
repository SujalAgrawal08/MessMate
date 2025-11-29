from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.models import Feedback
from app.schemas import FeedbackCreate
from app.services.sentiment import analyze_text
from app.services.charts import generate_sentiment_chart

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("/")
def give_feedback(feedback: FeedbackCreate, session: Session = Depends(get_session)):
    sentiment_result = analyze_text(feedback.comment)
    fb = Feedback(
        name=feedback.name,
        comment=feedback.comment,
        sentiment=sentiment_result["label"],
        score=sentiment_result["score"]
    )
    session.add(fb)
    session.commit()
    session.refresh(fb)
    return fb

@router.get("/")
def get_feedback(session: Session = Depends(get_session)):
    return session.exec(select(Feedback)).all()

@router.get("/chart")
def get_feedback_chart(session: Session = Depends(get_session)):
    chart_data = generate_sentiment_chart(session)
    if chart_data:
        return {"chart": chart_data}
    return {"message": "No data available"}
