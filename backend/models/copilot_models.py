from pydantic import BaseModel


class CopilotRequest(BaseModel):
    incident_title: str
    incident_description: str = ""
    runbook: str = ""
    question: str


class CopilotResponse(BaseModel):
    success: bool
    answer: str