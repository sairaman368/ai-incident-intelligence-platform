import re
from time import perf_counter

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.ai_service import generate_root_cause_analysis

from database.database import (
    DEFAULT_AI_MODEL,
    add_ai_generation_history,
    add_timeline_event,
    get_incident_by_id,
    update_incident_intelligence,
)


router = APIRouter(
    prefix="/rca",
    tags=["Root Cause Analysis"],
)


class RCARequest(BaseModel):
    incident_id: int = Field(..., gt=0)
    incident_title: str = Field(..., min_length=1)
    commands: str = ""
    runbook: str = ""


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

        normalized_no_colon = (
            normalized.replace(":", "").strip().lower()
        )

        if normalized_no_colon == heading_lower:
            capture = True
            continue

        if normalized.lower().startswith(
            f"{heading_lower}:"
        ):
            inline_value = normalized.split(":", 1)[1].strip()

            return (
                clean_text(inline_value)
                if inline_value
                else "N/A"
            )

        if capture and cleaned_line.startswith("#"):
            break

        if capture:
            collected.append(cleaned_line)

    result = "\n".join(collected).strip()

    return clean_text(result) if result else "N/A"


def extract_severity(text: str) -> str:
    value = extract_section(text, "Severity")

    if value == "N/A":
        return "Medium"

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

    percent_match = re.search(r"\d+\s*%", value)

    if percent_match:
        return percent_match.group(0).replace(" ", "")

    number_match = re.search(r"\b\d{1,3}\b", value)

    if number_match:
        return f"{number_match.group(0)}%"

    return value


def confidence_to_integer(value: str) -> int | None:
    match = re.search(r"\d{1,3}", str(value or ""))

    if not match:
        return None

    score = int(match.group(0))

    return max(0, min(score, 100))


def extract_mttr(text: str) -> str:
    value = extract_section(text, "Estimated MTTR")

    if value == "N/A":
        return "N/A"

    return value.splitlines()[0].strip()


def severity_to_priority(severity: str) -> str:
    priority_map = {
        "critical": "P1",
        "high": "P2",
        "medium": "P3",
        "low": "P4",
    }

    return priority_map.get(
        str(severity or "").strip().lower(),
        "P3",
    )


@router.post("/analyze")
def analyze_rca(request: RCARequest):
    incident = get_incident_by_id(request.incident_id)

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Incident ID {request.incident_id} "
                "was not found."
            ),
        )

    start_time = perf_counter()
    raw_rca = ""

    try:
        raw_rca = generate_root_cause_analysis(
            request.incident_title,
            request.commands,
            request.runbook,
        )

        response_time_seconds = round(
            perf_counter() - start_time,
            2,
        )

        severity = extract_severity(raw_rca)
        confidence_text = extract_confidence_score(raw_rca)
        confidence_score = confidence_to_integer(
            confidence_text
        )
        mttr = extract_mttr(raw_rca)

        root_cause = extract_section(
            raw_rca,
            "Most Probable Root Cause",
        )

        executive_summary = extract_section(
            raw_rca,
            "Executive Summary",
        )

        business_impact = extract_section(
            raw_rca,
            "Business Impact",
        )

        evidence = extract_section(
            raw_rca,
            "Evidence Supporting Root Cause",
        )

        affected_components = extract_section(
            raw_rca,
            "Affected Components",
        )

        immediate_fix = extract_section(
            raw_rca,
            "Immediate Fix",
        )

        long_term_actions = extract_section(
            raw_rca,
            "Long Term Preventive Actions",
        )

        updated = update_incident_intelligence(
            request.incident_id,
            root_cause=root_cause,
            executive_summary=executive_summary,
            confidence_score=confidence_score,
            severity=severity,
            priority=severity_to_priority(severity),
            mttr=mttr,
            status="under_rca",
        )

        if not updated:
            raise RuntimeError(
                "The RCA was generated, but the incident "
                "record could not be updated."
            )

        add_ai_generation_history(
            incident_id=request.incident_id,
            operation_type="rca",
            model_name=DEFAULT_AI_MODEL,
            prompt_text=(
                f"Incident Title:\n{request.incident_title}\n\n"
                f"Commands:\n{request.commands}\n\n"
                f"Runbook:\n{request.runbook}"
            ),
            response_text=raw_rca,
            success=True,
            response_time_seconds=response_time_seconds,
        )

        add_timeline_event(
            incident_id=request.incident_id,
            stage="Executive RCA Generated",
            status="completed",
            summary=(
                "AI-generated executive root cause analysis "
                "was completed."
            ),
            details=executive_summary,
            actor=DEFAULT_AI_MODEL,
            source="ollama",
            confidence_score=confidence_score,
            ai_generated=True,
            metadata={
                "severity": severity,
                "priority": severity_to_priority(severity),
                "mttr": mttr,
                "response_time_seconds": (
                    response_time_seconds
                ),
            },
        )

        return {
            "success": True,
            "incident_id": request.incident_id,
            "incident_title": request.incident_title,
            "severity": severity,
            "business_impact": business_impact,
            "root_cause": root_cause,
            "evidence": evidence,
            "affected_components": affected_components,
            "mttr": mttr,
            "confidence_score": confidence_text,
            "immediate_fix": immediate_fix,
            "long_term_actions": long_term_actions,
            "executive_summary": executive_summary,
            "response_time_seconds": response_time_seconds,
            "persisted": True,
            "raw_markdown": raw_rca,
        }

    except HTTPException:
        raise

    except Exception as error:
        response_time_seconds = round(
            perf_counter() - start_time,
            2,
        )

        try:
            add_ai_generation_history(
                incident_id=request.incident_id,
                operation_type="rca",
                model_name=DEFAULT_AI_MODEL,
                prompt_text=(
                    f"Incident Title:\n"
                    f"{request.incident_title}"
                ),
                response_text=raw_rca,
                success=False,
                error_message=str(error),
                response_time_seconds=response_time_seconds,
            )
        except Exception as history_error:
            print(
                "Unable to record failed RCA history:",
                history_error,
            )

        raise HTTPException(
            status_code=500,
            detail=f"RCA analysis failed: {str(error)}",
        ) from error