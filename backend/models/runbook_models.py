from pydantic import BaseModel, Field


class RunbookRequest(BaseModel):
    incident_title: str = Field(
        ...,
        min_length=3,
        max_length=250,
    )
    commands: str = Field(
        ...,
        min_length=1,
    )


class RunbookResponse(BaseModel):
    success: bool
    message: str
    incident_id: int
    runbook: str