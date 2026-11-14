import os
from pathlib import Path
from dotenv import load_dotenv

# Locate the backend folder
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables
load_dotenv(BASE_DIR / ".env")

# Retrieve Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print("Config loaded successfully!")
print("Gemini API key found:", bool(GEMINI_API_KEY))

