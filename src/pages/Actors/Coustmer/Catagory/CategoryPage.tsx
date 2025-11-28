// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   MenuItem,
//   Select,
//   Box,
//   IconButton,
// } from "@mui/material";
// import type{SelectChangeEvent} from "@mui/material"
// import { FiShield } from "react-icons/fi";
// import { IoStar } from "react-icons/io5";
// import { MdViewModule, MdViewList } from "react-icons/md";
// import SearchBar from "../../../../reusable/UI/SearchBar";
// import { getCustomerCategories } from "../../../../api/Coustomer/Catagory/customerCategoryApi";

// type Category = {
//   id: string | number;
//   name: string;
//   description?: string;
//   price?: number;
//   rating?: number;
// };

// const CustomerCategories: React.FC = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [search, setSearch] = useState("");
//   const [sortBy, setSortBy] = useState("name");
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
//   const navigate = useNavigate();

//   useEffect(() => {
//     getCustomerCategories().then((data: any[]) => {
//       const normalized = data.map((d) => ({
//         id: d.id,
//         name: d.name,
//         description: d.description || "",
//         price: d.price || d.startingPrice || 800,
//         rating: d.rating || 4.5,
//       }));
//       setCategories(normalized);
//     });
//   }, []);

//   const filteredAndSorted = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     const filtered = categories.filter(
//       (c) =>
//         c.name.toLowerCase().includes(q) ||
//         c.description.toLowerCase().includes(q)
//     );
//     const sorted = [...filtered].sort((a, b) => {
//       if (sortBy === "name") return a.name.localeCompare(b.name);
//       if (sortBy === "price") return (a.price ?? 0) - (b.price ?? 0);
//       if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
//       return 0;
//     });
//     return sorted;
//   }, [categories, search, sortBy]);

//   const handleSortChange = (e: SelectChangeEvent) => {
//     setSortBy(e.target.value);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-10 px-5">
//       {/* Header */}
//       <div className="max-w-6xl mx-auto text-center mb-10">
//         <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
//           Insurance Categories
//         </h1>
//         <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
//           Choose from our comprehensive range of insurance products designed to
//           protect what matters most to you
//         </p>
//       </div>

//       {/* Search / Sort / Toggle */}
//       <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row items-center gap-4">
//         <div className="flex-1 w-full">
//           <SearchBar
//             placeholder="Search insurance category..."
//             value={search}
//             onChange={setSearch}
//           />
//         </div>

//         <div className="flex items-center gap-3">
//           {/* Sort dropdown */}
//           <Box className="bg-white rounded-xl shadow-sm border border-amber-100">
//             <Select
//               value={sortBy}
//               onChange={handleSortChange}
//               size="small"
//               sx={{
//                 borderRadius: "12px",
//                 fontSize: 14,
//                 color: "#78350f",
//                 "& .MuiOutlinedInput-notchedOutline": { border: "none" },
//                 "& .MuiSelect-select": {
//                   padding: "8px 14px",
//                   backgroundColor: "transparent",
//                 },
//               }}
//             >
//               <MenuItem value="name">Sort by Name</MenuItem>
//               <MenuItem value="price">Sort by Price</MenuItem>
//               <MenuItem value="rating">Sort by Rating</MenuItem>
//             </Select>
//           </Box>

//           {/* Toggle Button */}
//           <div className="flex items-center bg-white border border-amber-100 rounded-2xl shadow-sm overflow-hidden">
//             <button
//               onClick={() => setViewMode("grid")}
//               className={`flex items-center gap-1 px-3 py-2 transition-all duration-200 ${
//                 viewMode === "grid"
//                   ? "bg-gradient-to-r from-amber-300 to-amber-200 text-amber-900 shadow-inner"
//                   : "text-gray-500 hover:text-amber-600"
//               }`}
//             >
//               <MdViewModule size={20} />
//             </button>
//             <button
//               onClick={() => setViewMode("list")}
//               className={`flex items-center gap-1 px-3 py-2 transition-all duration-200 ${
//                 viewMode === "list"
//                   ? "bg-gradient-to-r from-amber-300 to-amber-200 text-amber-900 shadow-inner"
//                   : "text-gray-500 hover:text-amber-600"
//               }`}
//             >
//               <MdViewList size={20} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Cards / List */}
//       <div className="max-w-6xl mx-auto">
//         {viewMode === "grid" ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredAndSorted.map((cat) => (
//               <Card
//                 key={cat.id}
//                 className="rounded-2xl border border-amber-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-amber-50 to-white"
//               >
//                 <CardContent className="p-6 flex flex-col justify-between h-full">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="bg-amber-100 p-3 rounded-full">
//                       <FiShield className="text-amber-600 text-2xl" />
//                     </div>
//                     <div className="flex items-center text-amber-500 font-medium text-sm">
//                       <IoStar className="text-amber-500 mr-1" />{" "}
//                       {cat.rating?.toFixed(1)}
//                     </div>
//                   </div>

