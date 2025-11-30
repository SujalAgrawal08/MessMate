import matplotlib
import matplotlib.pyplot as plt
import io
import base64
from sqlmodel import Session, select
from app.models import Feedback

# Force non-GUI backend to prevent server crashes
matplotlib.use('Agg')

def generate_sentiment_chart(session: Session):
    # 1. Fetch Data
    data = session.exec(select(Feedback)).all()
    if not data:
        return None
    
    # 2. Manual Counting to ensure fixed order
    # This prevents the "colors swapping" bug
    counts = {
        "Positive": 0,
        "Neutral": 0, 
        "Negative": 0
    }

    for f in data:
        # Check standard HuggingFace labels OR readable text
        s = f.sentiment
        if s == "LABEL_2" or s == "positive":
            counts["Positive"] += 1
        elif s == "LABEL_1" or s == "neutral":
            counts["Neutral"] += 1
        elif s == "LABEL_0" or s == "negative":
            counts["Negative"] += 1

    # 3. Prepare Data for Plotting (Fixed Order)
    categories = ["Positive", "Neutral", "Negative"]
    values = [counts["Positive"], counts["Neutral"], counts["Negative"]]
    
    # 4. Define Colors (Green, Gray, Red)
    colors = ["#22c55e", "#9ca3af", "#ef4444"] 

    # 5. Generate Plot
    plt.figure(figsize=(5, 4))
    plt.bar(categories, values, color=colors)
    
    plt.title("Sentiment Distribution")
    plt.ylabel("Count")
    
    # Ensure y-axis uses whole numbers (integers) only
    if max(values) > 0:
        plt.yticks(range(0, max(values) + 2))
    
    plt.tight_layout()

    # 6. Save to Base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format="png")
    buffer.seek(0)
    img_data = base64.b64encode(buffer.getvalue()).decode("utf-8")
    buffer.close()
    
    return img_data