// import axios from "axios";

// const API_URL = "http://localhost:5150/api/Client";

// export const applyMotorInsurance = async (
//   formData: FormData
// ) => {
//   try {
//     const token = localStorage.getItem("authToken");
    
//     if (!token) {
//       throw new Error("No authentication token found");
//     }

//     console.log("Sending FormData:", formData);
    
//     // Log all form data entries
//     for (const pair of formData.entries()) {
//       console.log(`${pair[0]}: ${pair[1]}`);
//     }

//     const response = await axios.post(
//       `${API_URL}/apply/motor`, // No clientId in URL - it's in the token
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           "Accept": "*/*",
//           "Authorization": `Bearer ${token}`
//         }
//       }
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error("Motor apply failed:", error);

//     // Log detailed validation errors if available
//     if (error.response?.data?.errors) {
//       console.error("Validation errors:", error.response.data.errors);
      
//       // Create a user-friendly error message from validation errors
//       const validationErrors = error.response.data.errors;
//       let errorMessage = "Validation errors:\n";
//       Object.keys(validationErrors).forEach(key => {
//         errorMessage += `• ${key}: ${validationErrors[key].join(', ')}\n`;
//       });
//       throw new Error(errorMessage);
//     }

//     throw new Error(
//       error.response?.data?.title ||
//       error.response?.data?.message ||
//       "Invalid data. Please check all required fields."
//     );
//   }
// };

// motorInsuranceApi.ts - Updated API functions

import axios from "axios";

const API_URL = "http://localhost:5150/api/Client";

// Step 1: Preview/Calculate endpoint
export const previewMotorInsurance = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("Sending FormData to preview endpoint:");
    
    // Log all form data entries
    for (const pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: File(${(pair[1] as File).name}, ${(pair[1] as File).type}, ${(pair[1] as File).size} bytes)`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }

    const response = await axios.post(
      `${API_URL}/apply/motor/preview`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "*/*",
          "Authorization": `Bearer ${token}`
        }
      }
    );
    
    console.log("Preview response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Motor preview failed:", error);

    // Handle validation errors
    if (error.response?.data?.errors) {
      console.error("Validation errors:", error.response.data.errors);
      
      const validationErrors = error.response.data.errors;
      let errorMessage = "Validation errors:\n";
      Object.keys(validationErrors).forEach(key => {
        errorMessage += `• ${key}: ${validationErrors[key].join(', ')}\n`;
      });
      throw new Error(errorMessage);
    }

    throw new Error(
      error.response?.data?.title ||
      error.response?.data?.message ||
      "Invalid data. Please check all required fields."
    );
  }
};

// Step 2: Confirm/Submit endpoint
export const confirmMotorInsurance = async (applicationId: string) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("Confirming application:", applicationId);

    const response = await axios.post(
      `${API_URL}/apply/motor/confirm`,
      { applicationId },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "*/*",
          "Authorization": `Bearer ${token}`
        }
      }
    );
    
    console.log("Confirm response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Motor confirmation failed:", error);

    throw new Error(
      error.response?.data?.title ||
      error.response?.data?.message ||
      "Failed to submit application to finance officer."
    );
  }
};