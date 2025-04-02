import re
import time
from typing import List, Optional, Union
from fastapi import FastAPI, Form, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
import google.api_core
import google.api_core.exceptions
from pydantic import BaseModel
import requests
import google.generativeai as genai
import google
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session

# Define a model for the request body of every method
class FormRequest(BaseModel):
    user: str = Form(str),
    topic: str = Form(str),
    numberOfQuestions: str = Form(None),
    gradeLevel: str = Form(None),
    commonCoreStandards: str = Form(None),
    skills: str = Form(None),
    questionType: Union[List[str], str] = Form(None),  # Accepting multiple values
    state: str = Form(None)
    standards: Optional[str] = Form(None)

class Question(BaseModel):
    question: str
    answerChoices: List[str]
    correctAnswer: str

class Full_Question(BaseModel):
    question: Question
    selected_answer: Optional[str]

class Gap_Data(BaseModel):
    user: str
    questions: List[Full_Question]

class StandardPerformance(BaseModel):
    standard: str
    strength: Optional[str]
    description: str

class InlineGapAssessment(BaseModel):
    overallStrength: Optional[str]
    performanceSummary: str
    standardsPerformance: List[StandardPerformance]
    improvementPlan: str


def ask_model(given_model, prompt):
    """Helper method"""
    # Only iterate 5 or more times if a bad response is received
    numIterations = 0
    isValidResp = False
    while not isValidResp and numIterations < 5:
        try:
            response = given_model.generate_content(prompt)
            response.text
            isValidResp = True
        except google.api_core.exceptions.ResourceExhausted as e:
            numIterations += 1
            print("Regenerate response after delay", e)
            time.sleep(numIterations*3)
        except:
            numIterations += 1
            print("Regenerate response after delay")
    if numIterations == 5:
        returnResp = "Error in AI response, try again or change request."
    else:
        returnResp = response.text
    print(f"\n***Prompt:*** {prompt}\n***Response:{returnResp}***")
    return returnResp

def categorize_question(given_question):
    """Helper method"""
    prompt = f"What common core standard does this question belong to? {given_question}? Give the exactly ONE(NOT MORE THAN ONE) common core standard in the form like CCSS.3.MD.C.5.a or 3.NF.A.3."
    category = ask_model(model, prompt)
    cleaned_up_category = re.findall(r"\b[A-Z0-9]+\.[A-Z]+\.[A-Z]+\.[0-9]+[a-z]?\b|\b[0-9]+[-.]?[A-Z]+[-.]?[A-Z]+[-.]?[0-9]?[a-z]?\b|\b[A-Z]+[-.]?[0-9]+[-.]?[A-Z]+[-.]?[0-9]?[-.]?[0-9]?\b|\b[0-9]?\.[A-Z]+\.[A-Z]?\.[0-9]?[a-z]?\b", category)
    if not cleaned_up_category:
        print("No category was assigned, so regenerate")
        prompt = f"The following question does not belong to a common core standard, but can you please give a specific category (in 1-3 words max) based on the relevent subject area (e.g., 'Python Programming', 'Algebra', 'Physics', etc.). If possible, I do not want the subject area I just mentioned but I want to get a categorization inside a particular subject area. Here is the question: {given_question}"
        cleaned_up_category = ask_model(model, prompt)
    return cleaned_up_category

async def generate_gap_assessment(given_questions: List[Full_Question]):
    print("Made it to generate gap assessment")
    added_category_list = []

    for question_iterator in given_questions:
        question = question_iterator.question.question
        student_answer = question_iterator.selected_answer
        correct_answer = question_iterator.question.correctAnswer

        category = categorize_question(question)
        if isinstance(category, list): #in the case where multiple categories are assigned.
            category = category[0]
        added_category_list.append({
            "question": question,
            "student_answer": student_answer,
            "correct_answer": correct_answer,
            "category": category
        })
    print("The added_category_list: ", added_category_list)
    
    category_scores = {}

    for item in added_category_list:
        if not item["category"]: #This should never be trigged as I modified the categorize_question method to assign a category even if no CSSS standard was assigned
            category = "unasssigned_category"
        else:
            category = item["category"]

        student_answer = item["student_answer"].strip().lower()
        correct_answer = item["correct_answer"].strip().lower()

        # Assign score (exact match = 10, incorrect = 0)
        score = 10 if student_answer == correct_answer else 0

        if category not in category_scores:
            category_scores[category] = {"total_score": 0, "question_count": 0}

        category_scores[category]["total_score"] += score
        category_scores[category]["question_count"] += 1

    print("Category Scores: ", category_scores)
    category_final_grades = {}
    for category, data in category_scores.items():
        total_score = data["total_score"]
        question_count = data["question_count"]
        
        overall_percentage = (total_score / (question_count * 10)) * 100 if question_count > 0 else 0
        category_final_grades[category] = round(overall_percentage, 2)

    print("Final categorized grades in percentages:", category_final_grades)
    print("Going to call generate_gap_assessment")
    gap_assessment = await generate_gap_analysis(category_final_grades)
    print("Final gap assessment: ", gap_assessment)
    return {"category_final_grades": category_final_grades, "gap_assessment": gap_assessment}

