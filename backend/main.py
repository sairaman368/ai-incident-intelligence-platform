from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.runbook_api import router as runbook_router
from api.analytics_api import router as analytics_router
from api.timeline_api import router as timeline_router

app = FastAPI(
    title="AI Incident Intelligence Platform",
    description="Enterprise-grade AI platform for incident RCA, runbooks, analytics, and executive intelligence.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(runbook_router)
app.include_router(analytics_router)
app.include_router(timeline_router)


@app.get("/")
def health_check():
    return {
        "success": True,
        "message": "AI Incident Intelligence Platform backend is running"
    }