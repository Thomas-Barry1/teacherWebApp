from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
import google.generativeai as genai
import os
from dotenv import load_dotenv

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/lesson-plan")
async def lesson_plan(request: Request):
    data = await request.json()
    topic = data.get('topic')
    lesson_plan = await generate_lesson_plan(topic)
    return {"lessonPlan": lesson_plan}

@app.post("/api/test")
async def test(request: Request):
    data = await request.json()
    concept = data.get('concept')
    test = await generate_test(concept)
    return {"test": test}

@app.post("/api/activities")
async def activities(request: Request):
    data = await request.json()
    concept = data.get('concept')
    activities = await generate_activities(concept)
    return {"activities": activities}

# Load .env environment variables
load_dotenv()

genai.configure(api_key=os.environ["API_KEY"])

model = genai.GenerativeModel('gemini-1.5-flash')

async def generate_lesson_plan(topic: str):
    response = model.generate_content("Write a lesson plan for a teacher about this topic " + topic)
    return f"Lesson plan for {topic} "+ response.text

async def generate_test(concept: str):
    response = model.generate_content("Write a test with a few open response and multiple choice questions for a teacher about this concept " + concept)
    return f"Test for {concept} "+ response.text

async def generate_activities(concept: str):
    response = model.generate_content("Generate some activities that a teacher could use to explain this concept for students " + concept)
    return f"Activities for {concept} "+ response.text

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)






#  from app import app

# No additional code needed here since the app is already imported from app package

# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from sqlalchemy import create_engine, Column, Integer, String, Text
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
# import openai

# # Database setup
# DATABASE_URL = "mysql+pymysql://username:password@localhost/teacher_helper"
# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()

# class LessonPlan(Base):
#     __tablename__ = "lesson_plans"
#     id = Column(Integer, primary_key=True, index=True)
#     topic = Column(String(255), index=True)
#     grade_level = Column(String(255))
#     duration = Column(Integer)
#     content = Column(Text)

# class Quiz(Base):
#     __tablename__ = "quizzes"
#     id = Column(Integer, primary_key=True, index=True)
#     topic = Column(String(255), index=True)
#     grade_level = Column(String(255))
#     questions = Column(Text)

# Base.metadata.create_all(bind=engine)

# # FastAPI setup
# app = FastAPI()

# openai.api_key = 'YOUR_OPENAI_API_KEY'

# class LessonPlanRequest(BaseModel):
#     topic: str
#     grade_level: str
#     duration: int

# class QuizRequest(BaseModel):
#     topic: str
#     grade_level: str
#     num_questions: int

# @app.post("/generate-lesson-plan")
# async def generate_lesson_plan(request: LessonPlanRequest):
#     prompt = f"Generate a lesson plan for {request.topic} for grade {request.grade_level}. The lesson should last {request.duration} minutes."
#     response = openai.Completion.create(
#         engine="text-davinci-003",
#         prompt=prompt,
#         max_tokens=500
#     )
#     content = response.choices[0].text.strip()
    
#     db = SessionLocal()
#     lesson_plan = LessonPlan(topic=request.topic, grade_level=request.grade_level, duration=request.duration, content=content)
#     db.add(lesson_plan)
#     db.commit()
#     db.refresh(lesson_plan)
#     db.close()
    
#     return {"id": lesson_plan.id, "content": content}

# @app.post("/generate-quiz")
# async def generate_quiz(request: QuizRequest):
#     prompt = f"Generate a {request.num_questions}-question quiz for {request.topic} for grade {request.grade_level}."
#     response = openai.Completion.create(
#         engine="text-davinci-003",
#         prompt=prompt,
#         max_tokens=500
#     )
#     questions = response.choices[0].text.strip()
    
#     db = SessionLocal()
#     quiz = Quiz(topic=request.topic, grade_level=request.grade_level, questions=questions)
#     db.add(quiz)
#     db.commit()
#     db.refresh(quiz)
#     db.close()
    
#     return {"id": quiz.id, "questions": questions}

# @app.get("/lesson-plan/{id}")
# async def get_lesson_plan(id: int):
#     db = SessionLocal()
#     lesson_plan = db.query(LessonPlan).filter(LessonPlan.id == id).first()
#     db.close()
#     if lesson_plan is None:
#         raise HTTPException(status_code=404, detail="Lesson plan not found")
#     return {"topic": lesson_plan.topic, "grade_level": lesson_plan.grade_level, "duration": lesson_plan.duration, "content": lesson_plan.content}

# @app.get("/quiz/{id}")
# async def get_quiz(id: int):
#     db = SessionLocal()
#     quiz = db.query(Quiz).filter(Quiz.id == id).first()
#     db.close()
#     if quiz is None:
#         raise HTTPException(status_code=404, detail="Quiz not found")
#     return {"topic": quiz.topic, "grade_level": quiz.grade_level, "questions": quiz.questions}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
