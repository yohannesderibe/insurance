import axios from "axios";

const BASE_URL = "http://localhost:5150/api/Admin/dashboard";

// 🟡 Get overall dashboard stats
export const getDashboardStats = async (token: string) => {
  const res = await axios.get(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "*/*",
    },
  });
  return res.data;
};

// 🟠 Get user trends
export const getUserTrends = async (token: string) => {
  const res = await axios.get(`${BASE_URL}/user-trends`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "*/*",
    },
  });
  return res.data;
};
