from fastapi import FastAPI
from .models import Base, engine
from .routes import router

app = FastAPI()

@app.on_event("startup")
async def startup():
    # Create the database tables
    Base.metadata.create_all(bind=engine)

app.include_router(router)
