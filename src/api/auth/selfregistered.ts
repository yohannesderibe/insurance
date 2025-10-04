import api from "../axios"; // your axios instance

// Only the fields you have in RegisterPage
export interface RegisterClientPayload {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  subCity: string;
  password: string;
  confirmPassword: string;
}

const clientApi = {
  async registerClient(data: RegisterClientPayload) {
    try {
      // FormData if backend expects multipart
      const formData = new FormData();
      formData.append("FullName", data.fullName);
      formData.append("Email", data.email);
      formData.append("MobilePhone", data.phone);
      formData.append("Country", data.country);
      formData.append("City", data.city);
      formData.append("SubCity", data.subCity);
      formData.append("Password", data.password);
      formData.append("ConfirmPassword", data.confirmPassword);

      const response = await api.post("/Client/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ API response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ API error:", error);
      throw error;
    }
  },
};

export default clientApi;
