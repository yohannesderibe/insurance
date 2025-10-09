// // src/api/Admin/userManagementApi.ts
// import axios from "axios";

// const BASE_URL = "http://localhost:5150/api/Admin";

// // Reusable header function
// const getHeaders = (token: string) => ({
//   headers: {
//     Authorization: `Bearer ${token}`,
//     Accept: "*/*",
//     "Content-Type": "application/json",
//   },
// });

// // Generic error handler
// const handleError = (error: any, endpoint: string) => {
//   console.error(`Error fetching ${endpoint}:`, error);
//   throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
// };

// // Fetch all clients
// export const getClients = async (token: string) => {
//   try {
//     const res = await axios.get(`${BASE_URL}/clients`, getHeaders(token));
//     return res.data;
//   } catch (error) {
//     handleError(error, "clients");
//   }
// };

// // Fetch all managers
// export const getManagers = async (token: string) => {
//   try {
//     const res = await axios.get(`${BASE_URL}/managers`, getHeaders(token));
//     return res.data;
//   } catch (error) {
//     handleError(error, "managers");
//   }
// };

// // Fetch all operators
// export const getOperators = async (token: string) => {
//   try {
//     const res = await axios.get(`${BASE_URL}/operators`, getHeaders(token));
//     return res.data;
//   } catch (error) {
//     handleError(error, "operators");
//   }
// };

// // Fetch all finance officers
// export const getFinances = async (token: string) => {
//   try {
//     const res = await axios.get(`${BASE_URL}/finances`, getHeaders(token));
//     return res.data;
//   } catch (error) {
//     handleError(error, "finance officers");
//   }
// };

// src/api/Admin/userManagementApi.ts
import axios from "axios";

const BASE_URL = "http://localhost:5150/api/Admin";

// Reusable header function
const getHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

// Generic error handler
const handleError = (error: any, endpoint: string) => {
  console.error(`Error in ${endpoint}:`, error);
  throw new Error(`Failed request to ${endpoint}: ${error.message}`);
};

// 🟢 Fetch all clients
export const getClients = async (token: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/clients`, getHeaders(token));
    return res.data;
  } catch (error) {
    handleError(error, "clients");
  }
};

// 🟢 Fetch all managers
export const getManagers = async (token: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/managers`, getHeaders(token));
    return res.data;
  } catch (error) {
    handleError(error, "managers");
  }
};

// 🟢 Fetch all operators
export const getOperators = async (token: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/operators`, getHeaders(token));
    return res.data;
  } catch (error) {
    handleError(error, "operators");
  }
};

// 🟢 Fetch all finance officers
export const getFinances = async (token: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/finances`, getHeaders(token));
    return res.data;
  } catch (error) {
    handleError(error, "finances");
  }
};

//
// 🌹 DELETE endpoints
//
export const deleteClient = async (token: string, id: string) => {
  try {
    const res = await axios.delete(`${BASE_URL}/clients/${id}`, getHeaders(token));
    return res.data;
  } catch (error) {
    handleError(error, `delete client (${id})`);
  }
};

export const deleteManager = async (token: string, id: string) => {
  try {
    const res = await axios.delete(`${BASE_URL}/managers/${id}`, getHeaders(token));
    return res.data;
  } catch (error) {
    handleError(error, `delete manager (${id})`);
  }
};

export const deleteOperator = async (token: string, id: string) => {
  try {
    const res = await axios.delete(`${BASE_URL}/operators/${id}`, getHeaders(token));
    return res.data;
  } catch (error) {
    handleError(error, `delete operator (${id})`);
  }
};

export const deleteFinance = async (token: string, id: string) => {
  try {
    const res = await axios.delete(`${BASE_URL}/finances/${id}`, getHeaders(token));
    return res.data;
  } catch (error) {
    handleError(error, `delete finance officer (${id})`);
  }
};
// 🟡 Update Manager
export const updateManager = async (token: string, id: string, formData: FormData) => {
  try {
    const res = await axios.put(`${BASE_URL}/managers/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    handleError(error, `update manager (${id})`);
  }
};

// 🟡 Update Operator
export const updateOperator = async (token: string, id: string, formData: FormData) => {
  try {
    const res = await axios.put(`${BASE_URL}/operators/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    handleError(error, `update operator (${id})`);
  }
};

// 🟡 Update Finance Officer
export const updateFinance = async (token: string, id: string, formData: FormData) => {
  try {
    const res = await axios.put(`${BASE_URL}/finances/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    handleError(error, `update finance (${id})`);
  }
};
