import math
import re
from app.services.text_processor import normalize_text, extract_skill_set
from app.models.schemas import StudentProfile, AlumniProfile

def tokenize(text: str) -> list:
    """
    Tokenizes text into normalized words and n-grams.
    """
    norm = normalize_text(text)
    if not norm:
        return []
    words = [w for w in norm.split() if len(w) > 1]
    # Add bigrams for context matching (e.g. "spring boot", "backend developer")
    bigrams = [f"{words[i]} {words[i+1]}" for i in range(len(words)-1)]
    return words + bigrams

def compute_tfidf_vector(doc_tokens: list, vocab: list, idf_dict: dict) -> list:
    """
    Computes TF-IDF vector for document tokens against vocabulary and IDF weights.
    """
    if not doc_tokens:
        return [0.0] * len(vocab)
    doc_len = float(len(doc_tokens))
    tf_dict = {}
    for t in doc_tokens:
        tf_dict[t] = tf_dict.get(t, 0) + 1

    vec = []
    for term in vocab:
        tf = tf_dict.get(term, 0) / doc_len
        idf = idf_dict.get(term, 0.0)
        vec.append(tf * idf)
    return vec

def cosine_sim(vec1: list, vec2: list) -> float:
    """
    Computes cosine similarity between two numeric vectors.
    """
    dot = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))
    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0
    return dot / (norm1 * norm2)

def calculate_match_score(student: StudentProfile, alumni: AlumniProfile):
    """
    Pure Python ML implementation of TF-IDF Vectorization, Cosine Similarity,
    and Weighted Business-Rule Scoring.
    Returns (final_score_0_to_100, list_of_reasons).
    """
    reasons = []

    # 1. Skill Similarity (50% Weight)
    student_skills = extract_skill_set(student.skills)
    alumni_skills = extract_skill_set(alumni.skills)
    skill_overlap = student_skills.intersection(alumni_skills)

    if student_skills and alumni_skills:
        jaccard_skill = len(skill_overlap) / float(len(student_skills.union(alumni_skills)))
        
        # TF-IDF skill cosine similarity
        sk_doc1 = list(student_skills)
        sk_doc2 = list(alumni_skills)
        vocab_sk = list(set(sk_doc1 + sk_doc2))
        
        # Calculate IDF for skill terms across doc pair
        idf_sk = {}
        for term in vocab_sk:
            df = (1 if term in sk_doc1 else 0) + (1 if term in sk_doc2 else 0)
            idf_sk[term] = math.log(1.0 + (2.0 / (1.0 + df))) + 1.0

        vec_s1 = compute_tfidf_vector(sk_doc1, vocab_sk, idf_sk)
        vec_s2 = compute_tfidf_vector(sk_doc2, vocab_sk, idf_sk)
        tfidf_skill_sim = cosine_sim(vec_s1, vec_s2)

        skill_score = 0.6 * tfidf_skill_sim + 0.4 * jaccard_skill
    else:
        skill_score = 0.0

    if skill_overlap:
        top_skills = ", ".join(list(skill_overlap)[:3])
        reasons.append(f"Strong skill match in {top_skills}")
    elif skill_score > 0.3:
        reasons.append("Relevant technical skill alignment")

    # 2. Career Goal / Designation Relevance (25% Weight)
    goal_tokens = tokenize(student.careerGoal)
    alumni_tokens = tokenize(f"{alumni.designation or ''} {alumni.currentCompany or ''}")

    if goal_tokens and alumni_tokens:
        vocab_g = list(set(goal_tokens + alumni_tokens))
        idf_g = {}
        for term in vocab_g:
            df = (1 if term in goal_tokens else 0) + (1 if term in alumni_tokens else 0)
            idf_g[term] = math.log(1.0 + (2.0 / (1.0 + df))) + 1.0

        vec_g1 = compute_tfidf_vector(goal_tokens, vocab_g, idf_g)
        vec_g2 = compute_tfidf_vector(alumni_tokens, vocab_g, idf_g)
        desig_score = cosine_sim(vec_g1, vec_g2)

        # Token overlap boost for key terms
        if set(goal_tokens).intersection(set(alumni_tokens)):
            desig_score = max(desig_score, 0.8)
    else:
        desig_score = 0.0

    if desig_score > 0.4:
        reasons.append(f"Direct alignment with career goal as {alumni.designation or 'Professional'}")

    # 3. Department Match (15% Weight)
    dept_student = normalize_text(student.department)
    dept_alumni = normalize_text(alumni.department)

    if dept_student and dept_alumni and (dept_student in dept_alumni or dept_alumni in dept_student):
        dept_score = 1.0
        reasons.append(f"Same department: {alumni.department}")
    else:
        dept_score = 0.0

    # 4. Course / Industry Match (5% Weight)
    course_tokens = tokenize(student.course)
    if course_tokens and alumni_tokens:
        vocab_c = list(set(course_tokens + alumni_tokens))
        idf_c = {t: 1.0 for t in vocab_c}
        vec_c1 = compute_tfidf_vector(course_tokens, vocab_c, idf_c)
        vec_c2 = compute_tfidf_vector(alumni_tokens, vocab_c, idf_c)
        course_score = cosine_sim(vec_c1, vec_c2)
    else:
        course_score = 0.5

    # 5. Experience Relevance (5% Weight)
    exp_val = alumni.experience if alumni.experience is not None else 0.0
    exp_score = min(1.0, float(exp_val) / 10.0)

    if exp_val > 0:
        exp_str = f"{int(exp_val) if exp_val.is_integer() else exp_val} years"
        company_str = f" at {alumni.currentCompany}" if alumni.currentCompany else ""
        reasons.append(f"{exp_str} professional experience{company_str}")

    # Fallback reason if none added
    if not reasons:
        reasons.append("Verified alumni mentor available for guidance")

    # Weighted Composite Score (0.0 to 1.0)
    composite = (
        0.50 * skill_score +
        0.25 * desig_score +
        0.15 * dept_score +
        0.05 * course_score +
        0.05 * exp_score
    )

    # Scale to 0-100%, rounded to 1 decimal place
    final_score = round(min(99.9, max(15.0, composite * 100.0)), 1)
    return final_score, reasons[:3]
