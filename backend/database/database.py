import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterator, Optional

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "runbook.db"

DEFAULT_AI_MODEL = "qwen2.5:3b"


def utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(
        DB_PATH,
        timeout=30,
        check_same_thread=False,
    )

    conn.row_factory = sqlite3.Row

    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA synchronous = NORMAL")
    conn.execute("PRAGMA busy_timeout = 30000")

    return conn


@contextmanager
def database_transaction() -> Iterator[sqlite3.Connection]:
    conn = get_connection()

    try:
        conn.execute("BEGIN")
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def table_exists(
    cursor: sqlite3.Cursor,
    table_name: str,
) -> bool:
    cursor.execute(
        """
        SELECT 1
        FROM sqlite_master
        WHERE type = 'table'
          AND name = ?
        LIMIT 1
        """,
        (table_name,),
    )

    return cursor.fetchone() is not None


def get_table_columns(
    cursor: sqlite3.Cursor,
    table_name: str,
) -> set[str]:
    cursor.execute(f"PRAGMA table_info({table_name})")

    return {
        str(row["name"])
        for row in cursor.fetchall()
    }


def add_column_if_missing(
    cursor: sqlite3.Cursor,
    table_name: str,
    column_name: str,
    column_definition: str,
) -> None:
    columns = get_table_columns(cursor, table_name)

    if column_name not in columns:
        cursor.execute(
            f"""
            ALTER TABLE {table_name}
            ADD COLUMN {column_name} {column_definition}
            """
        )


def create_incidents_table(
    cursor: sqlite3.Cursor,
) -> None:
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS incidents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_title TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'open',
            severity TEXT NOT NULL DEFAULT 'medium',
            priority TEXT NOT NULL DEFAULT 'P3',
            commands TEXT,
            runbook TEXT,
            root_cause TEXT,
            executive_summary TEXT,
            confidence_score INTEGER,
            risk_score INTEGER,
            risk_level TEXT,
            mttr TEXT,
            ai_model TEXT NOT NULL DEFAULT 'qwen2.5:3b',
            incident_source TEXT NOT NULL DEFAULT 'manual',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            resolved_at TIMESTAMP
        )
        """
    )


def migrate_incidents_table(
    cursor: sqlite3.Cursor,
) -> None:
    add_column_if_missing(
        cursor,
        "incidents",
        "status",
        "TEXT NOT NULL DEFAULT 'open'",
    )

    add_column_if_missing(
        cursor,
        "incidents",
        "severity",
        "TEXT NOT NULL DEFAULT 'medium'",
    )

    add_column_if_missing(
        cursor,
        "incidents",
        "priority",
        "TEXT NOT NULL DEFAULT 'P3'",
    )

    add_column_if_missing(
        cursor,
        "incidents",
        "root_cause",
        "TEXT",
    )

    add_column_if_missing(
        cursor,
        "incidents",
        "executive_summary",
        "TEXT",
    )

    add_column_if_missing(
        cursor,
        "incidents",
        "confidence_score",
        "INTEGER",
    )

    add_column_if_missing(
        cursor,
        "incidents",
        "risk_score",
        "INTEGER",
    )

    add_column_if_missing(
        cursor,
        "incidents",
        "risk_level",
        "TEXT",
    )

    add_column_if_missing(
        cursor,
        "incidents",
        "mttr",
        "TEXT",
    )

    add_column_if_missing(
        cursor,
        "incidents",
        "ai_model",
        f"TEXT NOT NULL DEFAULT '{DEFAULT_AI_MODEL}'",
    )

    add_column_if_missing(
        cursor,
        "incidents",
        "incident_source",
        "TEXT NOT NULL DEFAULT 'manual'",
    )

    add_column_if_missing(
        cursor,
        "incidents",
        "updated_at",
        "TIMESTAMP",
    )

    add_column_if_missing(
        cursor,
        "incidents",
        "resolved_at",
        "TIMESTAMP",
    )

    cursor.execute(
        """
        UPDATE incidents
        SET updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)
        """
    )

    cursor.execute(
        """
        UPDATE incidents
        SET status = COALESCE(NULLIF(status, ''), 'open')
        """
    )

    cursor.execute(
        """
        UPDATE incidents
        SET severity = COALESCE(NULLIF(severity, ''), 'medium')
        """
    )

    cursor.execute(
        """
        UPDATE incidents
        SET priority = COALESCE(NULLIF(priority, ''), 'P3')
        """
    )

    cursor.execute(
        """
        UPDATE incidents
        SET ai_model = COALESCE(NULLIF(ai_model, ''), ?)
        """,
        (DEFAULT_AI_MODEL,),
    )

    cursor.execute(
        """
        UPDATE incidents
        SET incident_source =
            COALESCE(NULLIF(incident_source, ''), 'manual')
        """
    )


def create_incident_timeline_table(
    cursor: sqlite3.Cursor,
) -> None:
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS incident_timeline (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_id INTEGER NOT NULL,
            stage TEXT NOT NULL,
            status TEXT NOT NULL,
            summary TEXT NOT NULL,
            details TEXT,
            event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP,
            duration_seconds REAL,
            actor TEXT NOT NULL DEFAULT 'system',
            source TEXT NOT NULL DEFAULT 'platform',
            confidence_score INTEGER,
            ai_generated INTEGER NOT NULL DEFAULT 0,
            notes TEXT,
            metadata_json TEXT,
            sort_order INTEGER NOT NULL,
            FOREIGN KEY (incident_id)
                REFERENCES incidents(id)
                ON DELETE CASCADE
        )
        """
    )


