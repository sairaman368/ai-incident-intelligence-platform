from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List


router = APIRouter(
    prefix="/timeline",
    tags=["Incident Timeline"]
)


class TimelineRequest(BaseModel):
    incident_title: str
    commands: str
    runbook: str
    severity: str | None = None
    root_cause: str | None = None
    mttr: str | None = None


class TimelineEvent(BaseModel):
    time: str
    stage: str
    event: str
    status: str


class TimelineResponse(BaseModel):
    success: bool
    incident_title: str
    timeline: List[TimelineEvent]


@router.post("/generate", response_model=TimelineResponse)
def generate_timeline(request: TimelineRequest):
    try:
        severity = request.severity or "Unknown"
        root_cause = request.root_cause or "Root cause analysis pending"
        mttr = request.mttr or "30 minutes"

        timeline = [
            {
                "time": "T+00 min",
                "stage": "Detection",
                "event": f"Incident detected: {request.incident_title}",
                "status": "Detected"
            },
            {
                "time": "T+03 min",
                "stage": "Classification",
                "event": f"Incident severity classified as {severity}",
                "status": "Assessed"
            },
            {
                "time": "T+07 min",
                "stage": "Diagnostics",
                "event": "Diagnostic commands executed and system health reviewed",
                "status": "Investigated"
            },
            {
                "time": "T+12 min",
                "stage": "Root Cause",
                "event": root_cause,
                "status": "Analyzed"
            },
            {
                "time": "T+18 min",
                "stage": "Remediation",
                "event": "Immediate corrective actions identified from generated runbook",
                "status": "Actioned"
            },
            {
                "time": "T+25 min",
                "stage": "Validation",
                "event": "Service health, logs, and recovery signals validated",
                "status": "Validated"
            },
            {
                "time": f"MTTR {mttr}",
                "stage": "Closure",
                "event": "Incident timeline completed and ready for executive review",
                "status": "Completed"
            }
        ]

        return {
            "success": True,
            "incident_title": request.incident_title,
            "timeline": timeline
        }

    except Exception as ex:
        raise HTTPException(
            status_code=500,
            detail=str(ex)
        )