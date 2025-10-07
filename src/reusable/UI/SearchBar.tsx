// src/reusable/UI/SearchBar.tsx
import React from "react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search...", value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-amber-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-amber-50/50 pl-10 text-amber-900 placeholder-amber-400"
    />
  );
};

export default SearchBar;