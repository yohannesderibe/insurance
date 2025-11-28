import axios from "axios";
import { customerPolicies, type CustomerPolicy } from "../../mockdata/policies";

const API_URL = "http://localhost:5150/api/Customer";

export const getCustomerPolicies = async (): Promise<CustomerPolicy[]> => {
  try {
    const response = await axios.get(`${API_URL}/policies`);
    return response.data;
  } catch (error: any) {
    if (error.code === "ERR_NETWORK" || error.response?.status >= 500) {
      return customerPolicies;
    }
    console.error("Failed to load policies:", error);
    return customerPolicies;
  }
};

