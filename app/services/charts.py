import matplotlib
import matplotlib.pyplot as plt
import io
import base64
from sqlmodel import Session, select
from app.models import Feedback

# Force non-GUI backend
matplotlib.use('Agg')

def generate_sentiment_chart(session: Session):
    data = session.exec(select(Feedback)).all()
    if not data:
        return None
    
    # Count sentiments
    counts = {"Positive": 0, "Neutral": 0, "Negative": 0}
    for f in data:
        s = f.sentiment
        if s == "LABEL_2" or s == "positive":
            counts["Positive"] += 1
        elif s == "LABEL_1" or s == "neutral":
            counts["Neutral"] += 1
        elif s == "LABEL_0" or s == "negative":
            counts["Negative"] += 1

    categories = ["Positive", "Neutral", "Negative"]
    values = [counts["Positive"], counts["Neutral"], counts["Negative"]]
    
    # Neon Green, Slate Grey, Neon Red
    colors = ["#4ade80", "#64748b", "#f87171"] 
    text_color = "#e2e8f0" # Slate-200

    # Create Figure with Transparent Background
    fig, ax = plt.subplots(figsize=(5, 4))
    fig.patch.set_alpha(0.0) # Transparent outer background
    ax.set_facecolor('#00000000') # Transparent inner background

    # Plot
    bars = ax.bar(categories, values, color=colors)

    # Styling Axis & Text
    ax.set_title("Sentiment Distribution", color="white", fontsize=12, fontweight='bold', pad=15)
    ax.set_ylabel("Count", color=text_color)
    ax.tick_params(axis='x', colors=text_color)
    ax.tick_params(axis='y', colors=text_color)
    
    # Subtle Grid
    ax.yaxis.grid(True, color='#334155', linestyle='--', alpha=0.5)
    ax.set_axisbelow(True)

    # Remove Borders (Spines)
    for spine in ax.spines.values():
        spine.set_edgecolor('#334155')
        spine.set_visible(False)
    ax.spines['bottom'].set_visible(True)

    # Ensure integers on Y-axis
    if max(values) > 0:
        plt.yticks(range(0, max(values) + 2))
    
    plt.tight_layout()

    # Save
    buffer = io.BytesIO()
    plt.savefig(buffer, format="png", transparent=True) 
    buffer.seek(0)
    img_data = base64.b64encode(buffer.getvalue()).decode("utf-8")
    plt.close()
    
    return img_data