# AlumniConnect Mentorship AI Microservice

ML-based mentorship recommendation microservice built with **FastAPI** and **scikit-learn** using **TF-IDF Vectorization** and **Weighted Cosine Similarity**.

## Features
- TF-IDF Vectorization & Cosine Similarity matching
- Sub-scoring breakdown:
  - Skill Similarity (50%)
  - Career Goal / Designation Relevance (25%)
  - Department Alignment (15%)
  - Course / Industry Match (5%)
  - Experience Scaling (5%)
- Returns Top 5 ranked recommendations with human-readable reasons.

## Running Locally
```bash
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```
