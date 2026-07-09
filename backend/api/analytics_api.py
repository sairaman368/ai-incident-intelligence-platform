from fastapi import APIRouter
from database.database import get_connection
from collections import Counter
from datetime import datetime

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


def split_commands(commands_text):
    if not commands_text:
        return []

    commands = []

    for line in commands_text.splitlines():
        clean_line = line.strip()
        if clean_line:
            commands.append(clean_line)

    return commands


@router.get("/statistics")
def get_statistics():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as count FROM incidents")
    total_runbooks = cursor.fetchone()["count"]

    cursor.execute("""
        SELECT COUNT(*) as count
        FROM incidents
        WHERE DATE(created_at) = DATE('now')
    """)
    todays_runbooks = cursor.fetchone()["count"]

    cursor.execute("""
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM incidents
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
    """)
    runbooks_per_day = [dict(row) for row in cursor.fetchall()]

    cursor.execute("""
        SELECT incident_title as name, COUNT(*) as count
        FROM incidents
        GROUP BY incident_title
        ORDER BY count DESC
        LIMIT 5
    """)
    top_incidents = [dict(row) for row in cursor.fetchall()]

    most_common_incident = top_incidents[0]["name"] if top_incidents else "No incidents yet"

    cursor.execute("SELECT commands FROM incidents")
    command_rows = cursor.fetchall()

    command_counter = Counter()

    for row in command_rows:
        for command in split_commands(row["commands"]):
            command_counter[command] += 1

    top_commands = [
        {
            "command": command,
            "count": count
        }
        for command, count in command_counter.most_common(10)
    ]

    cursor.execute("""
        SELECT
            incident_title as incident,
            'Completed' as status,
            created_at as date
        FROM incidents
        ORDER BY created_at DESC
        LIMIT 10
    """)
    recent_runbooks = [dict(row) for row in cursor.fetchall()]

    last_generated = recent_runbooks[0]["incident"] if recent_runbooks else "No runbooks yet"

    conn.close()

    return {
        "data": {
            "summary": {
                "total_runbooks": total_runbooks,
                "resolved_incidents": total_runbooks,
                "pending_incidents": 0,
                "success_rate": 100 if total_runbooks else 0,
                "todays_runbooks": todays_runbooks,
                "most_common_incident": most_common_incident,
                "last_generated": last_generated,
                "ai_model": "qwen2.5:3b",
                "database_status": "Connected",
                "ollama_status": "Configured",
                "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            },
            "runbooks_per_day": runbooks_per_day,
            "top_incidents": top_incidents,
            "top_commands": top_commands,
            "recent_runbooks": recent_runbooks
        }
    }