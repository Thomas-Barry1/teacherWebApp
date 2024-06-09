from sqlalchemy import Column, Integer, String, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://root:rootpassword@db/teacher_helper"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class LessonPlan(Base):
    __tablename__ = 'lesson_plans'

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(255), nullable=False)
    grade_level = Column(String(255), nullable=False)
    duration = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)

class Quiz(Base):
    __tablename__ = 'quizzes'

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(255), nullable=False)
    grade_level = Column(String(255), nullable=False)
    questions = Column(Text, nullable=False)
