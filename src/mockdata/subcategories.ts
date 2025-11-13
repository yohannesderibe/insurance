export const mockSubcategories = [
  {
    id: 1,
    categoryId: 1,
    name: "Comprehensive Car",
    description: "Covers all accident damages.",
    basePrice: 5000,
    coverages: [
      { name: "Third-Party Damage", extraCost: 500 },
      { name: "Fire Damage", extraCost: 800 },
      { name: "Theft Protection", extraCost: 1000 },
    ],
  },
  {
    id: 2,
    categoryId: 2,
    name: "Family Health",
    description: "Full coverage for family members.",
    basePrice: 3000,
    coverages: [
      { name: "Dental", extraCost: 200 },
      { name: "Vision", extraCost: 250 },
      { name: "Emergency Surgery", extraCost: 700 },
    ],
  },
];
