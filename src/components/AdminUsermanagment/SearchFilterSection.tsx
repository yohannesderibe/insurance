import { Search, Filter } from "lucide-react";
import SearchBar from "../../reusable/UI/SearchBar";

interface SearchFilterSectionProps {
  selectedRole: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const SearchFilterSection: React.FC<SearchFilterSectionProps> = ({
  selectedRole,
  searchTerm,
  setSearchTerm
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200 mb-6">
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
      <div className="flex-1 w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
          <SearchBar
            placeholder={`Search ${selectedRole.toLowerCase()} by name or email...`}
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors">
        <Filter className="w-4 h-4" />
        Filter
      </button>
    </div>
  </div>
);

export default SearchFilterSection;