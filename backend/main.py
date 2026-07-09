from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.runbook_api import router as runbook_router
from api.analytics_api import router as analytics_router
from api.chat_api import router as chat_router
from api.similar_api import router as similar_router
from api.rca_api import router as rca_router


app = FastAPI(
    title="AI Runbook Generator",
    description="AI powered IT Incident Runbook Generator",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(runbook_router)
app.include_router(analytics_router)
app.include_router(chat_router)
app.include_router(similar_router)
app.include_router(rca_router)


@app.get("/")
def home():
    return {
        "message": "AI Runbook Generator API is running"
    }