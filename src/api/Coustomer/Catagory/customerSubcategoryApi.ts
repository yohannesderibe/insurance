import { mockSubcategories } from "../../../mockdata/subcategories";

export const getSubcategoriesByCategory = async (categoryId: number) => {
  // 🔜 Replace with backend API (GET /api/categories/:id/subcategories)
  return Promise.resolve(mockSubcategories.filter(s => s.categoryId === categoryId));
};
