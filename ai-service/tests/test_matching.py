from app.models.schemas import StudentProfile, AlumniProfile, MatchRequest
from app.services.matching_service import rank_mentors

def test_strong_matching_mentor():
    student = StudentProfile(
        id=1,
        careerGoal="Java Backend Developer",
        course="B.E. Computer Science",
        department="CSE",
        skills="Java, Spring Boot, SQL, REST API"
    )

    alumni_1 = AlumniProfile(
        id=41,
        name="Senior Java Dev",
        designation="Senior Java Backend Developer",
        department="CSE",
        skills="Java, Spring Boot, SQL, Microservices",
        experience=5.0,
        currentCompany="Google"
    )

    alumni_2 = AlumniProfile(
        id=42,
        name="Design Mentor",
        designation="UX Designer",
        department="Civil Engineering",
        skills="Figma, UI Design, Photoshop",
        experience=2.0,
        currentCompany="Design Studio"
    )

    req = MatchRequest(student=student, alumni=[alumni_1, alumni_2])
    res = rank_mentors(req)

    assert len(res.recommendations) == 2
    top = res.recommendations[0]
    assert top.alumniId == 41
    assert top.matchScore > 65.0
    assert top.matchScore > res.recommendations[1].matchScore
    assert any("skill match" in r.lower() for r in top.reasons)

def test_same_and_different_department():
    student = StudentProfile(
        id=2,
        careerGoal="Full Stack Engineer",
        course="Information Technology",
        department="IT",
        skills="React, Node.js"
    )

    alumni_same_dept = AlumniProfile(
        id=10,
        name="Same Dept Alumni",
        designation="Software Developer",
        department="IT",
        skills="React, JavaScript",
        experience=3.0,
        currentCompany="Tech Corp"
    )

    alumni_diff_dept = AlumniProfile(
        id=11,
        name="Diff Dept Alumni",
        designation="Software Developer",
        department="Mechanical",
        skills="React, JavaScript",
        experience=3.0,
        currentCompany="Tech Corp"
    )

    req = MatchRequest(student=student, alumni=[alumni_same_dept, alumni_diff_dept])
    res = rank_mentors(req)

    assert res.recommendations[0].alumniId == 10
    assert res.recommendations[0].matchScore > res.recommendations[1].matchScore

def test_empty_alumni_list():
    student = StudentProfile(id=3, careerGoal="AI Engineer", skills="Python")
    req = MatchRequest(student=student, alumni=[])
    res = rank_mentors(req)

    assert len(res.recommendations) == 0

def test_top_5_ranking_limit():
    student = StudentProfile(id=4, careerGoal="Developer", skills="Java")
    alumni_list = [
        AlumniProfile(id=i, name=f"Mentor {i}", designation="Developer", skills="Java", experience=float(i))
        for i in range(1, 10)
    ]

    req = MatchRequest(student=student, alumni=alumni_list)
    res = rank_mentors(req)

    assert len(res.recommendations) == 5
