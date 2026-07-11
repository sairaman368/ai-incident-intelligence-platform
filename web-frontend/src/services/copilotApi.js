import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function askCopilot(payload) {
  const response = await axios.post(
    `${API_BASE_URL}/copilot/ask`,
    payload
  );

  return response.data;
}