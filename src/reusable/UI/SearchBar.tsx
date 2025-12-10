// // src/reusable/UI/SearchBar.tsx
// import React from "react";

// interface SearchBarProps {
//   placeholder?: string;
//   value: string;
//   onChange: (value: string) => void;
// }

// const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search...", value, onChange }) => {
//   return (
//     <input
//       type="text"
//       placeholder={placeholder}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="border border-amber-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-amber-50/50 pl-10 text-amber-900 placeholder-amber-400"
//     />
//   );
// };

// export default SearchBar;

// src/reusable/UI/SearchBar.tsx
import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search...", 
  value, 
  onChange,
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="w-5 h-5 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-amber-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-amber-300 focus:border-transparent bg-white"
      />
    </div>
  );
};

export default SearchBar;