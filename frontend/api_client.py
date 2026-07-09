import requests

from config import API_URL


def generate_runbook(incident, commands):
    """
    Calls the FastAPI backend to generate an AI runbook.
    """

    url = f"{API_URL}/generate-runbook"

    payload = {
        "incident_title": incident,
        "commands": commands
    }

    try:
        response = requests.post(
            url,
            json=payload,
            timeout=120
        )

        response.raise_for_status()

        return response.json()

    except requests.exceptions.RequestException as e:

        return {
            "success": False,
            "message": str(e)
        }