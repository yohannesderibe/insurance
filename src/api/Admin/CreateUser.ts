// api/Admin/CreateUser.ts
import axios from "axios";

const BASE_URL = "http://localhost:5150/api/Admin";

const getHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "*/*",
    "Content-Type": "multipart/form-data",
  },
});

const handleError = (error: any, endpoint: string) => {
  console.error(`Error in ${endpoint}:`, error);
  throw new Error(`Failed request to ${endpoint}: ${error.message}`);
};

export const createManager = async (token: string, formData: FormData) => {
  try {
    const res = await axios.post(`${BASE_URL}/add-manager`, formData, getHeaders(token));
    return res.data;
  } catch (error) {
    handleError(error, "create manager");
  }
};

export const createFinance = async (token: string, formData: FormData) => {
  try {
    const res = await axios.post(`${BASE_URL}/add-finance`, formData, getHeaders(token));
    return res.data;
  } catch (error) {
    handleError(error, "create finance");
  }
};

export const createOperator = async (token: string, formData: FormData) => {
  try {
    const res = await axios.post(`${BASE_URL}/add-operator`, formData, getHeaders(token));
    return res.data;
  } catch (error) {
    handleError(error, "create operator");
  }
};

export const createClient = async (token: string, formData: FormData) => {
  try {
    const res = await axios.post(`${BASE_URL}/add-client`, formData, getHeaders(token));
    return res.data;
  } catch (error) {
    handleError(error, "create client");
  }
};