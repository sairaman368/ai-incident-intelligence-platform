import json
import re

from fastapi import APIRouter, HTTPException

from models.risk_models import (
    IncidentRiskRequest,
    IncidentRiskResponse,
)
from services.risk_service import generate_risk_assessment


router = APIRouter(
    prefix="/risk",
    tags=["Executive Incident Risk"],
)


def extract_json_payload(raw_response: str) -> dict:
    if not raw_response or not raw_response.strip():
        raise ValueError("The AI risk engine returned an empty response.")

    cleaned_response = raw_response.strip()

    cleaned_response = re.sub(
        r"^```(?:json)?\s*",
        "",
        cleaned_response,
        flags=re.IGNORECASE,
    )
    cleaned_response = re.sub(
        r"\s*```$",
        "",
        cleaned_response,
    )

    try:
        return json.loads(cleaned_response)
    except json.JSONDecodeError:
        match = re.search(
            r"\{.*\}",
            cleaned_response,
            flags=re.DOTALL,
        )

        if not match:
            raise ValueError(
                "The AI risk engine did not return valid JSON."
            )

        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError as error:
            raise ValueError(
                "The AI risk engine returned malformed JSON."
            ) from error


def clamp_score(value) -> int:
    try:
        score = int(float(value))
    except (TypeError, ValueError):
        score = 0

    return max(0, min(score, 100))


def normalize_risk_level(value: str, overall_score: int) -> str:
    allowed_levels = {
        "low": "Low",
        "medium": "Medium",
        "high": "High",
        "critical": "Critical",
    }

    normalized_value = str(value or "").strip().lower()

    if normalized_value in allowed_levels:
        return allowed_levels[normalized_value]

    if overall_score >= 85:
        return "Critical"

    if overall_score >= 65:
        return "High"

    if overall_score >= 35:
        return "Medium"

    return "Low"


@router.post(
    "/assess",
    response_model=IncidentRiskResponse,
)
def assess_incident_risk(
    request: IncidentRiskRequest,
):
    try:
        raw_response = generate_risk_assessment(
            incident_title=request.incident_title,
            incident_description=request.incident_description,
            runbook=request.runbook,
            executive_rca=request.executive_rca,
        )

        risk_data = extract_json_payload(raw_response)

        overall_score = clamp_score(
            risk_data.get("overall_score")
        )

        risk_level = normalize_risk_level(
            risk_data.get("risk_level"),
            overall_score,
        )

        return IncidentRiskResponse(
            success=True,
            overall_score=overall_score,
            risk_level=risk_level,
            customer_impact=clamp_score(
                risk_data.get("customer_impact")
            ),
            availability_impact=clamp_score(
                risk_data.get("availability_impact")
            ),
            financial_impact=clamp_score(
                risk_data.get("financial_impact")
            ),
            operational_impact=clamp_score(
                risk_data.get("operational_impact")
            ),
            recovery_confidence=clamp_score(
                risk_data.get("recovery_confidence")
            ),
            summary=str(
                risk_data.get(
                    "summary",
                    "No executive risk summary was returned.",
                )
            ).strip(),
        )

    except ValueError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error),
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Risk assessment failed: {str(error)}",
        ) from error