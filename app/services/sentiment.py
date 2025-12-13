from textblob import TextBlob

def analyze_text(text: str):
    """
    Lightweight Sentiment Analysis using TextBlob.
    Returns:
        label (str): 'positive', 'neutral', 'negative'
        score (float): Confidence score (0.0 to 1.0)
    """
    if not text:
        return {"label": "neutral", "score": 0.5}

    analysis = TextBlob(text)
    polarity = analysis.sentiment.polarity  

    if polarity > 0.1:
        label = "positive"  
        score = 0.9
    elif polarity < -0.1:
        label = "negative" 
        score = 0.9
    else:
        label = "neutral"   
        score = 0.8 

    return {"label": label, "score": score}