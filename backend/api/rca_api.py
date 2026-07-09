from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.ai_service import generate_root_cause_analysis


router = APIRouter(
    prefix="/rca",
    tags=["Root Cause Analysis"]
)


class RCARequest(BaseModel):
    incident_title: str
    commands: str
    runbook: str


def clean_text(value: str) -> str:
    if not value:
        return "N/A"

    return (
        value.replace("**", "")
        .replace("###", "")
        .replace("##", "")
        .replace("#", "")
        .strip()
    )


def extract_section(text: str, heading: str) -> str:
    if not text:
        return "N/A"

    lines = text.splitlines()
    capture = False
    collected = []
    heading_lower = heading.lower()

    for line in lines:
        cleaned_line = line.strip()

        normalized = (
            cleaned_line.replace("#", "")
            .replace("*", "")
            .strip()
        )

        normalized_no_colon = normalized.replace(":", "").strip().lower()

        if normalized_no_colon == heading_lower:
            capture = True
            continue

        if normalized.lower().startswith(f"{heading_lower}:"):
            inline_value = normalized.split(":", 1)[1].strip()
            return clean_text(inline_value) if inline_value else "N/A"

        if capture and cleaned_line.startswith("#"):
            break

        if capture:
            collected.append(cleaned_line)

    result = "\n".join(collected).strip()
    return clean_text(result) if result else "N/A"


def extract_severity(text: str) -> str:
    value = extract_section(text, "Severity")

    if value == "N/A":
        return "N/A"

    value_lower = value.lower()

    if "critical" in value_lower:
        return "Critical"
    if "high" in value_lower:
        return "High"
    if "medium" in value_lower:
        return "Medium"
    if "low" in value_lower:
        return "Low"

    return value.splitlines()[0].strip()


def extract_confidence_score(text: str) -> str:
    value = extract_section(text, "Confidence Score")

    if value == "N/A":
        return "N/A"

    import re

    percent_match = re.search(r"\d+\s*%", value)
    if percent_match:
        return percent_match.group(0).replace(" ", "")

    number_match = re.search(r"\b\d{1,3}\b", value)
    if number_match:
        return f"{number_match.group(0)}%"

    return value


def extract_mttr(text: str) -> str:
    value = extract_section(text, "Estimated MTTR")

    if value == "N/A":
        return "N/A"

    return value.splitlines()[0].strip()


@router.post("/analyze")
def analyze_rca(request: RCARequest):
    try:
        raw_rca = generate_root_cause_analysis(
            request.incident_title,
            request.commands,
            request.runbook
        )

        return {
            "success": True,
            "incident_title": request.incident_title,
            "severity": extract_severity(raw_rca),
            "business_impact": extract_section(raw_rca, "Business Impact"),
            "root_cause": extract_section(raw_rca, "Most Probable Root Cause"),
            "evidence": extract_section(raw_rca, "Evidence Supporting Root Cause"),
            "affected_components": extract_section(raw_rca, "Affected Components"),
            "mttr": extract_mttr(raw_rca),
            "confidence_score": extract_confidence_score(raw_rca),
            "immediate_fix": extract_section(raw_rca, "Immediate Fix"),
            "long_term_actions": extract_section(raw_rca, "Long Term Preventive Actions"),
            "executive_summary": extract_section(raw_rca, "Executive Summary"),
            "raw_markdown": raw_rca
        }

    except Exception as ex:
        raise HTTPException(
            status_code=500,
            detail=str(ex)
        )