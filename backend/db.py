from fastapi import Form
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from sqlalchemy.orm import Session, relationship
from datetime import datetime

# You need a User model that represents the user data in your database
Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, unique=True)
    firstName = Column(String, index=True)
    lastName = Column(String, index=True)
    email = Column(String, index=True)
    visitCounter = Column(Integer, default=1)  # New field for counting visits
    lastVisit = Column(DateTime, default=datetime.utcnow())  # New field for storing the last visit date

# For services used
class Service(Base):
    __tablename__ = 'services_used'
    id = Column(Integer, unique=True, primary_key=True)
    email_id = Column(String, index=True)
    service_used = Column(String, index=True)
    inputs = relationship('Input', backref='services_used')
    lastVisit = Column(DateTime, default=datetime.utcnow())  # New field for storing the last visit date

    # For debugging
    def __repr__(self):
        return f'<ServiceInfo "{self.email_id}">'

# The different topics entered
class Input(Base):
    __tablename__ = 'inputs'
    id = Column(Integer, primary_key=True, unique=True)
    input = Column(String, index=True)
    email = Column(String, index=True)
    parent_id = Column(Integer, ForeignKey("services_used.id"))

    # For debugging
    def __repr__(self):
        return f'<Input "{self.input}">'

# You’ll need to set up a session to interact with the database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# Set `check_same_thread=False` in the SQLite connection string and allow engine to be used in different threads
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Storing user and service data
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Initialize the databases
Base.metadata.create_all(bind=engine)


# Define the Pydantic models to validate the incoming data
class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: str

# Define the Pydantic models to validate the incoming data
class ServiceUsed(BaseModel):
    userEmail: str
    service: str
    inputs: list[str]

# Dependency to get the database session for user data
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# For basic user data
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

def add_user_usage(db: Session, service_info: ServiceUsed):
    # Check if the user already exists
    print("Service info: ", service_info)

    # Service that was used by user
    service_used = Service(
        email_id=service_info['userEmail'],
        service_used=service_info['service'],
        lastVisit=datetime.utcnow()  # Set last visit as the current time
    )

    for input in service_info['inputs']:
        if type(input) is str and input is not ' ' and input is not '':
            input_val = Input(input = input, email = service_info['userEmail'], services_used = service_used)
            # TODO: Check if info below is necessary
            db.add(input_val)
            db.commit()
            db.refresh(input_val)

    # Add services to db
    db.add(service_used)
    db.commit()
    db.refresh(service_used)
    
    return {"message": "Service used successfully added", "service_used": service_used}