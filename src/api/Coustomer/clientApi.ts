import axios from "axios";

const BASE_URL = "http://localhost:5150/api/Client";

export const createClient = async (payload: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/create`, payload);
    return response.data;
  } catch (err: any) {
    console.error("Create client failed:", err);
    throw err;
  }
};
