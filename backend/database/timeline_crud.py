from database.database import get_connection


def create_timeline_events(
    incident_id: int,
    incident_title: str,
    commands: str,
    runbook: str,
):
    """
    Create the default enterprise timeline
    for a newly generated incident.
    """

    conn = get_connection()
    cursor = conn.cursor()

    events = [
        (
            incident_id,
            "Incident Detected",
            "completed",
            "Incident submitted to the AI Incident Intelligence Platform.",
            incident_title,
            1,
        ),
        (
            incident_id,
            "Evidence Collected",
            "completed",
            "Diagnostic evidence captured.",
            commands,
            2,
        ),
        (
            incident_id,
            "AI RCA Started",
            "completed",
            "Local AI model started incident analysis.",
            "Model: Qwen2.5:3B",
            3,
        ),
        (
            incident_id,
            "Root Cause Analysis Generated",
            "completed",
            "Executive RCA completed successfully.",
            "AI engine generated root cause analysis.",
            4,
        ),
        (
            incident_id,
            "Runbook Generated",
            "completed",
            "Operational runbook generated.",
            runbook,
            5,
        ),
        (
            incident_id,
            "Executive Review Ready",
            "active",
            "Incident package ready for leadership review.",
            "Executive dashboard updated.",
            6,
        ),
    ]

    cursor.executemany(
        """
        INSERT INTO incident_timeline
        (
            incident_id,
            stage,
            status,
            summary,
            details,
            sort_order
        )
        VALUES
        (
            ?,?,?,?,?,?
        )
        """,
        events,
    )

    conn.commit()
    conn.close()


def get_timeline(incident_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            incident_id,
            stage,
            status,
            summary,
            details,
            event_time,
            sort_order
        FROM incident_timeline
        WHERE incident_id=?
        ORDER BY sort_order
        """,
        (incident_id,),
    )

    rows = cursor.fetchall()

    conn.close()

    return rows


def timeline_exists(incident_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT COUNT(*)
        FROM incident_timeline
        WHERE incident_id=?
        """,
        (incident_id,),
    )

    exists = cursor.fetchone()[0] > 0

    conn.close()

    return exists


def update_timeline_status(
    incident_id: int,
    stage: str,
    status: str,
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE incident_timeline
        SET status=?
        WHERE incident_id=?
        AND stage=?
        """,
        (
            status,
            incident_id,
            stage,
        ),
    )

    conn.commit()
    conn.close()


def delete_timeline(
    incident_id: int,
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        DELETE
        FROM incident_timeline
        WHERE incident_id=?
        """,
        (incident_id,),
    )

    conn.commit()
    conn.close()