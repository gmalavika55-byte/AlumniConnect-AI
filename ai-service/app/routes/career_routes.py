from fastapi import APIRouter, HTTPException, status
from app.models.career_schemas import CareerPredictionRequest, CareerPredictionResponse
from app.services.career_analytics_service import career_analytics_engine
from typing import Dict, Any

router = APIRouter(tags=["Career Analytics & AI Prediction"])

@router.get("/ai/career/analytics")
@router.get("/career/analytics")
def get_career_analytics() -> Dict[str, Any]:
    """
    Returns end-to-end Career Outcomes Analytics, Department Breakdown,
    Company/Role/Skill Metrics, Alumni Distribution, and Dynamic AI Career Insights.
    """
    try:
        return career_analytics_engine.compute_full_analytics()
    except Exception as e:
        print(f"[CareerRoutes] Error in get_career_analytics: {e}")
        return {
            "status": "degraded",
            "message": "Career outcome data is temporarily unavailable.",
            "overview": {
                "totalOutcomes": 0,
                "placedStudents": 0,
                "notPlacedStudents": 0,
                "placementRate": 0.0,
                "averagePackage": 0.0,
                "highestPackage": 0.0,
                "medianPackage": 0.0
            },
            "departmentAnalytics": [],
            "companyAnalytics": [],
            "jobRoleAnalytics": [],
            "skillAnalytics": [],
            "careerGoalAnalytics": [],
            "yearlyTrends": [],
            "alumniAnalytics": {},
            "aiInsights": [
                {
                    "type": "warning",
                    "message": "Career outcome analytics temporarily unavailable."
                }
            ],
            "modelMetrics": {
                "accuracy": None,
                "precision": None,
                "recall": None,
                "f1": None,
                "limitedTrainingData": True
            }
        }

@router.post("/ai/career/predict", response_model=CareerPredictionResponse)
@router.post("/career/predict", response_model=CareerPredictionResponse)
def predict_placement_outcome(payload: CareerPredictionRequest):
    """
    ML Endpoint: Predicts PLACEMENT_STATUS and Placement Probability
    for a given student profile using RandomForestClassifier.
    """
    try:
        res = career_analytics_engine.predict_placement(
            cgpa=payload.cgpa,
            department=payload.department,
            skills=payload.skills,
            career_goal=payload.careerGoal,
            graduation_year=payload.graduationYear
        )
        return CareerPredictionResponse(**res)
    except Exception as e:
        print(f"[CareerRoutes] Error in predict_placement_outcome: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing placement prediction: {str(e)}"
        )
