from pydantic import BaseModel, Field


class IncidentRiskRequest(BaseModel):
    incident_title: str = Field(min_length=1)
    incident_description: str = ""
    runbook: str = ""
    executive_rca: str = ""


class IncidentRiskResponse(BaseModel):
    success: bool
    overall_score: int
    risk_level: str
    customer_impact: int
    availability_impact: int
    financial_impact: int
    operational_impact: int
    recovery_confidence: int
    summary: str