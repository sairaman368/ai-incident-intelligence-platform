from database.database import get_connection


def save_incident(title, commands, runbook):
    """
    Save a generated runbook into SQLite.
    """

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO incidents
        (
            incident_title,
            commands,
            runbook
        )
        VALUES (?, ?, ?)
        """,
        (
            title,
            commands,
            runbook,
        ),
    )

    conn.commit()
    conn.close()


def get_all_incidents():
    """
    Return all incidents sorted by newest first.
    """

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM incidents
        ORDER BY created_at DESC
        """
    )

    rows = cursor.fetchall()

    conn.close()

    return rows


def get_incident_by_id(incident_id):
    """
    Return a single incident.
    """

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM incidents
        WHERE id = ?
        """,
        (incident_id,),
    )

    row = cursor.fetchone()

    conn.close()

    return row


def save_generated_runbook(title, commands, runbook):
    """
    Save AI generated runbook.
    """

    save_incident(
        title=title,
        commands=commands,
        runbook=runbook,
    )


def get_all_generated_runbooks():
    """
    Returns all generated runbooks.
    """

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
        ORDER BY created_at DESC
        """
    )

    rows = cursor.fetchall()

    conn.close()

    return rows


def get_generated_runbook(runbook_id):
    """
    Returns one runbook.
    """

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
        WHERE id = ?
        """,
        (runbook_id,),
    )

    row = cursor.fetchone()

    conn.close()

    return row


def delete_generated_runbook(runbook_id):
    """
    Deletes a generated runbook.
    Returns True if deleted, False otherwise.
    """

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        DELETE FROM incidents
        WHERE id = ?
        """,
        (runbook_id,),
    )

    deleted = cursor.rowcount

    conn.commit()
    conn.close()

    return deleted > 0


def get_dashboard_statistics():
    """
    Returns dashboard statistics.
    """

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT COUNT(*)
        FROM incidents
        """
    )

    total_runbooks = cursor.fetchone()[0]

    cursor.execute(
        """
        SELECT COUNT(*)
        FROM incidents
        WHERE DATE(created_at)=DATE('now')
        """
    )

    todays_runbooks = cursor.fetchone()[0]

    conn.close()

    return {
        "total_runbooks": total_runbooks,
        "ai_generated": total_runbooks,
        "todays_runbooks": todays_runbooks,
        "database_status": "Healthy",
    }


def search_generated_runbooks(query):
    """
    Search runbooks by incident title.
    """

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
        WHERE incident_title LIKE ?
        ORDER BY created_at DESC
        """,
        (f"%{query}%",),
    )

    rows = cursor.fetchall()

    conn.close()

    return rows


# ======================================================
# ANALYTICS
# ======================================================

def get_runbooks_per_day():
    """
    Returns runbook count grouped by date.
    """

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            DATE(created_at) AS date,
            COUNT(*) AS count
        FROM incidents
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
        """
    )

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]


def get_top_incidents(limit=5):
    """
    Returns most common incident titles.
    """

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            incident_title,
            COUNT(*) AS count
        FROM incidents
        GROUP BY incident_title
        ORDER BY count DESC
        LIMIT ?
        """,
        (limit,),
    )

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]


def get_top_commands(limit=5):
    """
    Returns most frequently used commands.
    """

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            commands,
            COUNT(*) AS count
        FROM incidents
        GROUP BY commands
        ORDER BY count DESC
        LIMIT ?
        """,
        (limit,),
    )

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]