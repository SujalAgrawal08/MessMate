import io
import base64
import matplotlib.pyplot as plt
import pandas as pd
from sqlmodel import Session, select
from app.models import Feedback

def generate_sentiment_chart(session: Session):
    data = session.exec(select(Feedback)).all()
    if not data:
        return None
    
    df = pd.DataFrame(
        [(f.sentiment, f.score) for f in data],
        columns=["sentiment", "score"]
    )
    
    plt.figure(figsize=(5, 4))
    df["sentiment"].value_counts().plot(kind="bar", color=["green", "gray", "red"])
    plt.title("Sentiment Distribution")
    plt.ylabel("Count")
    plt.tight_layout()

    buffer = io.BytesIO()
    plt.savefig(buffer, format="png")
    buffer.seek(0)
    img_data = base64.b64encode(buffer.getvalue()).decode("utf-8")
    buffer.close()
    return img_data
