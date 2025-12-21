from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from app.database import get_session
from app.models import User
from app.auth import create_access_token, verify_token 
from passlib.context import CryptContext

router = APIRouter(tags=["Authentication"])

# 1. Setup Password Hashing (Argon2 or Bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 2. Setup Token Scheme (Required for get_current_user)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/register")
def register(user_data: User, session: Session = Depends(get_session)):
    # Hash the password before saving
    user_data.hashed_password = pwd_context.hash(user_data.hashed_password)
    session.add(user_data)
    session.commit()
    return {"message": "User created"}

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()
    
    # Verify User and Password
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # Create Token
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    """
    Decodes the token and retrieves the current User from the database.
    Used to protect routes (like applying for leave).
    """
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
        
    user = session.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
        
    return user