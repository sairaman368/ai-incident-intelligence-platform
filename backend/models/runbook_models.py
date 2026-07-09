from typing import List
from pydantic import BaseModel


class RunbookRequest(BaseModel):
    incident_title: str
    commands: str


class RunbookResponse(BaseModel):
    success: bool
    message: str
    runbook: str


class RunbookHistory(BaseModel):
    id: int
    incident_title: str
    commands: str
    runbook: str
    created_at: str


class RunbookHistoryResponse(BaseModel):
    success: bool
    data: List[RunbookHistory]