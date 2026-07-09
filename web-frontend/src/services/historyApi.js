import api from "./api";

export const getRunbooks = async () => {
  const response = await api.get("/runbooks");
  return response.data.data;
};

export const getRunbook = async (id) => {
  const response = await api.get(`/runbooks/${id}`);
  return response.data;
};

export const deleteRunbook = async (id) => {
  const response = await api.delete(`/runbooks/${id}`);
  return response.data;
};