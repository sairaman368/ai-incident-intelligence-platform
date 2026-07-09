from datetime import datetime

from database.database import get_connection
from database.timeline_crud import (
    create_timeline_events,
    get_timeline,
    timeline_exists,
)


ICON_MAP = {
    "Incident Detected": "report_problem",
    "Evidence Collected": "terminal",
    "AI RCA Started": "smart_toy",
    "Root Cause Analysis Generated": "psychology",
    "Runbook Generated": "menu_book",
    "Executive Review Ready": "supervisor_account",
}


SEVERITY_MAP = {
    "Incident Detected": "critical",
    "Evidence Collected": "high",
    "AI RCA Started": "medium",
    "Root Cause Analysis Generated": "medium",
    "Runbook Generated": "low",
    "Executive Review Ready": "low",
}


CONFIDENCE_MAP = {
    "Incident Detected": 100,
    "Evidence Collected": 98,
    "AI RCA Started": 95,
    "Root Cause Analysis Generated": 96,
    "Runbook Generated": 100,
    "Executive Review Ready": 100,
}


class TimelineService:

    @staticmethod
    def _format_timestamp(value):

        if value is None:
            return "--:--"

        try:
            dt = datetime.fromisoformat(str(value))
            return dt.strftime("%H:%M")
        except Exception:
            return str(value)

    @staticmethod
    def _calculate_duration(index):

        if index == 0:
            return "0 sec"

        return f"{index * 18} sec"

    @staticmethod
    def _build_event(row, index):

        stage = row["stage"]

        return {
            "stage": stage,
            "status": row["status"],
            "summary": row["summary"],
            "details": row["details"],
            "timestamp": TimelineService._format_timestamp(
                row["event_time"]
            ),
            "duration": TimelineService._calculate_duration(index),
            "icon": ICON_MAP.get(stage, "info"),
            "severity": SEVERITY_MAP.get(stage, "medium"),
            "confidence": CONFIDENCE_MAP.get(stage, 90),
            "metadata": {
                "engine": "Local AI",
                "model": "Qwen2.5:3B",
                "source": "SQLite",
            },
        }

    @staticmethod
    def latest():

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                incident_title,
                commands,
                runbook,
                created_at
            FROM incidents
            ORDER BY id DESC
            LIMIT 1
            """
        )

        incident = cursor.fetchone()

        conn.close()

        if incident is None:
            return {
                "success": True,
                "incident": None,
                "timeline": [],
            }

        incident_id = incident["id"]

        if not timeline_exists(incident_id):

            create_timeline_events(
                incident_id,
                incident["incident_title"],
                incident["commands"],
                incident["runbook"],
            )

        rows = get_timeline(incident_id)

        timeline = [
            TimelineService._build_event(row, index)
            for index, row in enumerate(rows)
        ]

        return {
            "success": True,
            "incident": {
                "id": incident["id"],
                "title": incident["incident_title"],
                "created_at": incident["created_at"],
            },
            "timeline": timeline,
        }