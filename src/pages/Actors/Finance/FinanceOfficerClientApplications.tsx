// import React, { useEffect, useMemo, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { 
//   getApplications, 
//   updateApplicationStatus, 
//   type MotorApplication 
// } from "../../../api/Finance/FinanceClientSideApi";
// import { TableRow, TableCell } from "@mui/material";
// import ReusableTable from "../../../components/Tables/ReusableTable";
// import { Search, CheckCircle, XCircle, Calendar, User, Eye, AlertCircle, DollarSign, RefreshCw } from "lucide-react";

// type FilterStatus = "All" | "Pending" | "Approved" | "Rejected" | "Edited" | "AwaitingPayment";

// // View Modal Component
// const ViewModal: React.FC<{
//   application: MotorApplication | null;
//   onClose: () => void;
// }> = ({ application, onClose }) => {
//   if (!application) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div className="w-full max-w-2xl bg-white rounded-xl border border-amber-200 shadow-xl p-6 max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-bold text-amber-900">Application Details</h3>
//           <button onClick={onClose} className="px-3 py-1 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50">
//             Close
//           </button>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Client Information */}
//           <div className="space-y-4">
//             <h4 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2">
//               Client Information
//             </h4>
//             <div>
//               <label className="block text-sm font-medium text-amber-700 mb-1">Client ID</label>
//               <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.clientId}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-amber-700 mb-1">Customer Name</label>
//               <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.customerName}</p>
//             </div>
//           </div>

//           {/* Vehicle Information */}
//           <div className="space-y-4">
//             <h4 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2">
//               Vehicle Information
//             </h4>
//             <div>
//               <label className="block text-sm font-medium text-amber-700 mb-1">Model</label>
//               <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.model}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-amber-700 mb-1">Category</label>
//               <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.categoryName}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-amber-700 mb-1">Sub Category</label>
//               <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.subCategoryName}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-amber-700 mb-1">Year of Manufacture</label>
//               <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.yearOfManufacture}</p>
//             </div>
//           </div>

//           {/* Registration Details */}
//           <div className="space-y-4">
//             <h4 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2">
//               Registration Details
//             </h4>
//             <div>
//               <label className="block text-sm font-medium text-amber-700 mb-1">Registration Number</label>
//               <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.registrationNumber || 'N/A'}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-amber-700 mb-1">Engine Number</label>
//               <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.engineNumber || 'N/A'}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-amber-700 mb-1">Chassis Number</label>
//               <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.chassisNumber || 'N/A'}</p>
//             </div>
//           </div>

//           {/* Financial Information */}
//           <div className="space-y-4">
//             <h4 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2">
//               Financial Information
//             </h4>
//             <div>
//               <label className="block text-sm font-medium text-amber-700 mb-1">Market Price</label>
//               <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">${application.marketPrice.toLocaleString()}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-amber-700 mb-1">Calculated Premium</label>
//               <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">${application.calculatedPremium.toLocaleString()}</p>
//             </div>
//           </div>

//           {/* Application Details */}
//           <div className="space-y-4 md:col-span-2">
//             <h4 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2">
//               Application Details
//             </h4>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-amber-700 mb-1">Status</label>
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                   application.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                   application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
//                   application.status === 'AwaitingPayment' ? 'bg-blue-100 text-blue-800' :
//                   application.status === 'Edited' ? 'bg-purple-100 text-purple-800' :
//                   'bg-gray-100 text-gray-800'
//                 }`}>
//                   {application.status}
//                 </span>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-amber-700 mb-1">Created At</label>
//                 <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">
//                   {new Date(application.createdAt).toLocaleDateString()} {new Date(application.createdAt).toLocaleTimeString()}
//                 </p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-amber-700 mb-1">Application ID</label>
//                 <p className="text-amber-900 bg-amber-50 p-2 rounded-lg text-xs font-mono">{application.id}</p>
//               </div>
//             </div>
//             {application.message && (
//               <div>
//                 <label className="block text-sm font-medium text-amber-700 mb-1">Message</label>
//                 <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.message}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Approve Confirmation Modal
// const ApproveModal: React.FC<{
//   application: MotorApplication | null;
//   onClose: () => void;
//   onConfirm: () => void;
//   loading: boolean;
// }> = ({ application, onClose, onConfirm, loading }) => {
//   if (!application) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div className="w-full max-w-md bg-white rounded-xl border border-green-200 shadow-xl p-6">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="p-2 rounded-full bg-green-100 text-green-600">
//             <CheckCircle className="w-6 h-6" />
//           </div>
//           <h3 className="text-xl font-bold text-green-900">Approve Application</h3>
//         </div>
        
//         <div className="mb-6">
//           <p className="text-gray-700 mb-4">
//             Are you sure you want to approve this insurance application?
//           </p>
//           <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
//             <p className="text-sm font-medium text-green-800 mb-2">Application Details:</p>
//             <p className="text-sm text-green-700"><strong>Client:</strong> {application.customerName}</p>
//             <p className="text-sm text-green-700"><strong>Vehicle:</strong> {application.model} ({application.yearOfManufacture})</p>
//             <p className="text-sm text-green-700"><strong>Sub Category:</strong> {application.subCategoryName}</p>
//           </div>
          
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <p className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
//               <DollarSign className="w-4 h-4" />
//               Financial Details
//             </p>
//             <div className="grid grid-cols-2 gap-2">
//               <div>
//                 <p className="text-xs text-blue-600">Market Price</p>
//                 <p className="text-sm font-semibold text-blue-800">${application.marketPrice.toLocaleString()}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-blue-600">Calculated Premium</p>
//                 <p className="text-sm font-semibold text-blue-800">${application.calculatedPremium.toLocaleString()}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3">
//           <button 
//             onClick={onClose}
//             disabled={loading}
//             className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button 
//             onClick={onConfirm}
//             disabled={loading}
//             className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 Approving...
//               </>
//             ) : (
//               <>
//                 <CheckCircle className="w-4 h-4" />
//                 Approve Application
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reject Confirmation Modal
// const RejectModal: React.FC<{
//   application: MotorApplication | null;
//   onClose: () => void;
//   onConfirm: (reason: string) => void;
//   loading: boolean;
// }> = ({ application, onClose, onConfirm, loading }) => {
//   const [rejectionReason, setRejectionReason] = useState("");

