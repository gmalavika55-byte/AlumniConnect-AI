from typing import List
from app.models.schemas import MatchRequest, MatchResponse, RecommendationItem
from app.services.scoring_service import calculate_match_score

def rank_mentors(match_req: MatchRequest) -> MatchResponse:
    """
    Evaluates student against all provided available alumni, ranks them by match score,
    and returns top 5 recommendations with reasons.
    """
    student = match_req.student
    alumni_list = match_req.alumni

    if not alumni_list:
        return MatchResponse(recommendations=[])

    scored_items = []
    for a in alumni_list:
        score, reasons = calculate_match_score(student, a)
        item = RecommendationItem(
            alumniId=a.id,
            name=a.name or "Alumni Mentor",
            matchScore=score,
            designation=a.designation or "Professional",
            company=a.currentCompany or "N/A",
            department=a.department or "General",
            experience=a.experience or 0.0,
            reasons=reasons
        )
        scored_items.append(item)

    # Sort descending by matchScore
    scored_items.sort(key=lambda x: x.matchScore, reverse=True)

    # Return top 5 recommendations
    return MatchResponse(recommendations=scored_items[:5])
