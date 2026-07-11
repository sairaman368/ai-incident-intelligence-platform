from fastapi import APIRouter, HTTPException

from models.copilot_models import CopilotRequest, CopilotResponse
from services.copilot_service import ask_copilot

router = APIRouter(
    prefix="/copilot",
    tags=["Executive AI Copilot"],
)


@router.post("/ask", response_model=CopilotResponse)
def ask_executive_copilot(request: CopilotRequest):
    try:
        answer = ask_copilot(
            incident_title=request.incident_title,
            incident_description=request.incident_description,
            runbook=request.runbook,
            question=request.question,
        )

        return CopilotResponse(
            success=True,
            answer=answer,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Copilot request failed: {str(error)}",
        )