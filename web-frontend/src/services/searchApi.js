import api from "./api";

export const searchRunbooks = async (query) => {
  const response = await api.get("/runbooks/search", {
    params: {
      q: query,
    },
  });

  return response.data.data;
};