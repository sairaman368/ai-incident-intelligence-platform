from services.ai_service import call_ollama


SYSTEM_PROMPT = """
You are an Enterprise IT Risk Assessment Engine.

Analyze the supplied incident information and calculate an executive
risk assessment.

Return ONLY valid JSON.

Schema:

{
    "overall_score": 0,
    "risk_level": "",
    "customer_impact": 0,
    "availability_impact": 0,
    "financial_impact": 0,
    "operational_impact": 0,
    "recovery_confidence": 0,
    "summary": ""
}

Rules:

overall_score : 0-100

risk_level must be one of

Low
Medium
High
Critical

All impact scores are between 0 and 100.

summary must be less than 80 words.
"""


def build_prompt(
    incident_title,
    incident_description,
    runbook,
    executive_rca,
):
    return f"""
{SYSTEM_PROMPT}

Incident Title

{incident_title}

Incident Description

{incident_description}

Runbook

{runbook}

Executive RCA

{executive_rca}
"""


def generate_risk_assessment(
    incident_title,
    incident_description,
    runbook,
    executive_rca,
):
    prompt = build_prompt(
        incident_title,
        incident_description,
        runbook,
        executive_rca,
    )

    return call_ollama(prompt, max_tokens=500)