from database.crud import get_all_generated_runbooks


def similarity_score(a: str, b: str):
    """
    Very lightweight similarity score based on common words.
    """

    words_a = set(a.lower().split())
    words_b = set(b.lower().split())

    if not words_a or not words_b:
        return 0

    common = words_a.intersection(words_b)

    return len(common)


def find_similar_runbooks(query: str, limit: int = 5):
    """
    Returns the most similar incidents.
    """

    incidents = get_all_generated_runbooks()

    scored = []

    for incident in incidents:

        score = similarity_score(
            query,
            incident["incident_title"]
        )

        if score > 0:

            scored.append(
                (
                    score,
                    dict(incident)
                )
            )

    scored.sort(
        key=lambda x: x[0],
        reverse=True
    )

    return [
        row
        for score, row in scored[:limit]
    ]