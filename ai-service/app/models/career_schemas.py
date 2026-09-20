from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class CareerPredictionRequest(BaseModel):
    cgpa: Optional[float] = Field(8.0, description="Student CGPA (0.0 - 10.0)")
    department: Optional[str] = Field("CSE", description="Academic Department (CSE, IT, ECE, EEE, Mechanical, Civil)")
    skills: Optional[str] = Field("Java, SQL, Spring Boot", description="Comma-separated skill list")
    careerGoal: Optional[str] = Field("Software Developer", description="Target career role or goal")
    graduationYear: Optional[int] = Field(2026, description="Target graduation year")

class CareerPredictionResponse(BaseModel):
    placementProbability: float = Field(..., description="Estimated placement probability percentage (0 - 100%)")
    predictedOutcome: str = Field(..., description="Predicted placement outcome: PLACED or NOT_PLACED")
    confidence: float = Field(..., description="Model confidence score")
    model: str = Field("RandomForestClassifier", description="ML model architecture name")
    limitedTrainingData: bool = Field(False, description="Flag indicating model training dataset state")
    modelMetrics: Optional[Dict[str, Any]] = Field(default=None, description="Trained model evaluation metrics (accuracy, precision, recall, f1)")
    featureImportance: Optional[List[Dict[str, Any]]] = Field(default=None, description="Calculated feature importance scores from RandomForestClassifier")
