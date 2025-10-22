// import api from "../axios";
// import mockData from "../../data/CousotmerMockData.json";

// /**
//  * Fetches dashboard data.
//  * Temporarily uses local mock data until backend endpoint is live.
//  */
// export const getCustomerDashboard = async () => {
//   try {
//     // 🔹 When backend is ready, uncomment below:
//     // const response = await api.get("/customer/dashboard");
//     // return response.data;

//     // 🔹 For now, return imported mock data:
//     return mockData;
//   } catch (error) {
//     console.error("Error fetching dashboard data:", error);
//     throw error;
//   }
// // 

import mockData from "../../data/CousotmerMockData.json";

/**
 * Fetches dashboard data.
 * Temporarily uses local mock data until backend endpoint is live.
 */
export const getCustomerDashboard = async () => {
  try {
    // 🔹 When backend is ready, uncomment below:
    // const response = await api.get("/customer/dashboard");
    // return response.data;

    // 🔹 For now, return imported mock data:
    return mockData;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
