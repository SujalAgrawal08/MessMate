from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os

load_dotenv()

# --- Changed "POSTGRES_URL" to "DATABASE_URL" to match Render ---
# DATABASE_URL = os.getenv("POSTGRES_URL")  ------- Not required anymore, neither for local nor for deployment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("CRITICAL ERROR: DATABASE_URL is missing! Check Render Environment Variables.")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL, 
    echo=False,         
    pool_pre_ping=True,  
    pool_recycle=1800    
)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session