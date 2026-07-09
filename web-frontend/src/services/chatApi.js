import api from "./api";

export const askAssistant = async (question) => {
  const response = await api.post("/assistant/chat", {
    question,
  });

  return response.data.answer;
};