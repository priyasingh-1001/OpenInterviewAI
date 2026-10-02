# ?? OpenInterviewAI

> **AI-powered Interview Preparation System** — Practice mock interviews, receive real-time AI feedback, track your progress, and land your dream job. 100% free & open source.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-6d28d9?style=for-the-badge)

---

## ? Features

- ?? **AI Mock Interviews** — Adaptive, role-specific technical & behavioral questions
- ?? **Progress Tracking** — Visual score trends, session history, analytics
- ?? **Resume Upload** — Upload PDF/DOCX; AI tailors questions to your experience
- ?? **User Profiles** — Set target role, experience level, country, bio
- ?? **Auth System** — Secure register/login with persistent sessions
- ?? **Fully Responsive** — Seamless on mobile, tablet, and desktop
- ?? **Premium Dark UI** — Glassmorphism design with Emerald & Slate palette
- ??? **Real Database** — SQLite (swappable to PostgreSQL)
- ?? **Open Source** — MIT licensed, easy to self-host

---

## ??? Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS |
| **Backend** | FastAPI (Python), Uvicorn |
| **Database** | SQLite via SQLAlchemy (PostgreSQL-ready) |
| **AI Engine** | Pluggable — connect Gemini, Groq, or OpenAI |

---

## ?? Quick Start

### 1. Clone
```bash
git clone https://github.com/YOUR_USERNAME/OpenInterviewAI.git
cd OpenInterviewAI
```

### 2. One-click start (Windows)
```bash
# Double-click START.bat
# OR from root folder:
npm install && npm run dev
```

### 3. Manual (two terminals)
```bash
# Terminal 1 — Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

### 4. Open browser
| | URL |
|---|---|
| ?? App | http://localhost:3000 |
| ? API | http://localhost:8000 |
| ?? Docs | http://localhost:8000/docs |

---

## ?? Project Structure

```
OpenInterviewAI/
+-- frontend/          # Next.js 16 app (TypeScript)
¦   +-- src/app/
¦       +-- dashboard/ # Live stats dashboard
¦       +-- interview/ # AI interview session
¦       +-- profile/   # Profile + resume upload
¦       +-- progress/  # Charts & history
+-- backend/           # FastAPI (Python)
¦   +-- app/
¦       +-- main.py    # All API routes
¦       +-- models.py  # SQLAlchemy models
¦       +-- schemas.py # Pydantic validation
+-- START.bat          # Windows one-click launcher
+-- package.json       # npm run dev (starts both)
```

---

## ?? API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/register | Register new user |
| POST | /api/login | Login |
| GET | /api/users/{id} | Get user + profile |
| PATCH | /api/users/{id}/profile | Update profile |
| POST | /api/users/{id}/resume | Upload resume |
| GET | /api/users/{id}/resumes | List resumes |
| POST | /api/users/{id}/interviews | Start interview |
| GET | /api/users/{id}/interviews | Interview history |
| POST | /api/chat | AI chat |

---

## ??? Roadmap

- [ ] Real AI (Google Gemini / Groq)
- [ ] Voice input
- [ ] PDF feedback export
- [ ] Docker deployment
- [ ] PostgreSQL support
- [ ] Multi-language

---

## ?? Contributing

1. Fork the repo
2. `git checkout -b feature/your-feature`
3. `git commit -m "Add your feature"`
4. `git push origin feature/your-feature`
5. Open a Pull Request

---

## ?? License

MIT License — see [LICENSE](LICENSE) for details.

---
<div align="center">Built with ?? for job seekers worldwide — ? Star if it helped you!</div>
