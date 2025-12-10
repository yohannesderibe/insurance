// 
import axios from "axios";

const API_URL = "http://localhost:5150/api/Client";

// ===============================
// PREVIEW MOTOR INSURANCE
// ===============================
export const previewMotorInsurance = async (formData: FormData) => {
  const token = localStorage.getItem("authToken");

  const response = await axios.post(
    `${API_URL}/apply/motor/preview`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ===============================
// CONFIRM MOTOR INSURANCE
// ===============================
export const confirmMotorInsurance = async (applicationId: string) => {
  const token = localStorage.getItem("authToken");

  const response = await axios.post(
    `${API_URL}/apply/motor/confirm`,
    { applicationId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
