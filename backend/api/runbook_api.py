from fastapi import APIRouter, HTTPException

from models.runbook_models import (
    RunbookRequest,
    RunbookResponse
)

from services.ai_service import generate_runbook

from database.crud import (
    save_generated_runbook,
    get_all_generated_runbooks,
    get_generated_runbook,
    delete_generated_runbook,
    get_dashboard_statistics,
    search_generated_runbooks
)

router = APIRouter()


@router.post(
    "/generate-runbook",
    response_model=RunbookResponse
)
def generate(request: RunbookRequest):

    try:

        runbook = generate_runbook(
            request.incident_title,
            request.commands
        )

        save_generated_runbook(
            request.incident_title,
            request.commands,
            runbook
        )

        return RunbookResponse(
            success=True,
            message="Runbook generated successfully.",
            runbook=runbook
        )

    except Exception as ex:

        raise HTTPException(
            status_code=500,
            detail=str(ex)
        )


@router.get("/runbooks")
def get_runbooks():

    rows = get_all_generated_runbooks()

    return {
        "success": True,
        "data": [dict(row) for row in rows]
    }


@router.get("/runbooks/search")
def search_runbooks(q: str):

    rows = search_generated_runbooks(q)

    return {
        "success": True,
        "data": [dict(row) for row in rows]
    }


@router.get("/runbooks/{runbook_id}")
def get_runbook(runbook_id: int):

    row = get_generated_runbook(runbook_id)

    if row is None:
        raise HTTPException(
            status_code=404,
            detail="Runbook not found."
        )

    return dict(row)


@router.delete("/runbooks/{runbook_id}")
def delete_runbook(runbook_id: int):

    deleted = delete_generated_runbook(runbook_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Runbook not found."
        )

    return {
        "success": True,
        "message": "Runbook deleted successfully."
    }


@router.get("/dashboard/statistics")
def dashboard_statistics():

    return {
        "success": True,
        "data": get_dashboard_statistics()
    }