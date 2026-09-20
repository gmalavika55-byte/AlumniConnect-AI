from pydantic import BaseModel, Field
from typing import List, Optional

class StudentProfile(BaseModel):
    id: Optional[int] = Field(None, description="Student ID")
    careerGoal: Optional[str] = Field("", description="Career goal or target role")
    course: Optional[str] = Field("", description="Degree or course of study")
    department: Optional[str] = Field("", description="Department / major")
    skills: Optional[str] = Field("", description="Comma-separated skill list")

class AlumniProfile(BaseModel):
    id: Optional[int] = Field(None, description="Alumni ID")
    name: Optional[str] = Field("Alumni", description="Full name")
    designation: Optional[str] = Field("", description="Job title / role")
    department: Optional[str] = Field("", description="Department / major")
    skills: Optional[str] = Field("", description="Comma-separated skill list")
    experience: Optional[float] = Field(0.0, description="Years of professional experience")
    currentCompany: Optional[str] = Field("", description="Employer company name")

class MatchRequest(BaseModel):
    student: StudentProfile
    alumni: List[AlumniProfile]

class RecommendationItem(BaseModel):
    alumniId: Optional[int]
    name: str
    matchScore: float
    designation: str
    company: str
    department: str
    experience: float
    reasons: List[str]

class MatchResponse(BaseModel):
    recommendations: List[RecommendationItem]