//   if (!application) return null;

//   const handleSubmit = () => {
//     if (!rejectionReason.trim()) {
//       alert("Please provide a rejection reason");
//       return;
//     }
//     onConfirm(rejectionReason);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div className="w-full max-w-md bg-white rounded-xl border border-red-200 shadow-xl p-6">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="p-2 rounded-full bg-red-100 text-red-600">
//             <AlertCircle className="w-6 h-6" />
//           </div>
//           <h3 className="text-xl font-bold text-red-900">Reject Application</h3>
//         </div>
        
//         <div className="mb-6">
//           <p className="text-gray-700 mb-4">
//             Please provide a reason for rejecting this application. The customer will receive this message.
//           </p>
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
//             <p className="text-sm font-medium text-red-800 mb-2">Application Details:</p>
//             <p className="text-sm text-red-700"><strong>Client:</strong> {application.customerName}</p>
//             <p className="text-sm text-red-700"><strong>Vehicle:</strong> {application.model} ({application.yearOfManufacture})</p>
//             <p className="text-sm text-red-700"><strong>Sub Category:</strong> {application.subCategoryName}</p>
//             <div className="grid grid-cols-2 gap-2 mt-2">
//               <div>
//                 <p className="text-xs text-red-600">Market Price</p>
//                 <p className="text-sm font-semibold text-red-800">${application.marketPrice.toLocaleString()}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-red-600">Calculated Premium</p>
//                 <p className="text-sm font-semibold text-red-800">${application.calculatedPremium.toLocaleString()}</p>
//               </div>
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-red-700 mb-2">
//               Rejection Reason *
//             </label>
//             <textarea
//               value={rejectionReason}
//               onChange={(e) => setRejectionReason(e.target.value)}
//               placeholder="Explain why this application is being rejected..."
//               rows={4}
//               className="w-full border border-red-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
//               disabled={loading}
//             />
//           </div>
//         </div>

