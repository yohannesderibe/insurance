import api from "../axios";

export interface RegisterClientPayload {
  firstName: string;
  fatherName: string;
  grandFatherName: string;
  dateOfBirth: string; // ISO string
  email: string;
  phoneNumber: string;
  region: string;
  city: string;
  subCity: string;
  password: string;
  confirmPassword: string;
  nationalIdOrPassport: string;
  gender: string;
  passportImage: File;
}

const clientApi = {
  async registerClient(data: RegisterClientPayload) {
    try {
      const formData = new FormData();
      
      // Generate UUID for Id field
      const uuid = crypto.randomUUID();
      
      console.log("🆔 Generated UUID:", uuid);
      console.log("📅 Date of Birth (raw):", data.dateOfBirth);
      
      // Parse and format date to ensure it's valid
      const dobDate = new Date(data.dateOfBirth);
      const formattedDob = dobDate.toISOString();
      console.log("📅 Date of Birth (formatted):", formattedDob);
      
      // Append all fields exactly as backend expects
      formData.append("Id", uuid);
      formData.append("FirstName", data.firstName.trim());
      formData.append("FatherName", data.fatherName.trim());
      formData.append("GrandFatherName", data.grandFatherName.trim());
      formData.append("DateOfBirth", formattedDob);
      formData.append("Email", data.email.trim());
      formData.append("PhoneNumber", data.phoneNumber.trim());
      formData.append("Region", data.region.trim());
      formData.append("City", data.city.trim());
      formData.append("SubCity", data.subCity.trim());
      formData.append("Password", data.password);
      formData.append("ConfirmPassword", data.confirmPassword);
      formData.append("NationalIdOrPassport", data.nationalIdOrPassport.trim());
      formData.append("Gender", data.gender);
      formData.append("LogoImageUrl", ""); // Changed from "string" to empty string
      
      // Append the image file
      if (data.passportImage) {
        formData.append("PassportOrNationalIdImage", data.passportImage);
      } else {
        console.warn("⚠️ No passport image provided!");
        formData.append("PassportOrNationalIdImage", new File([""], "empty.txt"));
      }

      console.log("📤 Registration FormData contents:");
      for (const pair of formData.entries()) {
        const key = pair[0];
        const value = pair[1];
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}: "${value}"`);
        }
      }

      // Make the API call with better error handling
      const response = await api.post("/Client/register", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Accept": "application/json"
        },
      });

      console.log("✅ Registration successful! Response:", response.data);
      return response.data;
      
    } catch (error: any) {
      console.error("❌ Registration failed!");
      
      // Detailed error logging
      if (error.response) {
        console.error("📊 Server responded with:", error.response.status);
        console.error("📝 Response data:", error.response.data);
        console.error("📋 Response headers:", error.response.headers);
        
        // Try to extract validation errors
        if (error.response.data && typeof error.response.data === 'object') {
          if (error.response.data.errors) {
            console.error("🚫 Validation errors:");
            Object.entries(error.response.data.errors).forEach(([field, messages]) => {
              console.error(`  ${field}:`, messages);
            });
          }
          if (error.response.data.title) {
            console.error("📛 Error title:", error.response.data.title);
          }
          if (error.response.data.message) {
            console.error("💬 Error message:", error.response.data.message);
          }
        }
      } else if (error.request) {
        console.error("🌐 No response received from server");
        console.error("Request:", error.request);
      } else {
        console.error("⚙️ Request setup error:", error.message);
      }
      
      console.error("Full error object:", error);
      
      // Re-throw with more context
      throw new Error(`Registration failed: ${error.message || 'Unknown error'}`);
    }
  },
};

export default clientApi;