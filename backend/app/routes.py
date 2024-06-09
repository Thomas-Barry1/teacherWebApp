from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .models import SessionLocal, LessonPlan, Quiz

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
async def read_root():
    return {"Hello": "World"}

@router.post("/lesson_plans/")
async def create_lesson_plan(lesson_plan: LessonPlan, db: Session = Depends(get_db)):
    db.add(lesson_plan)
    db.commit()
    db.refresh(lesson_plan)
    return lesson_plan

@router.post("/quizzes/")
async def create_quiz(quiz: Quiz, db: Session = Depends(get_db)):
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz
