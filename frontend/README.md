
# HireMEgent AI
### Your AI-powered career command centre.

**Designed & Built by 1SH6YAAN**

HireMEgent AI is a futuristic AI-powered career assistant designed to help job seekers analyze resumes, explore projects, plan careers, match job descriptions, practice interviews, and manage applications.

## Features

1. **Resume Intelligence** — Analyze resumes and discover strengths, weaknesses, and skills.
2. **AI Project Lab** — Generate practical project ideas based on career goals.
3. **Career Roadmap** — Build structured learning and career plans.
4. **Job Matcher** — Compare resumes against job descriptions.
5. **AI Interview Studio** — Generate interview questions and evaluate answers.
6. **Application Tracker** — Track applications and monitor career progress.

## Technology Stack

- React
- Vite
- CSS
- Python
- FastAPI
- SQLite
- Ollama
- Llama 3.2 (3B)

## Requirements

- Python 3.10+
- Node.js and npm
- Ollama

## Installation

### 1. Clone or download the project

Open the project folder in VS Code.

### 2. Backend setup

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 3. Install Ollama

Install Ollama from:

https://ollama.com/

Pull the model:

```powershell
ollama pull llama3.2:3b
```

Make sure Ollama is running.

### 4. Start the backend

```powershell
cd backend
uvicorn main:app --reload
```

Backend:
http://127.0.0.1:8000

API documentation:
http://127.0.0.1:8000/docs

### 5. Start the frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL displayed in the terminal.

## Data Storage

Application tracking data is stored locally using SQLite.

## AI Processing

AI features use a locally running Ollama model. No Gemini API key is required.

## Creator

**1SH6YAAN**

HireMEgent AI — Your career. Your intelligence. Your next move.
