# HireMEgent AI 🚀
### Your AI-Powered Career Command Centre

**Designed & Built by 1SH6YAAN**

HireMEgent AI is an AI-powered career assistant designed to help job seekers understand their strengths, improve their resumes, discover projects, plan career paths, prepare for interviews, and manage job applications — all in one futuristic workspace.

## 🌐 Live Demo

**[Launch HireMEgent AI](https://hire-m-egent-ai.vercel.app/)**

- **Frontend:** https://hire-m-egent-ai.vercel.app/
- **Backend API:** https://hiremegent-ai.onrender.com
- **API Documentation:** https://hiremegent-ai.onrender.com/docs

## ✨ Features

| Module | Description |
|---|---|
| 📄 Resume Intelligence | Analyze resumes, identify strengths, weaknesses and skills |
| 🧪 AI Project Lab | Generate personalized project ideas |
| 🗺️ Career Roadmap | Build structured learning plans and career milestones |
| 🎯 Job Matcher | Match resumes against job descriptions |
| 🎤 AI Interview Studio | Generate interview questions and evaluate answers |
| 📊 Application Tracker | Organize job applications and track progress |

## 🧠 AI Architecture

HireMEgent AI uses a cloud-based architecture:

- **AI Inference:** Groq
- **AI Model:** Llama 3.3 70B Versatile
- **Backend:** FastAPI
- **Frontend:** React + Vite
- **Database:** Supabase PostgreSQL
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render

## 🛠️ Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Framer Motion
- Three.js
- React Three Fiber

### Backend
- Python
- FastAPI
- Groq API
- SQLAlchemy
- PostgreSQL
- PyPDF
- python-docx

## ⚙️ Run Locally

### Prerequisites
- Python 3.10+
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/1shr3yaan/HireMEgent-AI.git
cd HireMEgent-AI
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

**Windows:**
```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure your backend environment variables in a `.env` file. Use your own credentials:

```env
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
DATABASE_URL=your_supabase_database_url
```

Start the backend:

```bash
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## 🔐 Environment Variables

Never commit API keys, database passwords, or `.env` files to GitHub.

Keep your credentials private and configure production environment variables through your hosting providers.

## 🚀 Future Improvements

- User authentication and personalized profiles
- Advanced career analytics
- Improved application tracking
- More AI-powered career tools

## 👨‍💻 Creator

**1SH6YAAN**

Built with curiosity, creativity, and a passion for AI-powered products.

*HireMEgent AI — Your career. Your intelligence. Your next move.*
