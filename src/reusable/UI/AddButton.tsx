// src/reusable/UI/AddButton.tsx
import React from "react";
import { FiPlus } from "react-icons/fi";

interface AddButtonProps {
  label: string;
  onClick?: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-amber-200"
    >
      <FiPlus className="w-5 h-5" /> 
      {label}
    </button>
  );
};

export default AddButton;