import api from "./api";

export const getSimilarIncidents = async (incidentTitle) => {
  const response = await api.get(
    `/similar/${encodeURIComponent(incidentTitle)}`
  );

  return response.data.data;
};