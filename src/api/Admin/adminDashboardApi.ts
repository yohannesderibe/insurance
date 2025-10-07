// src/api/Admin/adminDashboardApi.ts
import api from '../axios';

export const getDashboardStats = async () => {
  const res = await api.get('/Admin/dashboard'); // Now: http://localhost:5150/api/Admin/dashboard
  return res.data;
};

export const getUserTrends = async () => {
  const res = await api.get('/Admin/dashboard/user-trends');
  return res.data;
};