def migrate_incident_timeline_table(
    cursor: sqlite3.Cursor,
) -> None:
    add_column_if_missing(
        cursor,
        "incident_timeline",
        "completed_at",
        "TIMESTAMP",
    )

    add_column_if_missing(
        cursor,
        "incident_timeline",
        "duration_seconds",
        "REAL",
    )

    add_column_if_missing(
        cursor,
        "incident_timeline",
        "actor",
        "TEXT NOT NULL DEFAULT 'system'",
    )

    add_column_if_missing(
        cursor,
        "incident_timeline",
        "source",
        "TEXT NOT NULL DEFAULT 'platform'",
    )

    add_column_if_missing(
        cursor,
        "incident_timeline",
        "confidence_score",
        "INTEGER",
    )

    add_column_if_missing(
        cursor,
        "incident_timeline",
        "ai_generated",
        "INTEGER NOT NULL DEFAULT 0",
    )

    add_column_if_missing(
        cursor,
        "incident_timeline",
        "notes",
        "TEXT",
    )

    add_column_if_missing(
        cursor,
        "incident_timeline",
        "metadata_json",
        "TEXT",
    )


def create_incident_activity_table(
    cursor: sqlite3.Cursor,
) -> None:
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS incident_activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_id INTEGER NOT NULL,
            activity_type TEXT NOT NULL,
            activity_name TEXT NOT NULL,
            description TEXT,
            actor TEXT NOT NULL DEFAULT 'system',
            source TEXT NOT NULL DEFAULT 'platform',
            status TEXT NOT NULL DEFAULT 'completed',
            metadata_json TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (incident_id)
                REFERENCES incidents(id)
                ON DELETE CASCADE
        )
        """
    )


def create_ai_generation_history_table(
    cursor: sqlite3.Cursor,
) -> None:
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS ai_generation_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_id INTEGER,
            operation_type TEXT NOT NULL,
            model_name TEXT NOT NULL,
            prompt_text TEXT,
            response_text TEXT,
            success INTEGER NOT NULL DEFAULT 1,
            error_message TEXT,
            response_time_seconds REAL,
            prompt_tokens INTEGER,
            completion_tokens INTEGER,
            total_tokens INTEGER,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (incident_id)
                REFERENCES incidents(id)
                ON DELETE SET NULL
        )
        """
    )


def create_system_metrics_table(
    cursor: sqlite3.Cursor,
) -> None:
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS system_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            metric_name TEXT NOT NULL,
            metric_value REAL,
            metric_text TEXT,
            metric_unit TEXT,
            component TEXT NOT NULL DEFAULT 'platform',
            status TEXT NOT NULL DEFAULT 'healthy',
            metadata_json TEXT,
            recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )


def create_indexes(
    cursor: sqlite3.Cursor,
) -> None:
    cursor.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_incidents_created_at
        ON incidents(created_at DESC)
        """
    )

    cursor.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_incidents_status
        ON incidents(status)
        """
    )

    cursor.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_incidents_severity
        ON incidents(severity)
        """
    )

    cursor.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_timeline_incident_sort
        ON incident_timeline(incident_id, sort_order)
        """
    )

    cursor.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_timeline_event_time
        ON incident_timeline(event_time DESC)
        """
    )

    cursor.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_activity_incident_created
        ON incident_activity(incident_id, created_at DESC)
        """
    )

    cursor.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_ai_history_incident_created
        ON ai_generation_history(incident_id, created_at DESC)
        """
    )

    cursor.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_ai_history_operation
        ON ai_generation_history(operation_type)
        """
    )

    cursor.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_metrics_name_recorded
        ON system_metrics(metric_name, recorded_at DESC)
        """
    )


def create_updated_at_trigger(
    cursor: sqlite3.Cursor,
) -> None:
    cursor.execute(
        """
        CREATE TRIGGER IF NOT EXISTS trg_incidents_updated_at
        AFTER UPDATE ON incidents
        FOR EACH ROW
        WHEN NEW.updated_at = OLD.updated_at
        BEGIN
            UPDATE incidents
            SET updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.id;
        END
        """
    )


def create_tables() -> None:
    with database_transaction() as conn:
        cursor = conn.cursor()

        create_incidents_table(cursor)
        migrate_incidents_table(cursor)

        create_incident_timeline_table(cursor)
        migrate_incident_timeline_table(cursor)

        create_incident_activity_table(cursor)
        create_ai_generation_history_table(cursor)
        create_system_metrics_table(cursor)

        create_indexes(cursor)
        create_updated_at_trigger(cursor)


def serialize_metadata(
    metadata: Optional[dict[str, Any]],
) -> Optional[str]:
    if metadata is None:
        return None

    return json.dumps(
        metadata,
        ensure_ascii=False,
        default=str,
    )


def add_incident_activity(
    incident_id: int,
    activity_type: str,
    activity_name: str,
    description: str = "",
    actor: str = "system",
    source: str = "platform",
    status: str = "completed",
    metadata: Optional[dict[str, Any]] = None,
    connection: Optional[sqlite3.Connection] = None,
) -> int:
    owns_connection = connection is None
    conn = connection or get_connection()

    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO incident_activity (
                incident_id,
                activity_type,
                activity_name,
                description,
                actor,
                source,
                status,
                metadata_json
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                incident_id,
                activity_type,
                activity_name,
                description,
                actor,
                source,
                status,
                serialize_metadata(metadata),
            ),
        )

        activity_id = int(cursor.lastrowid)

        if owns_connection:
            conn.commit()

        return activity_id

    except Exception:
        if owns_connection:
            conn.rollback()

        raise

    finally:
        if owns_connection:
            conn.close()


def add_ai_generation_history(
    operation_type: str,
    model_name: str,
    prompt_text: str = "",
    response_text: str = "",
    success: bool = True,
    error_message: str = "",
    response_time_seconds: Optional[float] = None,
    incident_id: Optional[int] = None,
    prompt_tokens: Optional[int] = None,
    completion_tokens: Optional[int] = None,
    total_tokens: Optional[int] = None,
) -> int:
    with database_transaction() as conn:
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO ai_generation_history (
                incident_id,
                operation_type,
                model_name,
                prompt_text,
                response_text,
                success,
                error_message,
                response_time_seconds,
                prompt_tokens,
                completion_tokens,
                total_tokens
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                incident_id,
                operation_type,
                model_name,
                prompt_text,
                response_text,
                1 if success else 0,
                error_message,
                response_time_seconds,
                prompt_tokens,
                completion_tokens,
                total_tokens,
            ),
        )

        return int(cursor.lastrowid)


def record_system_metric(
    metric_name: str,
    metric_value: Optional[float] = None,
    metric_text: str = "",
    metric_unit: str = "",
    component: str = "platform",
    status: str = "healthy",
    metadata: Optional[dict[str, Any]] = None,
) -> int:
    with database_transaction() as conn:
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO system_metrics (
                metric_name,
                metric_value,
                metric_text,
                metric_unit,
                component,
                status,
                metadata_json
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                metric_name,
                metric_value,
                metric_text,
                metric_unit,
                component,
                status,
                serialize_metadata(metadata),
            ),
        )

        return int(cursor.lastrowid)


def save_incident(
    title: str,
    commands: str,
    runbook: str,
    status: str = "open",
    severity: str = "medium",
    priority: str = "P3",
    ai_model: str = DEFAULT_AI_MODEL,
    incident_source: str = "manual",
) -> int:
    with database_transaction() as conn:
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO incidents (
                incident_title,
                status,
                severity,
                priority,
                commands,
                runbook,
                ai_model,
                incident_source,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            """,
            (
                title,
                status,
                severity,
                priority,
                commands,
                runbook,
                ai_model,
                incident_source,
            ),
        )

        incident_id = int(cursor.lastrowid)

        timeline_events = [
            {
                "stage": "Incident Detected",
                "status": "completed",
                "summary": "Incident was submitted to the platform",
                "details": title,
                "actor": "user",
                "source": incident_source,
                "confidence_score": 100,
                "ai_generated": 0,
                "sort_order": 1,
            },
            {
                "stage": "Evidence Collected",
                "status": "completed",
                "summary": "Commands and operational context captured",
                "details": commands,
                "actor": "user",
                "source": "manual_evidence",
                "confidence_score": 100,
                "ai_generated": 0,
                "sort_order": 2,
            },
            {
                "stage": "AI Analysis Started",
                "status": "completed",
                "summary": "AI engine began incident analysis",
                "details": f"Model: {ai_model}",
                "actor": ai_model,
                "source": "ollama",
                "confidence_score": None,
                "ai_generated": 1,
                "sort_order": 3,
            },
            {
                "stage": "Runbook Generated",
                "status": "completed",
                "summary": "Operational recovery runbook created",
                "details": runbook,
                "actor": ai_model,
                "source": "ollama",
                "confidence_score": None,
                "ai_generated": 1,
                "sort_order": 4,
            },
            {
                "stage": "Executive Review Ready",
                "status": "active",
                "summary": "Incident package is ready for review",
                "details": (
                    "Runbook and incident evidence are available. "
                    "RCA and risk assessment can now be generated."
                ),
                "actor": "platform",
                "source": "workflow",
                "confidence_score": 100,
                "ai_generated": 0,
                "sort_order": 5,
            },
        ]

        cursor.executemany(
            """
            INSERT INTO incident_timeline (
                incident_id,
                stage,
                status,
                summary,
                details,
                completed_at,
                duration_seconds,
                actor,
                source,
                confidence_score,
                ai_generated,
                metadata_json,
                sort_order
            )
            VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                CASE
                    WHEN ? = 'completed'
                    THEN CURRENT_TIMESTAMP
                    ELSE NULL
                END,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )
            """,
            [
                (
                    incident_id,
                    event["stage"],
                    event["status"],
                    event["summary"],
                    event["details"],
                    event["status"],
                    None,
                    event["actor"],
                    event["source"],
                    event["confidence_score"],
                    event["ai_generated"],
                    serialize_metadata(
                        {
                            "model": ai_model,
                            "incident_source": incident_source,
                        }
                    ),
                    event["sort_order"],
                )
                for event in timeline_events
            ],
        )

        add_incident_activity(
            incident_id=incident_id,
            activity_type="incident",
            activity_name="Incident Created",
            description=f"Incident created: {title}",
            actor="user",
            source=incident_source,
            status="completed",
            metadata={
                "severity": severity,
                "priority": priority,
                "ai_model": ai_model,
            },
            connection=conn,
        )

        add_incident_activity(
            incident_id=incident_id,
            activity_type="ai_generation",
            activity_name="Runbook Generated",
            description="AI-generated operational runbook was created.",
            actor=ai_model,
            source="ollama",
            status="completed",
            metadata={
                "operation_type": "runbook",
            },
            connection=conn,
        )

        return incident_id


