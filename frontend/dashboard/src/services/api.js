import axios from "axios";

const API_BASE = "http://localhost:8000";

export const getDistricts = async () => {
  const response = await axios.get(`${API_BASE}/districts`);
  return response.data;
};

export const getPriorityRanking = async () => {
  const response = await axios.get("http://localhost:8000/priority-ranking");
  return response.data;
};