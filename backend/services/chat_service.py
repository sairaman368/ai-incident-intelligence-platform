from services.ai_service import generate_runbook
from database.crud import get_all_generated_runbooks


def ask_runbook_assistant(question: str):
    """
    Answers questions using existing runbooks as context.
    """

    runbooks = get_all_generated_runbooks()

    context = ""

    for runbook in runbooks[:5]:
        context += f"""
Incident:
{runbook["incident_title"]}

Runbook:
{runbook["runbook"]}

------------------------
"""

    prompt = f"""
You are a Senior IT Operations Engineer.

Use the previous runbooks below as knowledge.

{context}

Question:

{question}

Answer professionally.

If the answer is not available,
say you could not find it in previous runbooks.
"""

    answer = generate_runbook(
        "Runbook Assistant",
        prompt
    )

    return answer