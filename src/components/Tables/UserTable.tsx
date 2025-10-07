// // src/components/Tables/UserTable.tsx
// import React from "react";
// import { FiEdit2, FiTrash, FiUser } from "react-icons/fi";

// interface User {
//   id: string;
//   fullName: string;
//   email: string;
//   mobilePhone?: string;
//   imageUrl?: string;
//   userName?: string;
// }

// interface UserTableProps {
//   data: User[];
//   role: string;
//   onEdit?: (user: User) => void;
//   onDelete?: (id: string) => void;
// }

// const UserTable: React.FC<UserTableProps> = ({ data, role, onEdit, onDelete }) => {
//   return (
//     <div className="bg-gradient-to-b from-amber-50 to-yellow-50 rounded-2xl shadow-sm overflow-hidden">
//       <table className="min-w-full divide-y divide-amber-200">
//         <thead className="bg-gradient-to-r from-amber-100 to-yellow-100">
//           <tr>
//             <th className="py-4 px-6 text-left text-xs font-semibold text-amber-800 uppercase tracking-wider">
//               User
//             </th>
//             <th className="py-4 px-6 text-left text-xs font-semibold text-amber-800 uppercase tracking-wider">
//               Contact
//             </th>
//             <th className="py-4 px-6 text-left text-xs font-semibold text-amber-800 uppercase tracking-wider">
//               Role
//             </th>
//             <th className="py-4 px-6 text-center text-xs font-semibold text-amber-800 uppercase tracking-wider">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-amber-100">
//           {data.map((user, index) => (
//             <tr 
//               key={user.id} 
//               className={`hover:bg-amber-50 transition-colors ${
//                 index % 2 === 0 ? "bg-amber-50/30" : "bg-white"
//               }`}
//             >
//               <td className="py-4 px-6">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
//                     {user.imageUrl ? (
//                       <img
//                         className="h-10 w-10 rounded-full"
//                         src={user.imageUrl}
//                         alt={user.fullName}
//                       />
//                     ) : (
//                       <FiUser className="h-5 w-5 text-white" />
//                     )}
//                   </div>
//                   <div className="ml-4">
//                     <div className="text-sm font-medium text-amber-900">
//                       {user.fullName}
//                     </div>
//                     <div className="text-sm text-amber-600">
//                       {user.userName || "-"}
//                     </div>
//                   </div>
//                 </div>
//               </td>
//               <td className="py-4 px-6">
//                 <div className="text-sm text-amber-900">{user.email}</div>
//                 <div className="text-sm text-amber-600">
//                   {user.mobilePhone || "No phone"}
//                 </div>
//               </td>
//               <td className="py-4 px-6">
//                 <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
//                   {role}
//                 </span>
//               </td>
//               <td className="py-4 px-6">
//                 <div className="flex justify-center gap-2">
//                   <button
//                     className="p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors"
//                     onClick={() => onEdit && onEdit(user)}
//                     title="Edit user"
//                   >
//                     <FiEdit2 className="w-4 h-4" />
//                   </button>
//                   <button
//                     className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
//                     onClick={() => onDelete && onDelete(user.id)}
//                     title="Delete user"
//                   >
//                     <FiTrash className="w-4 h-4" />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default UserTable;
// src/components/Tables/UserTable.tsx
import React from "react";
import { FiEdit2, FiTrash, FiUser } from "react-icons/fi";
import ReusableTable from "./ReusableTable";

interface User {
  id: string;
  fullName: string;
  email: string;
  mobilePhone?: string;
  imageUrl?: string;
  userName?: string;
}

interface UserTableProps {
  data: User[];
  role: string;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ data, role, onEdit, onDelete }) => {
  const columns = [
    { label: "User", key: "fullName" },
    { label: "Contact", key: "email" },
    { label: "Role", key: "role" },
    { label: "Actions", key: "actions", align: "center" },
  ];

  return (
    <ReusableTable
      columns={columns}
      data={data}
      stickyLastColumn
      renderRow={(user, index) => (
        <tr
          key={user.id}
          className={`hover:bg-amber-50 transition-colors ${
            index % 2 === 0 ? "bg-amber-50/30" : "bg-white"
          }`}
        >
          {/* User Info */}
          <td className="py-4 px-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                {user.imageUrl ? (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.imageUrl}
                    alt={user.fullName}
                  />
                ) : (
                  <FiUser className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-amber-900">{user.fullName}</div>
                <div className="text-sm text-amber-600">{user.userName || "-"}</div>
              </div>
            </div>
          </td>

          {/* Contact Info */}
          <td className="py-4 px-6">
            <div className="text-sm text-amber-900">{user.email}</div>
            <div className="text-sm text-amber-600">
              {user.mobilePhone || "No phone"}
            </div>
          </td>

          {/* Role */}
          <td className="py-4 px-6">
            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              {role}
            </span>
          </td>

          {/* Actions */}
          <td className="py-4 px-6 text-center">
            <div className="flex justify-center gap-2">
              <button
                className="p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors"
                onClick={() => onEdit && onEdit(user)}
                title="Edit user"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                onClick={() => onDelete && onDelete(user.id)}
                title="Delete user"
              >
                <FiTrash className="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      )}
    />
  );
};

export default UserTable;
