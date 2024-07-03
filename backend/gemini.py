import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load .env environment variables
load_dotenv()

genai.configure(api_key=os.environ["API_KEY"])

model = genai.GenerativeModel('gemini-1.5-flash')

response = model.generate_content("Write a story about a AI and magic")
print(response.text)
