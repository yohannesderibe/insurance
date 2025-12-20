import axios from "axios";
 import api from "../../axios"; // your configured axios instance

// ---------- Motor Claim ----------
export const submitMotorClaim = (
  motorApplicationId: string,
  data: FormData
) => {
  return api.post(
    `/api/Client/claims/motor/${motorApplicationId}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};

// ---------- Life Claim ----------
export const submitLifeClaim = (
  lifeApplicationId: string,
  data: FormData
) => {
  return api.post(
    `/api/Client/claims/life/${lifeApplicationId}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};


import { customerClaims, type CustomerClaim } from "../../../mockdata/claims";

const API_URL = "http://localhost:5150/api/Customer";

export const getCustomerClaims = async (): Promise<CustomerClaim[]> => {
  try {
    const response = await axios.get(`${API_URL}/claims`);
    return response.data;
  } catch (error: any) {
    if (error.code === "ERR_NETWORK" || error.response?.status >= 500) {
      return customerClaims;
    }
    console.error("Failed to load claims:", error);
    return customerClaims;
  }
};