def update_incident_intelligence(
    incident_id: int,
    *,
    root_cause: Optional[str] = None,
    executive_summary: Optional[str] = None,
    confidence_score: Optional[int] = None,
    severity: Optional[str] = None,
    priority: Optional[str] = None,
    risk_score: Optional[int] = None,
    risk_level: Optional[str] = None,
    mttr: Optional[str] = None,
    status: Optional[str] = None,
    resolved_at: Optional[str] = None,
) -> bool:
    updates: list[str] = []
    values: list[Any] = []

    optional_values = {
        "root_cause": root_cause,
        "executive_summary": executive_summary,
        "confidence_score": confidence_score,
        "severity": severity,
        "priority": priority,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "mttr": mttr,
        "status": status,
        "resolved_at": resolved_at,
    }

    for column_name, value in optional_values.items():
        if value is not None:
            updates.append(f"{column_name} = ?")
            values.append(value)

    if not updates:
        return False

    updates.append("updated_at = CURRENT_TIMESTAMP")
    values.append(incident_id)

    with database_transaction() as conn:
        cursor = conn.cursor()

        cursor.execute(
            f"""
            UPDATE incidents
            SET {", ".join(updates)}
            WHERE id = ?
            """,
            values,
        )

        updated = cursor.rowcount > 0

        if updated:
            add_incident_activity(
                incident_id=incident_id,
                activity_type="incident_update",
                activity_name="Incident Intelligence Updated",
                description="Structured incident intelligence was updated.",
                actor="platform",
                source="database",
                status="completed",
                metadata={
                    "updated_fields": list(optional_values.keys()),
                },
                connection=conn,
            )

        return updated


