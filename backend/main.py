from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.database import create_tables

from api.runbook_api import router as runbook_router
from api.analytics_api import router as analytics_router
from api.timeline_api import router as timeline_router
from api.dashboard_api import router as dashboard_router
from api.copilot_api import router as copilot_router
from api.rca_api import router as rca_router
from api.similar_api import router as similar_router

app = FastAPI(
    title="AI Incident Intelligence Platform",
    description="Enterprise AIOps platform for RCA, Runbooks, Analytics, Dashboard and Executive Incident Intelligence.",
    version="2.1.0",
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
app.include_router(dashboard_router)
app.include_router(copilot_router)
app.include_router(rca_router)
app.include_router(similar_router)


@app.get("/")
def root():
    return {
        "success": True,
        "application": "AI Incident Intelligence Platform",
        "version": "2.1.0",
        "status": "Running",
        "modules": [
            "Runbook Generator",
            "Enterprise Analytics",
            "Executive Timeline",
            "Platform Dashboard",
        ],
    }