from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.database import create_tables
from api.runbook_api import router as runbook_router
from api.analytics_api import router as analytics_router
from api.timeline_api import router as timeline_router

app = FastAPI(
    title="AI Incident Intelligence Platform",
    description="Enterprise AIOps platform for RCA, runbooks, analytics, and executive incident intelligence.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_tables()

app.include_router(runbook_router)
app.include_router(analytics_router)
app.include_router(timeline_router)


@app.get("/")
def root():
    return {
        "success": True,
        "message": "AI Incident Intelligence Platform backend is running",
    }