def resolve_incident(
    incident_id: int,
) -> bool:
    return update_incident_intelligence(
        incident_id,
        status="resolved",
        resolved_at=utc_now(),
    )


def get_all_incidents():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            incident_title,
            status,
            severity,
            priority,
            commands,
            runbook,
            root_cause,
            executive_summary,
            confidence_score,
            risk_score,
            risk_level,
            mttr,
            ai_model,
            incident_source,
            created_at,
            updated_at,
            resolved_at
        FROM incidents
        ORDER BY created_at DESC, id DESC
        """
    )

    rows = cursor.fetchall()
    conn.close()

    return rows


def get_incident_by_id(
    incident_id: int,
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            incident_title,
            status,
            severity,
            priority,
            commands,
            runbook,
            root_cause,
            executive_summary,
            confidence_score,
            risk_score,
            risk_level,
            mttr,
            ai_model,
            incident_source,
            created_at,
            updated_at,
            resolved_at
        FROM incidents
        WHERE id = ?
        """,
        (incident_id,),
    )

    row = cursor.fetchone()
    conn.close()

    return row


def get_incident_timeline(
    incident_id: int,
):
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
            completed_at,
            duration_seconds,
            actor,
            source,
            confidence_score,
            ai_generated,
            notes,
            metadata_json,
            sort_order
        FROM incident_timeline
        WHERE incident_id = ?
        ORDER BY sort_order ASC, event_time ASC
        """,
        (incident_id,),
    )

    rows = cursor.fetchall()
    conn.close()

    return rows


def get_incident_activity(
    incident_id: int,
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            incident_id,
            activity_type,
            activity_name,
            description,
            actor,
            source,
            status,
            metadata_json,
            created_at
        FROM incident_activity
        WHERE incident_id = ?
        ORDER BY created_at DESC, id DESC
        """,
        (incident_id,),
    )

    rows = cursor.fetchall()
    conn.close()

    return rows


if __name__ == "__main__":
    create_tables()

    print("Enterprise Incident Intelligence Database V2 created successfully.")
    print(f"Database path: {DB_PATH}")