//         <div className="flex justify-end gap-3">
//           <button 
//             onClick={onClose}
//             disabled={loading}
//             className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button 
//             onClick={handleSubmit}
//             disabled={loading || !rejectionReason.trim()}
//             className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 Rejecting...
//               </>
//             ) : (
//               <>
//                 <XCircle className="w-4 h-4" />
//                 Reject Application
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const FinanceOfficerClientApplications: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const [allApplications, setAllApplications] = useState<MotorApplication[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState<FilterStatus>((searchParams.get("status") as FilterStatus) || "All");
//   const [dateFrom, setDateFrom] = useState<string>("");
//   const [dateTo, setDateTo] = useState<string>("");
//   const [viewing, setViewing] = useState<MotorApplication | null>(null);
//   const [approving, setApproving] = useState<MotorApplication | null>(null);
//   const [rejecting, setRejecting] = useState<MotorApplication | null>(null);
//   const [actionLoading, setActionLoading] = useState(false);

//   const fetchApplications = async () => {
//     setLoading(true);
//     try {
//       console.log('🔄 Starting to fetch applications...');
//       const data = await getApplications();
//       console.log('📥 Received applications:', data);
      
//       // Log status distribution
//       const statusCount = data.reduce((acc, app) => {
//         acc[app.status] = (acc[app.status] || 0) + 1;
//         return acc;
//       }, {} as Record<string, number>);
      
//       console.log('📊 Status distribution:', statusCount);
//       setAllApplications(data);
//     } catch (error) {
//       console.error('❌ Error fetching applications:', error);
//       alert("Error fetching applications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { 
//     fetchApplications(); 
//   }, []);

//   const filteredApplications = useMemo(() => {
//     const filtered = allApplications.filter(app => {
//       const matchesText = `${app.customerName} ${app.model} ${app.subCategoryName}`.toLowerCase().includes(search.toLowerCase());
//       const matchesStatus = status === "All" ? true : app.status === status;
//       const submittedDate = new Date(app.createdAt).getTime();
//       const fromOk = dateFrom ? submittedDate >= new Date(dateFrom).getTime() : true;
//       const toOk = dateTo ? submittedDate <= new Date(dateTo).getTime() : true;
//       return matchesText && matchesStatus && fromOk && toOk;
//     });
    
//     console.log(`🔍 Filtered applications: ${filtered.length} (Status: ${status}, Search: "${search}")`);
//     filtered.forEach((app, index) => {
//       console.log(`   ${index + 1}. ID: ${app.id}, Status: ${app.status}, Model: ${app.model}`);
//     });
//     return filtered;
//   }, [allApplications, search, status, dateFrom, dateTo]);

//   const handleApprove = async (application: MotorApplication) => {
//     if (!application?.id) {
//       console.error('❌ Cannot approve: Application ID is missing', application);
//       alert('Error: Application ID is missing');
//       return;
//     }

//     setActionLoading(true);
//     try {
//       console.log(`✅ Starting approve process for: ${application.id}`);
//       await updateApplicationStatus(application.id, "Approved");
//       console.log(`✅ Approve API call completed for: ${application.id}`);
      
//       // Give the backend a moment to process, then refresh
//       setTimeout(async () => {
//         console.log('🔄 Refreshing data after approve...');
//         await fetchApplications();
//         alert("✅ Application approved successfully! The status should now show as 'Approved'.");
//         setApproving(null);
//       }, 1500);
      
//     } catch (error: any) {
//       console.error('❌ Approve error:', error);
//       alert(`❌ Error approving application: ${error.response?.data?.message || error.message}`);
//       setActionLoading(false);
//     }
//   };

//   const handleReject = async (application: MotorApplication, reason: string) => {
//     if (!application?.id) {
//       console.error('❌ Cannot reject: Application ID is missing', application);
//       alert('Error: Application ID is missing');
//       return;
//     }

//     setActionLoading(true);
//     try {
//       console.log(`❌ Starting reject process for: ${application.id}`);
//       await updateApplicationStatus(application.id, "Rejected", reason);
//       console.log(`❌ Reject API call completed for: ${application.id}`);
      
//       // Give the backend a moment to process, then refresh
//       setTimeout(async () => {
//         console.log('🔄 Refreshing data after reject...');
//         await fetchApplications();
//         alert("✅ Application rejected successfully! The status should now show as 'Rejected'.");
//         setRejecting(null);
//       }, 1500);
      
//     } catch (error: any) {
//       console.error('❌ Reject error:', error);
//       alert(`❌ Error rejecting application: ${error.response?.data?.message || error.message}`);
//       setActionLoading(false);
//     }
//   };

//   const columns = [
//     { label: "Customer Name", key: "customerName" },
//     { label: "Model", key: "model" },
//     { label: "Sub Category", key: "subCategoryName" },
//     { label: "Year", key: "yearOfManufacture", align: "center" as const },
//     { label: "Market Price", key: "marketPrice", align: "right" as const },
//     { label: "Status", key: "status" },
//     { label: "Actions", key: "actions", align: "center" as const },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-yellow-50/50">
//       <div className="bg-white border-b border-amber-200 shadow-sm mb-6">
//         <div className="p-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">Motor Insurance Applications</h1>
//               <p className="text-amber-700 mt-1">Review customer-submitted motor insurance applications.</p>
//             </div>
//             <button 
//               onClick={fetchApplications}
//               disabled={loading}
//               className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
//             >
//               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//               Refresh
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="px-6 mb-6">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200 space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
//               <input 
//                 value={search} 
//                 onChange={e => setSearch(e.target.value)} 
//                 placeholder="Search by customer, model, or category..." 
//                 className="w-full border border-amber-200 rounded-lg pl-10 p-2 text-sm focus:ring-1 focus:ring-amber-500" 
//               />
//             </div>
//             <div>
//               <select 
//                 value={status} 
//                 onChange={e => setStatus(e.target.value as FilterStatus)} 
//                 className="w-full border border-amber-200 rounded-lg p-2 text-sm"
//               >
//                 {(["All", "Pending", "Approved", "Rejected", "Edited", "AwaitingPayment"] as FilterStatus[]).map(s => (
//                   <option key={s} value={s}>{s}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="relative">
//               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
//               <input 
//                 type="date" 
//                 value={dateFrom} 
//                 onChange={e => setDateFrom(e.target.value)} 
//                 className="w-full border border-amber-200 rounded-lg pl-10 p-2 text-sm" 
//               />
//             </div>
//             <div className="relative">
//               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
//               <input 
//                 type="date" 
//                 value={dateTo} 
//                 onChange={e => setDateTo(e.target.value)} 
//                 className="w-full border border-amber-200 rounded-lg pl-10 p-2 text-sm" 
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="px-6 pb-6">
//         <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
//           {loading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
//             </div>
//           ) : (
//             <>
//               <ReusableTable
//                 columns={columns}
//                 data={filteredApplications}
//                 renderRow={(row: MotorApplication) => (
//                   <TableRow key={row.id} className="hover:bg-amber-50">
//                     <TableCell className="py-3 px-4 font-medium text-amber-900">
//                       <div className="flex items-center gap-2">
//                         <User className="w-4 h-4" />
//                         {row.customerName}
//                       </div>
//                     </TableCell>
//                     <TableCell className="py-3 px-4 text-amber-800">
//                       {row.model}
//                     </TableCell>
//                     <TableCell className="py-3 px-4 text-amber-800">
//                       {row.subCategoryName}
//                     </TableCell>
//                     <TableCell className="py-3 px-4 text-amber-700" align="center">
//                       {row.yearOfManufacture}
//                     </TableCell>
//                     <TableCell className="py-3 px-4 text-amber-700" align="right">
//                       ${row.marketPrice.toLocaleString()}
//                     </TableCell>
//                     <TableCell className="py-3 px-4">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                         row.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                         row.status === 'Rejected' ? 'bg-red-100 text-red-800' :
//                         row.status === 'AwaitingPayment' ? 'bg-blue-100 text-blue-800' :
//                         row.status === 'Edited' ? 'bg-purple-100 text-purple-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {row.status}
//                       </span>
//                     </TableCell>
//                     <TableCell className="py-3 px-4 text-center">
//                       <div className="flex justify-center gap-2">
//                         <button 
//                           onClick={() => setViewing(row)} 
//                           className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700" 
//                           title="View Details"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         {row.status === 'Pending' && (
//                           <>
//                             <button 
//                               onClick={() => setApproving(row)} 
//                               className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700" 
//                               title="Approve"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                             </button>
//                             <button 
//                               onClick={() => setRejecting(row)} 
//                               className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600" 
//                               title="Reject"
//                             >
//                               <XCircle className="w-4 h-4" />
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               />
//               {filteredApplications.length === 0 && (
//                 <div className="text-center py-12">
//                   <div className="text-amber-400 text-6xl mb-4">📄</div>
//                   <h3 className="text-lg font-semibold text-amber-800 mb-2">No Applications</h3>
//                   <p className="text-amber-600">No motor insurance applications match your filters</p>
//                   <button 
//                     onClick={fetchApplications}
//                     className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
//                   >
//                     Refresh Data
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Modals */}
//       {viewing && (
//         <ViewModal
//           application={viewing}
//           onClose={() => setViewing(null)}
//         />
//       )}

