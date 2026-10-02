from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


# ─── Profiles ────────────────────────────────────────────────────────────────

class ProfileOut(BaseModel):
    id: int
    user_id: int
    target_role: str
    experience_level: str
    country: str
    bio: str
    strong_areas: str   # JSON string
    weak_areas: str     # JSON string
    interviews_completed: int
    questions_practiced: int
    average_score: int
    total_minutes: int

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    target_role: Optional[str] = None
    experience_level: Optional[str] = None
    country: Optional[str] = None
    bio: Optional[str] = None
    strong_areas: Optional[str] = None
    weak_areas: Optional[str] = None


# ─── Users ───────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: str
    name: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    profile: Optional[ProfileOut] = None

    class Config:
        from_attributes = True


# ─── Resumes ─────────────────────────────────────────────────────────────────

class ResumeOut(BaseModel):
    id: int
    user_id: int
    filename: str
    uploaded_at: datetime
    extracted_skills: str   # JSON string

    class Config:
        from_attributes = True


# ─── Interviews ──────────────────────────────────────────────────────────────

class InterviewCreate(BaseModel):
    role: str
    type: str
    difficulty: str
    duration_mins: int
    job_description: Optional[str] = None


class InterviewOut(BaseModel):
    id: int
    user_id: int
    role: str
    type: str
    difficulty: str
    duration_mins: int
    job_description: Optional[str] = None
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    overall_score: Optional[int] = None
    feedback_summary: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Chat / AI ───────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str   # "user" | "ai"
    content: str


class ChatRequest(BaseModel):
    interview_id: int
    user_id: int
    messages: List[ChatMessage]
