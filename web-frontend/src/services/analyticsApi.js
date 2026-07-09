import api from "./api";

export const getAnalytics = async () => {
  const response = await api.get("/analytics/statistics");
  return response.data.data;
};