//                   <div>
//                     <Typography
//                       variant="h6"
//                       className="text-gray-900 font-bold mb-2"
//                     >
//                       {cat.name}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       className="text-gray-600 mb-4 leading-snug"
//                     >
//                       {cat.description}
//                     </Typography>
//                   </div>

//                   <div className="flex items-center justify-between mt-auto mb-4">
//                     <span className="text-gray-500 text-sm">Starting from</span>
//                     <span className="text-lg font-bold text-gray-900">
//                       ${cat.price ?? 800}
//                     </span>
//                   </div>

//                   <Button
//                     variant="contained"
//                     fullWidth
//                     sx={{
//                       background: "linear-gradient(to right, #f59e0b, #fbbf24)",
//                       borderRadius: "12px",
//                       textTransform: "none",
//                       fontWeight: "600",
//                       "&:hover": {
//                         background:
//                           "linear-gradient(to right, #d97706, #f59e0b)",
//                       },
//                     }}
//                     onClick={() => navigate(`/categories/${cat.id}`)}
//                   >
//                     View Details
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col gap-6">
//             {filteredAndSorted.map((cat) => (
//               <Card
//                 key={cat.id}
//                 className="rounded-2xl border border-amber-100 shadow-sm bg-white hover:shadow-md transition-all"
//               >
//                 <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-5">
//                   <div className="flex-shrink-0 bg-amber-100 p-4 rounded-2xl">
//                     <FiShield className="text-amber-600 text-3xl" />
//                   </div>

//                   <div className="flex-1">
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <Typography
//                           variant="h6"
//                           className="text-gray-900 font-bold"
//                         >
//                           {cat.name}
//                         </Typography>
//                         <Typography
//                           variant="body2"
//                           className="text-gray-600 mt-1"
//                         >
//                           {cat.description}
//                         </Typography>
//                       </div>

//                       <div className="text-right">
//                         <div className="flex items-center justify-end text-amber-500 font-medium">
//                           <IoStar className="mr-1" /> {cat.rating?.toFixed(1)}
//                         </div>
//                         <div className="mt-3 text-gray-900 font-bold text-lg">
//                           ${cat.price ?? 800}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-4 md:mt-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
//                       <div className="text-sm text-gray-500">
//                         Highlights: Coverage, Protection, Assistance
//                       </div>
//                       <Button
//                         variant="contained"
//                         sx={{
//                           background:
//                             "linear-gradient(to right, #f59e0b, #fbbf24)",
//                           borderRadius: "12px",
//                           textTransform: "none",
//                           fontWeight: "600",
//                           "&:hover": {
//                             background:
//                               "linear-gradient(to right, #d97706, #f59e0b)",
//                           },
//                         }}
//                         onClick={() => navigate(`/categories/${cat.id}`)}
//                       >
//                         View Details
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomerCategories;
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import { getCustomerCategories } from "../../../../api/Coustomer/Catagory/customerCategoryApi";// this is the real one to be done later when the application will be first be checked by the fo first befor appering to the coustomer's catagory page 
import { getCustomerCategories } from "../../../../api/Coustomer/BeforeFinanceORWillchange/customerGetCategoryAndSub";

import { Card, CardContent, Typography, Button } from "@mui/material";
import { FiShield, FiGrid, FiList, FiChevronDown } from "react-icons/fi";
import { IoStar } from "react-icons/io5";
import SearchBar from "../../../../reusable/UI/SearchBar";

const CustomerCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [openSort, setOpenSort] = useState(false);
  const navigate = useNavigate();
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCustomerCategories().then(setCategories);
  }, []);

  // Close sort menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setOpenSort(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter + sort logic
  const filteredCategories = categories
    .filter((cat) => cat.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price") return (a.price || 0) - (b.price || 0);
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-10 px-5">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Insurance Categories
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Choose from our comprehensive range of insurance products designed to
          protect what matters most to you.
        </p>
      </div>

      {/* Search + Sort + Toggle */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full md:flex-1 relative">
          <SearchBar
            placeholder="Search insurance category..."
            value={search}
            onChange={setSearch}
          />
        </div>

        {/* Sort + Toggle */}
        <div className="flex items-center gap-4">
          {/* Custom Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setOpenSort(!openSort)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-200 rounded-xl text-gray-700 font-medium text-sm shadow-sm hover:shadow-md transition-all focus:ring-2 focus:ring-amber-400"
            >
              Sort by{" "}
              <span className="capitalize text-amber-600">{sort}</span>
              <FiChevronDown
                className={`transition-transform duration-300 ${
                  openSort ? "rotate-180" : ""
                }`}
              />
            </button>

            {openSort && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-amber-100 rounded-xl shadow-lg overflow-hidden z-20 animate-fadeIn">
                {[
                  { key: "name", label: "Name" },
                  { key: "price", label: "Price" },
                  { key: "rating", label: "Rating" },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => {
                      setSort(option.key);
                      setOpenSort(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      sort === option.key
                        ? "bg-amber-100 text-amber-700 font-semibold"
                        : "text-gray-700 hover:bg-amber-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Animated Toggle */}
          <div className="relative flex items-center bg-white border border-amber-200 rounded-xl p-1 shadow-sm w-[90px]">
            <div
              className={`absolute top-1 bottom-1 w-[42px] bg-gradient-to-r from-amber-400 to-amber-300 rounded-lg shadow transition-all duration-300 ${
                viewMode === "grid" ? "left-1" : "left-[45px]"
              }`}
            />
            <button
              onClick={() => setViewMode("grid")}
              className={`z-10 flex-1 py-1 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                viewMode === "grid"
                  ? "text-white"
                  : "text-amber-500 hover:text-amber-600"
              }`}
            >
              <FiGrid className="text-lg" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`z-10 flex-1 py-1 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                viewMode === "list"
                  ? "text-white"
                  : "text-amber-500 hover:text-amber-600"
              }`}
            >
              <FiList className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      {viewMode === "grid" ? (
        // 🟢 Grid View
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((cat) => (
            <Card
              key={cat.id}
              className="rounded-2xl border border-amber-100 shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 bg-gradient-to-b from-amber-50 to-white"
            >
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <FiShield className="text-amber-600 text-2xl" />
                  </div>
                  <div className="flex items-center text-amber-500 font-medium text-sm">
                    <IoStar className="text-amber-500 mr-1" /> {cat.rating || "4.5"}
                  </div>
                </div>
                <div>
                  <Typography
                    variant="h6"
                    className="text-gray-900 font-bold mb-2"
                  >
                    {cat.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 mb-4 leading-snug"
                  >
                    {cat.description}
                  </Typography>
                </div>
                <div className="flex items-center justify-between mt-auto mb-4">
                  <span className="text-gray-500 text-sm">Starting from</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${cat.price || "800"}
                  </span>
                </div>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    background:
                      "linear-gradient(to right, #f59e0b, #fbbf24)",
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: "600",
                    "&:hover": {
                      background:
                        "linear-gradient(to right, #d97706, #f59e0b)",
                    },
                  }}
                  onClick={() => navigate(`/categories/${cat.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // 🟡 List View
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-white border border-amber-100 shadow-sm rounded-xl p-4 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <FiShield className="text-amber-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-lg">
                    {cat.name}
                  </h3>
                  <p className="text-gray-600 text-sm max-w-md">
                    {cat.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-gray-700 font-semibold">
                  ${cat.price || "800"}
                </span>
                <div className="flex items-center text-amber-500 text-sm">
                  <IoStar className="text-amber-500 mr-1" /> {cat.rating || "4.5"}
                </div>
                <Button
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(to right, #f59e0b, #fbbf24)",
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: "600",
                    "&:hover": {
                      background:
                        "linear-gradient(to right, #d97706, #f59e0b)",
                    },
                  }}
                  onClick={() => navigate(`/categories/${cat.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerCategories;
