from fastapi import APIRouter

from services.timeline_service import TimelineService

router = APIRouter(
    prefix="/timeline",
    tags=["Incident Timeline"],
)


@router.get("/latest")
def get_latest_timeline():
    """
    Returns the latest enterprise incident timeline.
    """
    return TimelineService.latest()