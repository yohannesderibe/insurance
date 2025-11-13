import { mockCategories } from "../../../mockdata/categories";

export const getCustomerCategories = async () => {
  // 🔜 Replace with backend API (GET /api/categories)
  return Promise.resolve(mockCategories);
};
