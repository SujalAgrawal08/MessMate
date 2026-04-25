from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db, engine, get_session
from sqlmodel import SQLModel, Session
from sqlalchemy import text
import datetime
from app.routes import menu, feedback, auth_routes, waste, attendance, analytics, leaves 

app = FastAPI(title="MessMate Backend")

@app.get("/health")
@app.head("/health")
async def health_check():
    return {"status": "active"}

@app.get("/keep-alive")
def keep_alive(session: Session = Depends(get_session)):
    """Automated endpoint to prevent free-tier Supabase and Render from sleeping."""
    # Execute a minimal query to keep the DB connection pool active
    session.exec(text("SELECT 1;"))
    timestamp = datetime.datetime.now().isoformat()
    print(f"Keep-alive ping received at {timestamp}")
    return {"status": "alive", "timestamp": timestamp}

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- BLOCK FOR A ONE-TIME RESET ---
@app.on_event("startup")
def on_startup():
    # Drops all tables (use with caution)
    # SQLModel.metadata.drop_all(engine)
    
    import os
    from app.services.ml_engine import get_model, MODELS_DIR, LOGS_DIR
    
    os.makedirs(MODELS_DIR, exist_ok=True)
    os.makedirs(LOGS_DIR, exist_ok=True)
    
    # Preload the ML model into memory
    model = get_model()
    
    # Fallback for deployed environments (like Render) where the .pkl file might not exist
    if not model:
        try:
            from scripts.train_model import train_and_save_model
            print("Model not found. Attempting initial training...")
            train_and_save_model()
            get_model() # Load it after training
        except Exception as e:
            print(f"Failed to train initial model: {e}")
    
    # Creates all tables
    init_db()
# -------------------------------------------

app.include_router(auth_routes.router)
app.include_router(menu.router)
app.include_router(feedback.router)
app.include_router(waste.router) # Register waste router
app.include_router(attendance.router)
app.include_router(analytics.router)
app.include_router(leaves.router)
@app.get("/")
def root():
    return {"message": "API is running with PostgreSQL + HuggingFace Sentiment Analysis"}

