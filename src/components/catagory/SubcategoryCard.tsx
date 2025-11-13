import React from "react";

interface SubcategoryCardProps {
  name: string;
  description: string;
  basePrice: number;
}

const SubcategoryCard: React.FC<SubcategoryCardProps> = ({ name, description, basePrice }) => {
  return (
    <div className="p-4 border rounded-2xl shadow-md bg-white hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-gray-600 mt-1">{description}</p>
      <p className="mt-2 text-blue-700 font-medium">Base Price: ${basePrice}</p>
    </div>
  );
};

export default SubcategoryCard;
