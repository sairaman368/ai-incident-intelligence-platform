import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "runbook.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS incidents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_title TEXT NOT NULL,
            commands TEXT,
            runbook TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS incident_timeline (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_id INTEGER NOT NULL,
            stage TEXT NOT NULL,
            status TEXT NOT NULL,
            summary TEXT NOT NULL,
            details TEXT,
            event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            sort_order INTEGER NOT NULL,
            FOREIGN KEY (incident_id) REFERENCES incidents(id)
        )
        """
    )

    conn.commit()
    conn.close()


def save_incident(title, commands, runbook):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO incidents (incident_title, commands, runbook)
        VALUES (?, ?, ?)
        """,
        (title, commands, runbook),
    )

    incident_id = cursor.lastrowid

    timeline_events = [
        ("Incident Detected", "completed", "Incident was submitted to the platform", title, 1),
        ("Evidence Collected", "completed", "Commands and operational context captured", commands, 2),
        ("AI RCA Started", "completed", "AI engine began incident analysis", "Local AI model started RCA generation.", 3),
        ("Root Cause Analysis Generated", "completed", "Executive RCA generated successfully", "AI produced incident analysis and root cause summary.", 4),
        ("Runbook Generated", "completed", "Operational recovery runbook created", runbook, 5),
        ("Executive Review Ready", "active", "Incident package ready for leadership review", "Timeline, RCA, runbook and activity intelligence are available.", 6),
    ]

    cursor.executemany(
        """
        INSERT INTO incident_timeline
        (incident_id, stage, status, summary, details, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        [
            (incident_id, stage, status, summary, details, sort_order)
            for stage, status, summary, details, sort_order in timeline_events
        ],
    )

    conn.commit()
    conn.close()

    return incident_id


def get_all_incidents():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, incident_title, commands, runbook, created_at
        FROM incidents
        ORDER BY created_at DESC
        """
    )

    rows = cursor.fetchall()
    conn.close()

    return rows


def get_incident_by_id(incident_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, incident_title, commands, runbook, created_at
        FROM incidents
        WHERE id = ?
        """,
        (incident_id,),
    )

    row = cursor.fetchone()
    conn.close()

    return row


if __name__ == "__main__":
    create_tables()
    print("Database tables created successfully.")