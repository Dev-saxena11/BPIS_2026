import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const getDistricts = async () => {
  const response = await axios.get(`${API_BASE}/districts`);
  return response.data;
};

export const getPriorityRanking = async () => {
  const response = await axios.get("http://127.0.0.1:8000/priority-ranking");
  return response.data;
};