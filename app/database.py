# from sqlmodel import SQLModel, create_engine, Session
# from dotenv import load_dotenv
# import os

# load_dotenv()

# DATABASE_URL = os.getenv("POSTGRES_URL")
# engine = create_engine(DATABASE_URL)

# def init_db():
#     SQLModel.metadata.create_all(engine)

# def get_session():
#     with Session(engine) as session:
#         yield session

from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os

load_dotenv()

# 1. Get the URL
DATABASE_URL = os.getenv("POSTGRES_URL")

# 2. Fix URL format if necessary (Supabase provides 'postgres://', SQLAlchemy needs 'postgresql://')
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 3. Create Engine with connection checks
# pool_pre_ping=True is the critical fix here
engine = create_engine(
    DATABASE_URL, 
    echo=True, 
    pool_pre_ping=True,  # <--- THIS FIXES THE CLOSED CONNECTION ERROR
    pool_recycle=1800    # Recycle connections every 30 mins
)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session