model = genai.GenerativeModel('gemini-1.5-flash')

def get_new_model():
    return genai.GenerativeModel('gemini-1.5-flash')

def filter_strength_response(response):
    valid_responses = ['strong', 'moderate', 'weak']
    response_text = response.strip().lower()

    if response_text in valid_responses:
        return response_text
    else:
        return "Error: Invalid response"
    
async def generate_gap_analysis(extracted_information):
    print("INSIDE generate_gap_analysis")
    prompt = 'A teacher has a student whose test results were analyzed. In particular,'
    for category, score in extracted_information.items():
        prompt += (f"in the {category} category, they scored {score}%,")

    #Ask for overall_strength
    overall_strength_prompt = prompt + (f"Can you give me a one word answer of the overall strength of this student. Either tell me Stong, Moderate, or Weak. Please only one word answer")
    overall_strength = ask_model(model, overall_strength_prompt)

    #Filter overall_strength: Weak,Moderate,Strong
    print(f"The overall stength response - BEFORE filter: {overall_strength}")
    overall_strength = filter_strength_response(overall_strength)
    print(f"The overall stength response - AFTER filter: {overall_strength}")


    #Ask for performance_summary
    performance_summary_prompt = prompt + (f"Can you create performance summary for this student? Do not mention the student name in your response. Just say 'this student'\n")
    performance_summary = ask_model(model, performance_summary_prompt)
    
    ##Ask for improvement_plan
    improvement_plan_prompt = prompt + (f"Can you create a plan this student and create plans on how they can improve?\n")
    improvement_plan = ask_model(model, improvement_plan_prompt)

    #for each standard
        #Strength
        #Description

    standardsPerformance = []
    prompt_second = 'A teacher has a student whose test results were analyzed. In particular,'
    for category, score in extracted_information.items():

        print("Gonna get new the model to ask specific questions for each standard")
        new_model = get_new_model()

        particular_standards_performance_prompt = prompt_second + (f"In the {category} category, they scored {score}%,")

        print(f"particular_standards_performance_prompt: {particular_standards_performance_prompt}")
        particular_strength_prompt = particular_standards_performance_prompt + (f"Can you give me a one word answer of the strength of this student for this category? Either tell me Stong, Moderate, or Weak. Please only one word answer ")
        particular_strength = ask_model(new_model, particular_strength_prompt)


        print(f"The particular_strength response - before filter : {particular_strength}")
        particular_strength = filter_strength_response(particular_strength)
        print(f"The particular_standards_performance_prompt_strength response - after filter : {particular_strength}")

        particular_description_prompt = particular_standards_performance_prompt + (f"Can you give me a the description of this student performance for this category?")
        print(f"particular_description_prompt: {particular_description_prompt}")
        particular_description = ask_model(new_model, particular_description_prompt)

        #all the values are ready
        standardsPerformance.append({
            "standard": category,
            "description": particular_description,
            "strength": particular_strength
        })
    
    print(f"""overallStrength={overall_strength},performanceSummary={performance_summary}, standardsPerformance={standardsPerformance},  improvementPlan={improvement_plan}""")
    
    #I am running into validation errors herre 
    returnOverallGapAssessment = InlineGapAssessment( overallStrength=overall_strength, performanceSummary=performance_summary, standardsPerformance=standardsPerformance, improvementPlan=improvement_plan)
    return returnOverallGapAssessment

async def generate_standards(request: FormRequest):
    prompt = f"Create a set of 10 educational standards on the topic '{request.topic}."
    prompt += f"For each standard, give one sentence only. So I want a total of 10 sentences only."
    prompt += "Make sure each standard is able to be tested via a multiple choice and/or true/false question to determine proficiency."
    if request.gradeLevel:
        prompt += f" The standards should be specific to {request.gradeLevel}"

    if request.commonCoreStandards:
        prompt += f" The standards should align with {request.commonCoreStandards}."

    if request.skills:
        prompt += f" The standards should align with {request.skills}."
    
    if request.state:
        prompt += f" Focus response using standards from this state: {request.state}."
    prompt+= f"I expect the format of the response to be only 10 sentences. One sentence per standard, and please number the standards."
    return ask_model(model, prompt)

async def generate_gap_test(request: FormRequest):
    # Construct the prompt based on user input
    prompt = f"Write a test for a teacher on the topic '{request.topic}', and include answer key at end. "

    if request.standards:
        prompt+= f"Base the questions on the following educational standards: {request.standards}. " # A GAP assessment will be produced after the test from these standards. "
        prompt+= "Ensure that each question directly assesses one or more of these standards, evaluating students' understanding and application. "
        prompt+= "Please only include questions and answer key, no explanation about how your response does so. "
        prompt+= "Each question must have exactly one correct answer. "
        prompt += "This next fact is VERY important. Please return your answer in the following JSON format. "
        prompt += "{Question, AnswerChoices[], CorrectAnswer}. Don't give me any additional sentences."
        print("Standards included")

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
    print("Gap test response: ", response)
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
    return ask_model(model, prompt)