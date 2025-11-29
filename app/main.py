from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db, engine # <-- Import engine
from sqlmodel import SQLModel # <-- Import SQLModel
from app.routes import menu, feedback

app = FastAPI(title="Smart Mess Analyzer API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ADD THIS BLOCK FOR A ONE-TIME RESET ---
@app.on_event("startup")
def on_startup():
    # Drops all tables (use with caution)
    # SQLModel.metadata.drop_all(engine)
    
    # Creates all tables
    init_db()
# -------------------------------------------

app.include_router(menu.router)
app.include_router(feedback.router)

@app.get("/")
def root():
    return {"message": "API is running with PostgreSQL + HuggingFace Sentiment Analysis"}

