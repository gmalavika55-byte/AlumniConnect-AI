from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any, Union

class CareerPredictionRequest(BaseModel):
    cgpa: Optional[float] = Field(8.0, description="Student CGPA (0.0 - 10.0)")
    department: Optional[str] = Field("CSE", description="Academic Department (CSE, IT, ECE, EEE, Mechanical, Civil)")
    skills: Optional[str] = Field("Java, SQL, Spring Boot", description="Comma-separated skill list")
    careerGoal: Optional[str] = Field("Software Developer", description="Target career role or goal")
    graduationYear: Optional[Union[int, str]] = Field(2026, description="Target graduation year")

    @field_validator('graduationYear', mode='before')
    @classmethod
    def parse_grad_year(cls, v):
        if v is None:
            return 2026
        if isinstance(v, int):
            return v
        if isinstance(v, str):
            clean_str = v.split('-')[0].strip()
            try:
                return int(clean_str)
            except Exception:
                return 2026
        return 2026

class CareerPredictionResponse(BaseModel):
    placementProbability: float = Field(..., description="Estimated placement probability percentage (0 - 100%)")
    predictedOutcome: str = Field(..., description="Predicted placement outcome: PLACED or NOT_PLACED")
    confidence: float = Field(..., description="Model confidence score")
    model: str = Field("RandomForestClassifier", description="ML model architecture name")
    limitedTrainingData: bool = Field(False, description="Flag indicating model training dataset state")
    modelMetrics: Optional[Dict[str, Any]] = Field(default=None, description="Trained model evaluation metrics (accuracy, precision, recall, f1)")
    featureImportance: Optional[List[Dict[str, Any]]] = Field(default=None, description="Calculated feature importance scores from RandomForestClassifier")

class BatchCareerPredictionResponse(BaseModel):
    totalStudentsAssessed: int = Field(0, description="Total number of students evaluated by ML model")
    predictedPlacedCount: int = Field(0, description="Count of students predicted as PLACED")
    predictedNotPlacedCount: int = Field(0, description="Count of students predicted as NOT_PLACED")
    predictedPlacementRate: float = Field(0.0, description="Percentage of students predicted as PLACED")
    averagePlacementProbability: float = Field(0.0, description="Average placement probability score across evaluated students")
    predictions: List[Dict[str, Any]] = Field(default_factory=list, description="Individual prediction outputs")

