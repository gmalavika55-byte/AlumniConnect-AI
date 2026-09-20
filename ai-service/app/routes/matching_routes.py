from fastapi import APIRouter, HTTPException, status
from app.models.schemas import MatchRequest, MatchResponse
from app.services.matching_service import rank_mentors

router = APIRouter(prefix="/ai", tags=["Mentorship AI Matching"])

@router.post("/match", response_model=MatchResponse)
def match_mentors(payload: MatchRequest):
    """
    Receives Student profile and a list of available Alumni profiles,
    runs TF-IDF and weighted composite scoring, and returns Top 5 recommendations.
    """
    try:
        return rank_mentors(payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error computing AI recommendations: {str(e)}"
        )
