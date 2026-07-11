from services.ai_service import call_ollama


SYSTEM_CONTEXT = """
You are an Enterprise AI Incident Copilot.

Your role is to help IT operations teams, incident commanders, service delivery managers,
SRE teams, and technical leadership understand and resolve incidents.

Rules:
- Use concise, professional enterprise IT language.
- Base answers only on the incident context provided.
- Do not invent logs, commands, systems, causes, or business impact.
- Clearly state uncertainty when evidence is incomplete.
- Prefer practical next actions.
- Mention risk before suggesting disruptive actions.
- Include rollback guidance when recommending changes.
- Do not expose internal model reasoning.
"""


def build_copilot_prompt(
    incident_title: str,
    incident_description: str,
    runbook: str,
    question: str,
) -> str:
    return f"""
{SYSTEM_CONTEXT}

Incident Title:
{incident_title or "Not provided"}

Incident Description / Evidence:
{incident_description or "No additional incident evidence provided."}

Generated Runbook:
{runbook or "No runbook is currently available."}

User Question:
{question}

Respond using this structure:

## Answer
Give a direct answer to the user's question.

## Evidence
Explain which supplied incident details support the answer.

## Recommended Next Actions
Provide practical, ordered next steps.

## Risk and Rollback
State operational risks and rollback guidance where relevant.

## Confidence
Provide a confidence rating from 0 to 100 with a brief explanation.

Keep the response concise, actionable, and suitable for an enterprise incident command environment.
"""


def ask_copilot(
    incident_title: str,
    incident_description: str,
    runbook: str,
    question: str,
) -> str:
    if not question or not question.strip():
        raise ValueError("A copilot question is required.")

    prompt = build_copilot_prompt(
        incident_title=incident_title.strip(),
        incident_description=incident_description.strip(),
        runbook=runbook.strip(),
        question=question.strip(),
    )

    return call_ollama(prompt, max_tokens=700)