from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.matching_routes import router as matching_router
from app.routes.career_routes import router as career_router

app = FastAPI(
    title="AlumniConnect Mentorship AI & Career Analytics Service",
    description="ML-based mentorship recommendation engine and AI Career Analytics / Placement prediction module.",
    version="1.0.0"
)

app.include_router(matching_router)
app.include_router(career_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "AlumniConnect AI Service",
        "version": "1.0.0",
        "docs": "/docs"
    }
