import { mockCategories } from "../../../mockdata/categories";

export const getCustomerCategories = async () => {
  // 🔜 Replace with backend API (GET /api/categories)
  return Promise.resolve(mockCategories);
};



// import axios from "axios";

// const API_URL = "http://localhost:5150/api/Admin";

// export const getCustomerCategories = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/get-maincategory`);
//     return response.data;
//   } catch (error) {
//     console.error("Failed to load main categories:", error);
//     throw error;
//   }
// };

// export const addMainCategory = async (data: any) => {
//   try {
//     const formData = new FormData();

//     formData.append("Name", data.name);
//     formData.append("Description", data.description);
//     formData.append("IsActive", String(data.isActive));
//     formData.append("CreatedAt", new Date().toISOString());

//     if (data.imageFile) {
//       formData.append("ImageFile", data.imageFile);
//     }

//     const response = await axios.post(
//       `${API_URL}/add-maincategory`,
//       formData,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Failed to add main category:", error);
//     throw error;
//   }
// };
