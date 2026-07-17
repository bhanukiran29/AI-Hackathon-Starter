import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function askAI(options) {
  const response = await axios.post(`${API_URL}/api/chat`, options);

  return response.data;
}
