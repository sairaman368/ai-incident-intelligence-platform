from fastapi import APIRouter
from database.database import get_connection

router = APIRouter(prefix="/timeline", tags=["Incident Timeline"])


@router.get("/latest")
def get_latest_incident_timeline():
    """
    Builds an executive incident timeline from the latest saved incident.
    """

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, incident_title, commands, runbook, created_at
        FROM incidents
        ORDER BY id DESC
        LIMIT 1
        """
    )

    incident = cursor.fetchone()
    conn.close()

    if not incident:
        return {
            "success": True,
            "message": "No incidents found",
            "data": []
        }

    incident_id, title, commands, runbook, created_at = incident

    timeline = [
        {
            "stage": "Incident Detected",
            "status": "completed",
            "time": created_at,
            "summary": f"Incident reported: {title}",
            "details": "Platform received the incident title and operational command evidence."
        },
        {
            "stage": "Evidence Collected",
            "status": "completed",
            "time": created_at,
            "summary": "Diagnostic commands captured",
            "details": commands or "No command output was provided."
        },
        {
            "stage": "AI RCA Generated",
            "status": "completed",
            "time": created_at,
            "summary": "Executive root cause analysis generated",
            "details": "AI engine analyzed the incident evidence and generated RCA output."
        },
        {
            "stage": "Runbook Created",
            "status": "completed",
            "time": created_at,
            "summary": "Resolution runbook prepared",
            "details": "Recovery, validation, rollback, and preventive actions were generated."
        },
        {
            "stage": "Executive Review",
            "status": "active",
            "time": created_at,
            "summary": "Incident ready for leadership review",
            "details": "Timeline, RCA, runbook, and AI activity are available for review."
        }
    ]

    return {
        "success": True,
        "incident_id": incident_id,
        "incident_title": title,
        "data": timeline
    }