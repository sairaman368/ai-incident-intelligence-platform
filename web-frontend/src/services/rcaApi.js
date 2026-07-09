import api from "./api";

export const analyzeRCA = async (payload) => {
  const response = await api.post("/rca/analyze", {
    incident_title: payload.incidentTitle || payload.incident_title,
    commands: payload.commands,
    runbook: payload.runbook
  });

  return response.data;
};