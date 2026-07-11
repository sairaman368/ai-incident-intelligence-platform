from fastapi import APIRouter

from services.dashboard_service import get_platform_health

router = APIRouter(
    prefix="/dashboard",
    tags=["Enterprise Dashboard"],
)


@router.get("/platform-health")
def platform_health():
    return get_platform_health()