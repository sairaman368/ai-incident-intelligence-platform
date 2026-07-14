import api from "./api";

export const analyzeRCA = async (payload) => {
  const incidentId =
    payload.incidentId || payload.incident_id;

  if (!incidentId) {
    throw new Error(
      "Incident ID is required before generating RCA."
    );
  }

  const response = await api.post("/rca/analyze", {
    incident_id: incidentId,
    incident_title:
      payload.incidentTitle || payload.incident_title,
    commands: payload.commands || "",
    runbook: payload.runbook || ""
  });

  return response.data;
};