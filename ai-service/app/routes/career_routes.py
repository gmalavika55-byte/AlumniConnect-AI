from fastapi import APIRouter, HTTPException, status
from app.models.career_schemas import CareerPredictionRequest, CareerPredictionResponse, BatchCareerPredictionResponse
from app.services.career_analytics_service import career_analytics_engine, fetch_student_profiles
from typing import Dict, Any, List, Optional

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
        import traceback
        print(f"[CareerRoutes] Error in predict_placement_outcome: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing placement prediction: {str(e)}"
        )

@router.get("/ai/career/predict-trend", response_model=BatchCareerPredictionResponse)
@router.get("/career/predict-trend", response_model=BatchCareerPredictionResponse)
@router.post("/ai/career/predict-batch", response_model=BatchCareerPredictionResponse)
@router.post("/career/predict-batch", response_model=BatchCareerPredictionResponse)
def predict_placement_outcome_batch(payload: Optional[List[CareerPredictionRequest]] = None):
    """
    ML Batch Endpoint: Executes RandomForestClassifier placement outcome predictions
    for a list of student profiles (or fetches all student profiles if payload is empty/GET)
    and returns aggregated ML Predicted Placement Trend metrics.
    """
    try:
        students_to_eval: List[CareerPredictionRequest] = []

        if payload and len(payload) > 0:
            students_to_eval = payload
        else:
            raw_students = fetch_student_profiles()
            for s in raw_students:
                batch_val = str(s.get("batch") or s.get("graduationYear") or 2026)
                try:
                    grad_yr = int(batch_val.split('-')[0].strip())
                except Exception:
                    grad_yr = 2026
                
                cgpa_val = s.get("cgpa")
                cgpa_num = float(cgpa_val) if cgpa_val is not None else 7.5

                students_to_eval.append(CareerPredictionRequest(
                    cgpa=cgpa_num,
                    department=(s.get("department") or "CSE").strip().upper(),
                    skills=s.get("skills") or "General Engineering",
                    careerGoal=s.get("careerGoal") or "Software Developer",
                    graduationYear=grad_yr
                ))

        if not students_to_eval or len(students_to_eval) == 0:
            return BatchCareerPredictionResponse(
                totalStudentsAssessed=0,
                predictedPlacedCount=0,
                predictedNotPlacedCount=0,
                predictedPlacementRate=0.0,
                averagePlacementProbability=0.0,
                predictions=[]
            )

        results = []
        placed_count = 0
        not_placed_count = 0
        total_prob = 0.0

        for item in students_to_eval:
            try:
                pred = career_analytics_engine.predict_placement(
                    cgpa=item.cgpa,
                    department=item.department,
                    skills=item.skills,
                    career_goal=item.careerGoal,
                    graduation_year=item.graduationYear
                )
                results.append(pred)
                if pred["predictedOutcome"] == "PLACED":
                    placed_count += 1
                else:
                    not_placed_count += 1
                total_prob += pred.get("placementProbability", 0.0)
            except Exception as item_err:
                print(f"[CareerRoutes] Warning: Skipping student record due to prediction error: {item_err}")
                continue

        total = len(results)
        rate = round((placed_count / total * 100.0), 1) if total > 0 else 0.0
        avg_prob = round((total_prob / total), 1) if total > 0 else 0.0

        return BatchCareerPredictionResponse(
            totalStudentsAssessed=total,
            predictedPlacedCount=placed_count,
            predictedNotPlacedCount=not_placed_count,
            predictedPlacementRate=rate,
            averagePlacementProbability=avg_prob,
            predictions=results
        )
    except Exception as e:
        print(f"[CareerRoutes] Error in predict_placement_outcome_batch: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing batch placement prediction: {str(e)}"
        )


