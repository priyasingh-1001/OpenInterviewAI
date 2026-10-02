import os
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import List

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from . import models, schemas
from .database import engine, get_db

# ─── Bootstrap ───────────────────────────────────────────────────────────────

# Drop all and recreate to pick up schema changes (development only)
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

UPLOAD_DIR = Path("uploads/resumes")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="OpenInterviewAI API",
    description="Full-stack backend for OpenInterviewAI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files statically
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _make_profile(user_id: int) -> models.Profile:
    return models.Profile(
        user_id=user_id,
        target_role="Software Engineer",
        experience_level="Junior",
        country="",
        bio="",
        strong_areas="[]",
        weak_areas="[]",
        interviews_completed=0,
        questions_practiced=0,
        average_score=0,
        total_minutes=0,
    )


# ─── Health ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok", "message": "OpenInterviewAI API is running. Visit /docs for interactive docs."}


# ─── Auth ─────────────────────────────────────────────────────────────────────

@app.post("/api/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=user.password,   # hash in production with bcrypt
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    profile = _make_profile(db_user.id)
    db.add(profile)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/api/login", response_model=schemas.UserOut)
def login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == req.email).first()
    if not db_user or db_user.hashed_password != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return db_user


# ─── Users / Profile ─────────────────────────────────────────────────────────

@app.get("/api/users/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.patch("/api/users/{user_id}/profile", response_model=schemas.ProfileOut)
def update_profile(user_id: int, updates: schemas.ProfileUpdate, db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    for field, value in updates.dict(exclude_none=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile


# ─── Resumes ─────────────────────────────────────────────────────────────────

@app.post("/api/users/{user_id}/resume", response_model=schemas.ResumeOut)
async def upload_resume(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Validate
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    if not file.filename.lower().endswith((".pdf", ".docx", ".doc", ".txt")):
        raise HTTPException(status_code=400, detail="Only PDF, DOCX, DOC, TXT files are accepted")

    # Save file
    user_upload_dir = UPLOAD_DIR / str(user_id)
    user_upload_dir.mkdir(parents=True, exist_ok=True)
    safe_name = f"{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}_{file.filename}"
    file_path = user_upload_dir / safe_name

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract skills (basic keyword scan — swap with NLP in production)
    skills_found = []
    if file.filename.lower().endswith(".txt"):
        text = file_path.read_text(errors="ignore").lower()
        KNOWN_SKILLS = [
            "python", "java", "sql", "react", "fastapi", "docker",
            "kubernetes", "tensorflow", "pytorch", "machine learning",
            "data science", "nlp", "aws", "gcp", "azure", "typescript",
            "javascript", "go", "rust", "c++", "spark", "kafka",
        ]
        skills_found = [s for s in KNOWN_SKILLS if s in text]

    db_resume = models.Resume(
        user_id=user_id,
        filename=file.filename,
        file_path=str(file_path),
        extracted_skills=json.dumps(skills_found),
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume


@app.get("/api/users/{user_id}/resumes", response_model=List[schemas.ResumeOut])
def list_resumes(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Resume).filter(models.Resume.user_id == user_id).order_by(models.Resume.uploaded_at.desc()).all()


@app.delete("/api/resumes/{resume_id}")
def delete_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    try:
        Path(resume.file_path).unlink(missing_ok=True)
    except Exception:
        pass
    db.delete(resume)
    db.commit()
    return {"ok": True}


# ─── Interviews ───────────────────────────────────────────────────────────────

@app.post("/api/users/{user_id}/interviews", response_model=schemas.InterviewOut)
def create_interview(user_id: int, data: schemas.InterviewCreate, db: Session = Depends(get_db)):
    interview = models.Interview(user_id=user_id, **data.dict())
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview


@app.get("/api/users/{user_id}/interviews", response_model=List[schemas.InterviewOut])
def list_interviews(user_id: int, limit: int = 20, db: Session = Depends(get_db)):
    return (
        db.query(models.Interview)
        .filter(models.Interview.user_id == user_id)
        .order_by(models.Interview.started_at.desc())
        .limit(limit)
        .all()
    )


@app.patch("/api/interviews/{interview_id}/complete")
def complete_interview(interview_id: int, score: int, feedback: str, user_id: int, db: Session = Depends(get_db)):
    interview = db.query(models.Interview).filter(models.Interview.id == interview_id).first()
    if not interview or interview.user_id != user_id:
        raise HTTPException(status_code=404, detail="Interview not found")
    interview.status = "completed"
    interview.completed_at = datetime.now(timezone.utc)
    interview.overall_score = score
    interview.feedback_summary = feedback

    # Update profile stats
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if profile:
        profile.interviews_completed += 1
        all_scores = [
            i.overall_score
            for i in db.query(models.Interview)
            .filter(models.Interview.user_id == user_id, models.Interview.status == "completed")
            .all()
            if i.overall_score is not None
        ] + [score]
        profile.average_score = int(sum(all_scores) / len(all_scores))
        profile.total_minutes += interview.duration_mins

    db.commit()
    return {"ok": True, "score": score}


# ─── AI Chat ─────────────────────────────────────────────────────────────────

AI_QUESTIONS = [
    "Great! Let's begin. Can you explain the difference between overfitting and underfitting in machine learning?",
    "Good. What techniques would you use to handle class imbalance in a dataset?",
    "Interesting. Walk me through how you would design a recommendation system from scratch.",
    "Can you describe a situation where you had to make a trade-off between model accuracy and inference speed?",
    "Excellent work! Last question — how do you approach feature selection in a high-dimensional dataset?",
]

@app.post("/api/chat")
def chat(req: schemas.ChatRequest, db: Session = Depends(get_db)):
    """Deterministic AI interview response engine (no API key needed)."""
    user_msgs = [m for m in req.messages if m.role == "user"]
    question_idx = min(len(user_msgs), len(AI_QUESTIONS) - 1)
    
    if len(user_msgs) >= len(AI_QUESTIONS):
        response = "That completes our session. You've done a great job! Generating your feedback report now..."
        finished = True
    else:
        response = AI_QUESTIONS[question_idx]
        finished = False

    # Save question+answer to DB
    interview = db.query(models.Interview).filter(models.Interview.id == req.interview_id).first()
    if interview and len(req.messages) >= 2:
        last_user_msg = req.messages[-1]
        # Add question
        q = models.InterviewQuestion(
            interview_id=req.interview_id,
            question_text=req.messages[-2].content if req.messages[-2].role == "ai" else "",
            topic="Technical",
            order=question_idx,
        )
        db.add(q)
        db.commit()
        db.refresh(q)
        # Add answer
        a = models.InterviewAnswer(question_id=q.id, answer_text=last_user_msg.content, score=None)
        db.add(a)
        db.commit()

    return {"response": response, "finished": finished}
