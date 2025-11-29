from transformers import pipeline

sentiment_analyzer = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")

def analyze_text(text: str):
    result = sentiment_analyzer(text)[0]
    return {"label": result["label"], "score": result["score"]}