//       {approving && (
//         <ApproveModal
//           application={approving}
//           onClose={() => setApproving(null)}
//           onConfirm={() => handleApprove(approving)}
//           loading={actionLoading}
//         />
//       )}

//       {rejecting && (
//         <RejectModal
//           application={rejecting}
//           onClose={() => setRejecting(null)}
//           onConfirm={(reason) => handleReject(rejecting, reason)}
//           loading={actionLoading}
//         />
//       )}
//     </div>
//   );
// };

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  getApplications, 
  updateApplicationStatus,
  type MotorApplication,
  type LifeApplication,
  type InsuranceApplication
} from "../../../api/Finance/FinanceClientSideApi";
import { TableRow, TableCell } from "@mui/material";
import ReusableTable from "../../../components/Tables/ReusableTable";
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  User, 
  Eye, 
  AlertCircle, 
  DollarSign, 
  RefreshCw,
  Car,
  Heart
} from "lucide-react";

// Helper component for info fields
const InfoField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <p className="text-gray-900 bg-gray-50 p-2 rounded-lg">{value}</p>
  </div>
);

type InsuranceType = "All" | "Motor" | "Life";
type FilterStatus = "All" | "Pending" | "Approved" | "Rejected" | "Edited" | "AwaitingPayment";

// View Modal Component
const ViewModal: React.FC<{
  application: InsuranceApplication | null;
  onClose: () => void;
}> = ({ application, onClose }) => {
  if (!application) return null;

  const isMotor = application.insuranceType === 'motor';
  const motorApp = isMotor ? application as MotorApplication : null;
  const lifeApp = !isMotor ? application as LifeApplication : null;

  const getSafeNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const getSafeString = (value: any): string => {
    return value?.toString() || 'N/A';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl border shadow-xl p-6 max-h-[90vh] overflow-y-auto" 
           style={{ borderColor: isMotor ? '#fbbf24' : '#f43f5e' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isMotor ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
              {isMotor ? <Car className="w-6 h-6" /> : <Heart className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {isMotor ? 'Motor' : 'Life'} Insurance Application
              </h3>
              <p className="text-sm text-gray-600">ID: {getSafeString(application.id)}</p>
            </div>
          </div>
          <button onClick={onClose} className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
            Close
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Client Information</h4>
            <InfoField label="Client ID" value={getSafeString(application.clientId)} />
            <InfoField label="Customer Name" value={getSafeString(application.customerName)} />
            {lifeApp && (
              <>
                <InfoField label="Age" value={`${getSafeNumber(lifeApp.age)} years`} />
                <InfoField label="Height" value={`${getSafeNumber(lifeApp.height)} cm`} />
                <InfoField label="Weight" value={`${getSafeNumber(lifeApp.weight)} kg`} />
                {lifeApp.clientFullName && <InfoField label="Full Name" value={getSafeString(lifeApp.clientFullName)} />}
                {lifeApp.clientEmail && <InfoField label="Email" value={getSafeString(lifeApp.clientEmail)} />}
                {lifeApp.clientPhoneNumber && <InfoField label="Phone" value={getSafeString(lifeApp.clientPhoneNumber)} />}
                {lifeApp.clientDateOfBirth && <InfoField label="Date of Birth" value={getSafeString(lifeApp.clientDateOfBirth)} />}
              </>
            )}
          </div>

          {/* Insurance Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
              {isMotor ? 'Vehicle' : 'Insurance'} Details
            </h4>
            <InfoField label="Category" value={getSafeString(application.categoryName)} />
            <InfoField label="Sub Category" value={getSafeString(application.subCategoryName)} />
            
            {isMotor && motorApp ? (
              <>
                <InfoField label="Model" value={getSafeString(motorApp.model)} />
                <InfoField label="Year" value={getSafeString(motorApp.yearOfManufacture)} />
                <InfoField label="Registration" value={getSafeString(motorApp.registrationNumber)} />
                <InfoField label="Engine Number" value={getSafeString(motorApp.engineNumber)} />
                <InfoField label="Chassis Number" value={getSafeString(motorApp.chassisNumber)} />
              </>
            ) : lifeApp ? (
              <>
                <InfoField label="Insurance Type" value={getSafeString(lifeApp.lifeInsuranceType)} />
                <InfoField label="Life Price" value={`$${getSafeNumber(lifeApp.lifePrice).toLocaleString()}`} />
              </>
            ) : null}
          </div>

          {/* Financial Information */}
          <div className="space-y-4 md:col-span-2">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Financial Information</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {isMotor && motorApp ? (
                <>
                  <InfoField label="Market Price" value={`$${getSafeNumber(motorApp.marketPrice).toLocaleString()}`} />
                  <InfoField label="Calculated Premium" value={`$${getSafeNumber(motorApp.calculatedPremium).toLocaleString()}`} />
                </>
              ) : lifeApp ? (
                <InfoField label="Life Price" value={`$${getSafeNumber(lifeApp.lifePrice).toLocaleString()}`} />
              ) : null}
              <InfoField label="Status" value={getSafeString(application.status)} />
              <InfoField label="Created At" value={application.createdAt ? new Date(application.createdAt).toLocaleString() : 'N/A'} />
            </div>
          </div>

          {/* Message */}
          {application.message && (
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Message</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{getSafeString(application.message)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Approve Confirmation Modal
const ApproveModal: React.FC<{
  application: InsuranceApplication | null;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}> = ({ application, onClose, onConfirm, loading }) => {
  if (!application) return null;

  const isMotor = application.insuranceType === 'motor';
  const motorApp = isMotor ? application as MotorApplication : null;
  const lifeApp = !isMotor ? application as LifeApplication : null;

  const getSafeNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const getSafeString = (value: any): string => {
    return value?.toString() || 'N/A';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-green-200 shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-green-100 text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-green-900">Approve Application</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to approve this {isMotor ? 'motor' : 'life'} insurance application?
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-green-800 mb-2">Application Details:</p>
            <p className="text-sm text-green-700">
              <strong>Client:</strong> {getSafeString(application.customerName || `Client ${application.clientId?.substring(0, 8)}`)}
            </p>
            <p className="text-sm text-green-700">
              <strong>{isMotor ? 'Vehicle:' : 'Insurance:'}</strong> {
                isMotor 
                  ? `${getSafeString(motorApp?.model)} (${getSafeString(motorApp?.yearOfManufacture)})` 
                  : `${getSafeString(lifeApp?.categoryName)} - ${getSafeString(lifeApp?.lifeInsuranceType)}`
              }
            </p>
            <p className="text-sm text-green-700">
              <strong>Sub Category:</strong> {getSafeString(application.subCategoryName)}
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Financial Details
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-blue-600">
                  {isMotor ? 'Market Price' : 'Life Price'}
                </p>
                <p className="text-sm font-semibold text-blue-800">
                  ${isMotor 
                    ? getSafeNumber(motorApp?.marketPrice).toLocaleString() 
                    : getSafeNumber(lifeApp?.lifePrice).toLocaleString()
                  }
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600">
                  {isMotor ? 'Calculated Premium' : 'Insurance Type'}
                </p>
                <p className="text-sm font-semibold text-blue-800">
                  {isMotor 
                    ? `$${getSafeNumber(motorApp?.calculatedPremium).toLocaleString()}`
                    : getSafeString(lifeApp?.lifeInsuranceType)
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Approve Application
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Reject Confirmation Modal
const RejectModal: React.FC<{
  application: InsuranceApplication | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading: boolean;
}> = ({ application, onClose, onConfirm, loading }) => {
  const [rejectionReason, setRejectionReason] = useState("");

  if (!application) return null;

  const isMotor = application.insuranceType === 'motor';
  const motorApp = isMotor ? application as MotorApplication : null;
  const lifeApp = !isMotor ? application as LifeApplication : null;

  const getSafeNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const getSafeString = (value: any): string => {
    return value?.toString() || 'N/A';
  };

  const handleSubmit = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    onConfirm(rejectionReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-red-200 shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-red-100 text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-red-900">Reject Application</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Please provide a reason for rejecting this {isMotor ? 'motor' : 'life'} insurance application. 
            The customer will receive this message.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-red-800 mb-2">Application Details:</p>
            <p className="text-sm text-red-700">
              <strong>Client:</strong> {getSafeString(application.customerName || `Client ${application.clientId?.substring(0, 8)}`)}
            </p>
            <p className="text-sm text-red-700">
              <strong>{isMotor ? 'Vehicle:' : 'Insurance:'}</strong> {
                isMotor 
                  ? `${getSafeString(motorApp?.model)} (${getSafeString(motorApp?.yearOfManufacture)})` 
                  : `${getSafeString(lifeApp?.categoryName)} - ${getSafeString(lifeApp?.lifeInsuranceType)}`
              }
            </p>
            <p className="text-sm text-red-700">
              <strong>Sub Category:</strong> {getSafeString(application.subCategoryName)}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-xs text-red-600">
                  {isMotor ? 'Market Price' : 'Life Price'}
                </p>
                <p className="text-sm font-semibold text-red-800">
                  ${isMotor 
                    ? getSafeNumber(motorApp?.marketPrice).toLocaleString() 
                    : getSafeNumber(lifeApp?.lifePrice).toLocaleString()
                  }
                </p>
              </div>
              <div>
                <p className="text-xs text-red-600">
                  {isMotor ? 'Calculated Premium' : 'Insurance Type'}
                </p>
                <p className="text-sm font-semibold text-red-800">
                  {isMotor 
                    ? `$${getSafeNumber(motorApp?.calculatedPremium).toLocaleString()}`
                    : getSafeString(lifeApp?.lifeInsuranceType)
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              Rejection Reason *
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why this application is being rejected..."
              rows={4}
              className="w-full border border-red-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading || !rejectionReason.trim()}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Rejecting...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Reject Application
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const FinanceOfficerClientApplications: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [allApplications, setAllApplications] = useState<InsuranceApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [insuranceType, setInsuranceType] = useState<InsuranceType>((searchParams.get("type") as InsuranceType) || "All");
  const [status, setStatus] = useState<FilterStatus>((searchParams.get("status") as FilterStatus) || "All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [viewing, setViewing] = useState<InsuranceApplication | null>(null);
  const [approving, setApproving] = useState<InsuranceApplication | null>(null);
  const [rejecting, setRejecting] = useState<InsuranceApplication | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const getSafeNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const getSafeString = (value: any): string => {
    return value?.toString() || 'N/A';
  };

  const detectInsuranceType = (app: any): 'motor' | 'life' => {
    // First check if insuranceType is explicitly set
    if (app.insuranceType === 'motor' || app.insuranceType === 'life') {
      return app.insuranceType;
    }
    
    // Check for life-specific properties
    if (app.lifePrice !== undefined || 
        app.age !== undefined || 
        app.height !== undefined || 
        app.weight !== undefined ||
        app.lifeInsuranceType !== undefined) {
      return 'life';
    }
    
    // Check for motor-specific properties
    if (app.model !== undefined || 
        app.calculatedPremium !== undefined || 
        app.marketPrice !== undefined ||
        app.yearOfManufacture !== undefined) {
      return 'motor';
    }
    
    // Default to motor based on your API structure
    console.warn('Could not determine insurance type, defaulting to motor:', app);
    return 'motor';
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      console.log('🔄 Starting to fetch applications...');
      const data = await getApplications();
      console.log('📥 Raw API data received:', data);
      
      if (!Array.isArray(data)) {
        console.error('❌ Expected array but got:', typeof data, data);
        setAllApplications([]);
        return;
      }
      
      // Process each application
      const processedData = data.map((app, index) => {
        try {
          console.log(`📄 Processing application ${index + 1}:`, app);
          
          // Detect insurance type
          const insuranceType = detectInsuranceType(app);
          console.log(`   Detected type: ${insuranceType}`);
          
          // Base application with safe values
          const baseApp: InsuranceApplication = {
            ...app,
            insuranceType,
            id: getSafeString(app.id || app.applicationId),
            clientId: getSafeString(app.clientId),
            customerName: getSafeString(app.customerName || app.clientFullName || `Client ${app.clientId?.substring(0, 8)}`),
            categoryName: getSafeString(app.categoryName),
            subCategoryName: getSafeString(app.subCategoryName),
            status: getSafeString(app.status),
            createdAt: getSafeString(app.createdAt),
            message: getSafeString(app.message),
          };
          
          // Add type-specific properties
          if (insuranceType === 'motor') {
            const motorApp: MotorApplication = {
              ...baseApp,
              model: getSafeString(app.model),
              yearOfManufacture: getSafeNumber(app.yearOfManufacture),
              marketPrice: getSafeNumber(app.marketPrice),
              calculatedPremium: getSafeNumber(app.calculatedPremium),
              registrationNumber: getSafeString(app.registrationNumber),
              engineNumber: getSafeString(app.engineNumber),
              chassisNumber: getSafeString(app.chassisNumber),
            };
            return motorApp;
          } else {
            const lifeApp: LifeApplication = {
              ...baseApp,
              age: getSafeNumber(app.age),
              height: getSafeNumber(app.height),
              weight: getSafeNumber(app.weight),
              lifePrice: getSafeNumber(app.lifePrice),
              lifeInsuranceType: getSafeString(app.lifeInsuranceType),
              clientFullName: getSafeString(app.clientFullName),
              clientEmail: getSafeString(app.clientEmail),
              clientPhoneNumber: getSafeString(app.clientPhoneNumber),
              clientGender: getSafeNumber(app.clientGender),
              clientDateOfBirth: getSafeString(app.clientDateOfBirth),
              clientNationalIdOrPassport: getSafeString(app.clientNationalIdOrPassport),
              clientPassportOrNationalIdImageUrl: getSafeString(app.clientPassportOrNationalIdImageUrl),
            };
            return lifeApp;
          }
        } catch (error) {
          console.error(`❌ Error processing application ${index + 1}:`, error, app);
          // Return a basic application to prevent crashes
          return {
            ...app,
            insuranceType: 'motor' as const,
            id: getSafeString(app.id || app.applicationId || `error-${index}`),
            clientId: 'ERROR',
            customerName: 'Error Processing Application',
            categoryName: 'ERROR',
            subCategoryName: 'ERROR',
            status: 'Error',
            createdAt: new Date().toISOString(),
            message: 'Error processing application data',
          } as InsuranceApplication;
        }
      });
      
      console.log('📥 Processed applications:', processedData.length);
      
      // Log detailed statistics
      const typeCount = processedData.reduce((acc, app) => {
        acc[app.insuranceType] = (acc[app.insuranceType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('🚗❤️ Type distribution:', typeCount);
      
      const statusCount = processedData.reduce((acc, app) => {
        const status = getSafeString(app.status);
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('📊 Status distribution:', statusCount);
      
      // Log sample of each type
      const motorSamples = processedData.filter(app => app.insuranceType === 'motor').slice(0, 2);
      const lifeSamples = processedData.filter(app => app.insuranceType === 'life').slice(0, 2);
      
      console.log('🚗 Sample motor applications:', motorSamples);
      console.log('❤️ Sample life applications:', lifeSamples);
      
      setAllApplications(processedData);
    } catch (error) {
      console.error('❌ Error fetching applications:', error);
      alert(`Error fetching applications: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setAllApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchApplications(); 
  }, []);

  const filteredApplications = useMemo(() => {
    const filtered = allApplications.filter(app => {
      // Common search fields with safe values
      const customerName = getSafeString(app.customerName);
      const modelOrCategory = app.insuranceType === 'motor' 
        ? getSafeString((app as MotorApplication).model)
        : getSafeString((app as LifeApplication).categoryName);
      const subCategory = getSafeString(app.subCategoryName);
      
      const searchText = `${customerName} ${modelOrCategory} ${subCategory}`.toLowerCase();
      
      const matchesText = searchText.includes(search.toLowerCase());
      const matchesType = insuranceType === "All" || 
        (insuranceType === "Motor" && app.insuranceType === 'motor') ||
        (insuranceType === "Life" && app.insuranceType === 'life');
      const matchesStatus = status === "All" ? true : getSafeString(app.status) === status;
      
      // Date filtering
      let dateOk = true;
      if (app.createdAt) {
        try {
          const submittedDate = new Date(app.createdAt).getTime();
          const fromOk = dateFrom ? submittedDate >= new Date(dateFrom).getTime() : true;
          const toOk = dateTo ? submittedDate <= new Date(dateTo).getTime() : true;
          dateOk = fromOk && toOk;
        } catch (e) {
          console.warn('Invalid date format:', app.createdAt);
        }
      }
      
      return matchesText && matchesType && matchesStatus && dateOk;
    });
    
    console.log(`🔍 Filtered applications: ${filtered.length} (Type: ${insuranceType}, Status: ${status})`);
    return filtered;
  }, [allApplications, search, insuranceType, status, dateFrom, dateTo]);

  const handleApprove = async (application: InsuranceApplication) => {
    if (!application?.id) {
      console.error('❌ Cannot approve: Application ID is missing', application);
      alert('Error: Application ID is missing');
      return;
    }

    setActionLoading(true);
    try {
      console.log(`✅ Starting approve process for ${application.insuranceType} application: ${application.id}`);
      await updateApplicationStatus(application.id, application.insuranceType, "Approved");
      
      setTimeout(async () => {
        console.log('🔄 Refreshing data after approve...');
        await fetchApplications();
        alert(`✅ ${application.insuranceType === 'motor' ? 'Motor' : 'Life'} insurance application approved successfully!`);
        setApproving(null);
      }, 1500);
      
    } catch (error: any) {
      console.error('❌ Approve error:', error);
      alert(`❌ Error approving application: ${error.response?.data?.message || error.message}`);
      setActionLoading(false);
    }
  };

  const handleReject = async (application: InsuranceApplication, reason: string) => {
    if (!application?.id) {
      console.error('❌ Cannot reject: Application ID is missing', application);
      alert('Error: Application ID is missing');
      return;
    }

    setActionLoading(true);
    try {
      console.log(`❌ Starting reject process for ${application.insuranceType} application: ${application.id}`);
      await updateApplicationStatus(application.id, application.insuranceType, "Rejected", reason);
      
      setTimeout(async () => {
        console.log('🔄 Refreshing data after reject...');
        await fetchApplications();
        alert(`✅ ${application.insuranceType === 'motor' ? 'Motor' : 'Life'} insurance application rejected successfully!`);
        setRejecting(null);
      }, 1500);
      
    } catch (error: any) {
      console.error('❌ Reject error:', error);
      alert(`❌ Error rejecting application: ${error.response?.data?.message || error.message}`);
      setActionLoading(false);
    }
  };

  const columns = [
    { label: "Type", key: "insuranceType" },
    { label: "Customer Name", key: "customerName" },
    { 
      label: "Details", 
      key: "details",
      getValue: (row: InsuranceApplication) => {
        if (row.insuranceType === 'motor') {
          const motor = row as MotorApplication;
          return `${getSafeString(motor.model)} (${getSafeString(motor.yearOfManufacture)})`;
        } else {
          const life = row as LifeApplication;
          return `${getSafeString(life.categoryName)} - ${getSafeString(life.lifeInsuranceType)}`;
        }
      }
    },
    { 
      label: "Sub Category", 
      key: "subCategoryName",
      getValue: (row: InsuranceApplication) => getSafeString(row.subCategoryName)
    },
    { 
      label: "Amount", 
      key: "amount",
      align: "right" as const,
      getValue: (row: InsuranceApplication) => {
        if (row.insuranceType === 'motor') {
          const motor = row as MotorApplication;
          return `$${getSafeNumber(motor.calculatedPremium).toLocaleString()}`;
        } else {
          const life = row as LifeApplication;
          return `$${getSafeNumber(life.lifePrice).toLocaleString()}`;
        }
      }
    },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions", align: "center" as const },
  ];

  const renderRow = (row: InsuranceApplication) => {
    const isMotor = row.insuranceType === 'motor';
    const motorApp = isMotor ? row as MotorApplication : null;
    const lifeApp = !isMotor ? row as LifeApplication : null;
    
    return (
      <TableRow key={row.id} className={`hover:bg-${isMotor ? 'amber' : 'rose'}-50`}>
        {/* Type Column */}
        <TableCell className="py-3 px-4">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isMotor 
              ? 'bg-amber-100 text-amber-800' 
              : 'bg-rose-100 text-rose-800'
          }`}>
            {isMotor ? (
              <>
                <Car className="w-3 h-3" />
                Motor
              </>
            ) : (
              <>
                <Heart className="w-3 h-3" />
                Life
              </>
            )}
          </div>
        </TableCell>
        
        {/* Customer Name */}
        <TableCell className="py-3 px-4 font-medium">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            {getSafeString(row.customerName)}
          </div>
        </TableCell>
        
        {/* Details */}
        <TableCell className="py-3 px-4">
          {isMotor ? (
            <>
              <p className="font-medium">{getSafeString(motorApp?.model)}</p>
              <p className="text-xs text-gray-500">Year: {getSafeString(motorApp?.yearOfManufacture)}</p>
            </>
          ) : (
            <>
              <p className="font-medium">{getSafeString(lifeApp?.categoryName)}</p>
              <p className="text-xs text-gray-500">
                {getSafeString(lifeApp?.lifeInsuranceType) === 'FullLife' ? 'Full Life' : 
                 getSafeString(lifeApp?.lifeInsuranceType) === 'HalfLife' ? 'Half Life' : 
                 getSafeString(lifeApp?.lifeInsuranceType)}
              </p>
            </>
          )}
        </TableCell>
        
        {/* Sub Category */}
        <TableCell className="py-3 px-4">
          <span className="text-sm text-gray-700">{getSafeString(row.subCategoryName)}</span>
        </TableCell>
        
        {/* Amount */}
        <TableCell className="py-3 px-4" align="right">
          <div className="flex flex-col items-end">
            <span className="font-semibold text-gray-900">
              {isMotor 
                ? `$${getSafeNumber(motorApp?.calculatedPremium).toLocaleString()}`
                : `$${getSafeNumber(lifeApp?.lifePrice).toLocaleString()}`
              }
            </span>
            <span className="text-xs text-gray-500">
              {isMotor ? 'Premium' : 'Life Price'}
            </span>
          </div>
        </TableCell>
        
        {/* Status */}
        <TableCell className="py-3 px-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            getSafeString(row.status) === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            getSafeString(row.status) === 'Approved' ? 'bg-green-100 text-green-800' :
            getSafeString(row.status) === 'Rejected' ? 'bg-red-100 text-red-800' :
            getSafeString(row.status) === 'AwaitingPayment' ? 'bg-blue-100 text-blue-800' :
            getSafeString(row.status) === 'Edited' ? 'bg-purple-100 text-purple-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {getSafeString(row.status)}
          </span>
        </TableCell>
        
        {/* Actions */}
        <TableCell className="py-3 px-4 text-center">
          <div className="flex justify-center gap-2">
            <button 
              onClick={() => setViewing(row)} 
              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700" 
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            {getSafeString(row.status) === 'Pending' && (
              <>
                <button 
                  onClick={() => setApproving(row)} 
                  className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700" 
                  title="Approve"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setRejecting(row)} 
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600" 
                  title="Reject"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-gray-100/50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm mb-6" 
           style={{ borderColor: '#fbbf24', background: 'linear-gradient(to right, #fef3c7, #fff7ed)' }}>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Insurance Applications Dashboard</h1>
              <p className="text-gray-700 mt-1">Review customer-submitted insurance applications</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={fetchApplications}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button 
                onClick={() => {
                  console.log('📊 Current data state:', {
                    total: allApplications.length,
                    motor: allApplications.filter(app => app.insuranceType === 'motor').length,
                    life: allApplications.filter(app => app.insuranceType === 'life').length,
                    samples: {
                      motor: allApplications.filter(app => app.insuranceType === 'motor').slice(0, 2),
                      life: allApplications.filter(app => app.insuranceType === 'life').slice(0, 2),
                    }
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Debug Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Stats */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search applications..." 
                className="w-full border border-gray-300 rounded-lg pl-10 p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500" 
              />
            </div>
            <div>
              <select 
                value={insuranceType} 
                onChange={e => setInsuranceType(e.target.value as InsuranceType)} 
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="All">All Types</option>
                <option value="Motor">Motor Insurance</option>
                <option value="Life">Life Insurance</option>
              </select>
            </div>
            <div>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value as FilterStatus)} 
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="AwaitingPayment">Awaiting Payment</option>
                <option value="Edited">Edited</option>
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="date" 
                value={dateFrom} 
                onChange={e => setDateFrom(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg pl-10 p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500" 
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="date" 
                value={dateTo} 
                onChange={e => setDateTo(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg pl-10 p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500" 
              />
            </div>
          </div>
          
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-600 font-medium">Total Applications</p>
              <p className="text-2xl font-bold text-blue-800">{allApplications.length}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-600 font-medium">Motor Applications</p>
              <p className="text-2xl font-bold text-amber-800">
                {allApplications.filter(app => app.insuranceType === 'motor').length}
              </p>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
              <p className="text-xs text-rose-600 font-medium">Life Applications</p>
              <p className="text-2xl font-bold text-rose-800">
                {allApplications.filter(app => app.insuranceType === 'life').length}
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-600 font-medium">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-800">
                {allApplications.filter(app => getSafeString(app.status) === 'Pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <>
              <ReusableTable
                columns={columns}
                data={filteredApplications}
                renderRow={renderRow}
              />
              
              {/* Empty State */}
              {filteredApplications.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {loading ? 'Loading Applications...' : 'No Applications Found'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {search || insuranceType !== 'All' || status !== 'All' 
                      ? 'No applications match your current filters' 
                      : 'No insurance applications have been submitted yet'}
                  </p>
                  {(search || insuranceType !== 'All' || status !== 'All') && (
                    <button 
                      onClick={() => {
                        setSearch('');
                        setInsuranceType('All');
                        setStatus('All');
                        setDateFrom('');
                        setDateTo('');
                      }}
                      className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {viewing && (
        <ViewModal
          application={viewing}
          onClose={() => setViewing(null)}
        />
      )}

      {approving && (
        <ApproveModal
          application={approving}
          onClose={() => setApproving(null)}
          onConfirm={() => handleApprove(approving)}
          loading={actionLoading}
        />
      )}

      {rejecting && (
        <RejectModal
          application={rejecting}
          onClose={() => setRejecting(null)}
          onConfirm={(reason) => handleReject(rejecting, reason)}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default FinanceOfficerClientApplications;
