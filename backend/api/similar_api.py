from fastapi import APIRouter
from database.database import get_connection
from difflib import SequenceMatcher

router = APIRouter(
    prefix="/similar",
    tags=["Similar Incidents"]
)


def similarity(a: str, b: str):
    return round(
        SequenceMatcher(
            None,
            a.lower(),
            b.lower()
        ).ratio() * 100
    )


@router.get("/{incident_title}")
def get_similar_incidents(incident_title: str):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            incident_title,
            created_at
        FROM incidents
        """
    )

    rows = cursor.fetchall()

    results = []

    for row in rows:

        score = similarity(
            incident_title,
            row["incident_title"]
        )

        results.append(
            {
                "id": row["id"],
                "incident": row["incident_title"],
                "score": score,
                "created_at": row["created_at"]
            }
        )

    conn.close()

    results = sorted(
        results,
        key=lambda x: x["score"],
        reverse=True
    )

    return {
        "success": True,
        "data": results[:5]
    }