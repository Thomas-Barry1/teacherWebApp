from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests

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

async def generate_lesson_plan(topic: str):
    # Placeholder for Google Generative AI and ChatGPT logic
    return f"Lesson plan for {topic}"

async def generate_test(concept: str):
    # Placeholder for Google Generative AI and ChatGPT logic
    return f"Test for {concept}"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
