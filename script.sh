#!/bin/bash
python -m venv env
source env/bin/activate
pip install fastapi uvicorn 
# Maybe add these on later: sqlalchemy sqlalchemy --no-deps pymysql openai cryptography