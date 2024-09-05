from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime

# You need a User model that represents the user data in your database
Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    firstName = Column(String, index=True)
    lastName = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    visitCounter = Column(Integer, default=1)  # New field for counting visits
    lastVisit = Column(DateTime, default=datetime.utcnow)  # New field for storing the last visit date

# You’ll need to set up a session to interact with the database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"  # Replace with your database URL

# Set `check_same_thread=False` in the SQLite connection string and allow engine to be used in different threads
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Initialize the database
Base.metadata.create_all(bind=engine)


# Define the Pydantic model to validate the incoming data
class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: str

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_sessionlocal():
    return SessionLocal()

def create_user(db: Session, user: UserCreate):
    # Check if the user already exists
    print("UserCreate: ", user)
    existing_user = db.query(User).filter(User.email == user['email']).first()
    if existing_user:
        # User exists: increment the visit counter and update the last visit date
        existing_user.visitCounter += 1
        existing_user.lastVisit = datetime.utcnow()
        db.commit()
        db.refresh(existing_user)
        return {"message": "User already exists. Visit counter incremented.", "user": existing_user}

    # User doesn't exist: create a new user
    new_user = User(
        firstName=user['firstName'],
        lastName=user['lastName'],
        email=user['email'],
        visitCounter=1,  # Initial visit count
        lastVisit=datetime.utcnow()  # Set last visit as the current time
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User created successfully", "user": new_user}