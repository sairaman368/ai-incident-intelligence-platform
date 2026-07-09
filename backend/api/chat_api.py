from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.chat_service import ask_runbook_assistant

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


@router.post("/assistant/chat")
def assistant_chat(request: ChatRequest):

    try:

        answer = ask_runbook_assistant(
            request.question
        )

        return {
            "success": True,
            "answer": answer
        }

    except Exception as ex:

        raise HTTPException(
            status_code=500,
            detail=str(ex)
        )