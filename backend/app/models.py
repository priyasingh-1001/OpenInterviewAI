from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="user", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    target_role = Column(String, default="Software Engineer")
    experience_level = Column(String, default="Junior")
    country = Column(String, default="")
    bio = Column(Text, default="")
    # JSON strings for arrays
    strong_areas = Column(String, default="[]")
    weak_areas = Column(String, default="[]")
    interviews_completed = Column(Integer, default=0)
    questions_practiced = Column(Integer, default=0)
    average_score = Column(Integer, default=0)
    total_minutes = Column(Integer, default=0)

    user = relationship("User", back_populates="profile")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String)
    file_path = Column(String)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    extracted_skills = Column(Text, default="[]")  # JSON

    user = relationship("User", back_populates="resumes")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String)
    type = Column(String)
    difficulty = Column(String)
    duration_mins = Column(Integer)
    job_description = Column(Text, nullable=True)
    status = Column(String, default="in_progress")
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)
    overall_score = Column(Integer, nullable=True)
    feedback_summary = Column(Text, nullable=True)

    user = relationship("User", back_populates="interviews")
    questions = relationship("InterviewQuestion", back_populates="interview", cascade="all, delete-orphan")


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"))
    question_text = Column(Text)
    topic = Column(String, default="General")
    order = Column(Integer, default=0)

    interview = relationship("Interview", back_populates="questions")
    answer = relationship("InterviewAnswer", back_populates="question", uselist=False, cascade="all, delete-orphan")


class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("interview_questions.id"))
    answer_text = Column(Text)
    score = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)

    question = relationship("InterviewQuestion", back_populates="answer")
