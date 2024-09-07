from typing import List, Optional, Union
from fastapi import FastAPI, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import google.generativeai as genai
import os
from dotenv import load_dotenv
import db as db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a model for the request body
class FormRequest(BaseModel):
    topic: str = Form(str),
    numberOfQuestions: str = Form(None),
    gradeLevel: str = Form(None),
    commonCoreStandards: str = Form(None),
    skills: str = Form(None),
    questionType: Union[List[str], str] = Form(None),  # Accepting multiple values
    state: str = Form(None)

@app.post("/api/lesson-plan")
async def lesson_plan(request: FormRequest):
    # data = await request.json()
    # topic = data.get('topic')
    print("LessonRequest ", request)
    lesson_plan = await generate_lesson_plan(request)
    return {"lessonPlan": lesson_plan}

@app.post("/api/test")
async def test(request: FormRequest):
    # data = await request.json()
    # concept = data.get('concept')
    print("Made it to TEST")
    print("TestRequest ", request)
    test = await generate_test(request)
    return {"test": test}

@app.post("/api/activities")
async def activities(request: FormRequest):
    # data = await request.json()
    # concept = data.get('concept')
    print("ActivityRequest ", request)
    activities = await generate_activities(request)
    return {"activities": activities}

from fastapi import Depends
from sqlalchemy.orm import Session

# # Dependency to get the database session
# def get_db():
#     db1 = db.SessionLocal()
#     try:
#         yield db1
#     finally:
#         db1.close()

# Storing user info
@app.post("/api/auth/google")
async def google_auth(info: dict, db1: Session = Depends(db.get_db)):
    print("Auth info: ", info)
    return db.create_user(db1, info)# {firstName = info['firstName'], info['lastName'], info['email']})
    return {"message": "Auth info received successfully"}

# Verify the token with Google's API, implement in future because more secure
# class GoogleAuthRequest(BaseModel):
#     token: str

# @app.post("/api/auth/google")
# async def google_auth(google_auth: GoogleAuthRequest):
#     try:
#         response = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={google_auth.token}")
#         if response.status_code != 200:
#             raise HTTPException(status_code=401, detail="Invalid token")

#         user_info = response.json()
#         # Create a JWT or session based on the user info
#         return {"token": "your-server-side-jwt-or-session-token"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Authentication failed")


# Load .env environment variables
load_dotenv()

genai.configure(api_key=os.environ["API_KEY"])

model = genai.GenerativeModel('gemini-1.5-flash')

async def generate_lesson_plan(request: FormRequest):
    # Construct the prompt based on user input
    prompt = f"Write a lesson plan for a teacher about this topic '{request.topic}'."

    if request.numberOfQuestions and (type(request.numberOfQuestions) is not type((Form(None),))):
        print("NumQuestions: ", request.numberOfQuestions)
        prompt += f" Include {request.numberOfQuestions} questions."

    if request.gradeLevel:
        print("Grade Level: ", request.gradeLevel)
        prompt += f" Grade Level: {request.gradeLevel}."

    if request.commonCoreStandards:
        print("Standards: ", request.commonCoreStandards)
        prompt += f" Common Core Standards: {request.commonCoreStandards}."

    if request.skills:
        print("Skills: ", request.skills)
        prompt += f" Focus on skills: {request.skills}."

    if request.questionType and (type(request.questionType) is not type((Form(None),))):
        print("QuestionType: ", request.questionType)
        prompt += f" Question Types: {', '.join(request.questionType)}."

    if request.state:
        print("State: ", request.state)
        prompt += f" Focus response using standards from this state: {request.state}."
    response = model.generate_content(prompt)
    print("Lesson plan response: ", response)
    # Only iterate 5 or more times if a bad response is received
    numIterations = 0
    isValidResp = False
    while not isValidResp and numIterations < 5:
        try:
            response.text
            isValidResp = True
        except:
            numIterations += 1
            print("Regenerate response")
            response = model.generate_content(prompt)
            print("Lesson plan response: ", response)
    if numIterations == 5:
        returnResp = "Error in AI response, try again or change request."
    else:
        returnResp = response.text
    return returnResp

async def generate_test(request: FormRequest):
    # Construct the prompt based on user input
    prompt = f"Write a test for a teacher on the topic '{request.topic}'."

    if request.numberOfQuestions and (type(request.numberOfQuestions) is not type((Form(None),))):
        prompt += f" Include {request.numberOfQuestions} questions."

    if request.gradeLevel:
        prompt += f" Grade Level: {request.gradeLevel}."

    if request.commonCoreStandards:
        prompt += f" Common Core Standards: {request.commonCoreStandards}."

    if request.skills:
        prompt += f" Focus on skills: {request.skills}."

    if request.questionType and (type(request.questionType) is not type((Form(None),))):
        prompt += f" Question Types: {', '.join(request.questionType)}."
        if "Reading Passage" in request.questionType:
            print("Reading Passage")
            if request.gradeLevel:
                prompt += f" Very important the length of the reading passage should be at least 200 words and 100 times the grade level."
            else:
                prompt += " Very important the length of the reading passage should be at least 200 words and make it longer depending on the other criteria."
    if request.state:
        prompt += f" Focus response using standards from this state: {request.state}."
    print("Prompt: ", prompt)
    response = model.generate_content(prompt)
    print("Test response: ", response)
    # Only iterate 5 or more times if a bad response is received
    numIterations = 0
    isValidResp = False
    while not isValidResp and numIterations < 5:
        try:
            response.text
            isValidResp = True
        except:
            numIterations += 1
            print("Regenerate response")
            response = model.generate_content(prompt)
            print("Test response: ", response)
    if numIterations == 5:
        returnResp = "Error in AI response, try again or change request."
    else:
        returnResp = response.text
    return returnResp

async def generate_activities(request: FormRequest):
    # Construct the prompt based on user input
    prompt = f"Generate some activities that a teacher could use to explain this concept for students '{request.topic}'."

    if request.numberOfQuestions and (type(request.numberOfQuestions) is not type((Form(None),))):
        prompt += f" Include {request.numberOfQuestions} questions."

    if request.gradeLevel:
        prompt += f" Grade Level: {request.gradeLevel}."

    if request.commonCoreStandards:
        prompt += f" Common Core Standards: {request.commonCoreStandards}."

    if request.skills:
        prompt += f" Focus on skills: {request.skills}."

    if request.questionType and (type(request.questionType) is not type((Form(None),))):
        prompt += f" Question Types: {', '.join(request.questionType)}."
    
    if request.state:
        prompt += f" Focus response using standards from this state: {request.state}."
    response = model.generate_content(prompt)
    print("Activities response: ", response)
    # Only iterate 5 or more times if a bad response is received
    numIterations = 0
    isValidResp = False
    while not isValidResp and numIterations < 5:
        try:
            response.text
            isValidResp = True
        except:
            numIterations += 1
            print("Regenerate response")
            response = model.generate_content(prompt)
            print("Activities response: ", response)
    if numIterations == 5:
        returnResp = "Error in AI response, try again or change request."
    else:
        returnResp = response.text
    return returnResp

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
