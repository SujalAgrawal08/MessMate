from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db, engine 
from sqlmodel import SQLModel 
from app.routes import menu, feedback, auth_routes, waste, attendance, analytics, leaves 

app = FastAPI(title="MessMate Backend")
@app.get("/health")
@app.head("/health")
async def health_check():
    return {"status": "active"}

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

