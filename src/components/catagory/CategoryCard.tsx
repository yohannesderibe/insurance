import React from "react";

interface CategoryCardProps {
  name: string;
  description: string;
  onViewDetails: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, description, onViewDetails }) => {
  return (
    <div className="p-4 border rounded-2xl shadow-md hover:shadow-lg transition bg-white">
      <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
      <p className="text-gray-600 mt-2">{description}</p>
      <button
        onClick={onViewDetails}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        See Details
      </button>
    </div>
  );
};

export default CategoryCard;
