// import React, { useEffect, useMemo, useState } from "react";
// import { getPaidApplications, type Policy } from "../../../../api/Coustomer/Policy/policiesApi";
// import {
//   ShieldCheck,
//   ShieldAlert,
//   Search,
//   CalendarDays,
//   DollarSign,
//   CheckCircle,
//   FileText,
//   X,
//   Building,
//   UserCheck,
//   ExternalLink,
//   Download,
//   Loader2,
//   Eye
// } from "lucide-react";

// const PaidApplications: React.FC = () => {
//   const [applications, setApplications] = useState<Policy[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedApplication, setSelectedApplication] = useState<Policy | null>(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [viewMode, setViewMode] = useState<'preview' | 'full'>('preview');

//   const loadApplications = async (showLoading = true) => {
//     if (showLoading) setLoading(true);
//     setError(null);
    
//     try {
//       const data = await getPaidApplications();
//       setApplications(data);
      
//       // If no data returned (empty array), show a friendly message
//       if (data.length === 0) {
//         setError(
//           searchTerm 
//             ? "No matching applications found. Try different search terms."
//             : "No paid applications found. Once you make a payment for an application, it will appear here."
//         );
//       }
//     } catch (err: any) {
//       setError(
//         err.response?.status === 404 
//           ? "No paid applications found. All paid applications will appear here once available."
//           : "Failed to load applications. Please try again later."
//       );
//       console.error("Error loading applications:", err);
//     } finally {
//       if (showLoading) setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     loadApplications();
//   }, []);

//   const filteredApplications = useMemo(() => {
//     const q = (searchTerm || "").toLowerCase();
//     return applications.filter((app) => {
//       const name = app.name ?? "";
//       const policyNumber = app.policyNumber ?? "";
//       const description = app.description ?? "";
//       return (
//         name.toLowerCase().includes(q) ||
//         policyNumber.toLowerCase().includes(q) ||
//         description.toLowerCase().includes(q)
//       );
//     });
//   }, [applications, searchTerm]);

//   const stats = useMemo(() => {
//     const total = applications.length;
//     const totalValue = applications.reduce((sum, app) => sum + (app.premium || 0), 0);
//     const active = applications.filter(app => 
//       app.status === "Active" || app.status === "Approved"
//     ).length;
//     const pendingRenewal = applications.filter(app => 
//       app.status === "Pending Renewal" || app.status === "Pending"
//     ).length;
    
//     return { total, totalValue, active, pendingRenewal };
//   }, [applications]);

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return "-";
//     const d = new Date(dateString);
//     if (isNaN(d.getTime())) return "-";
//     return d.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     loadApplications(false);
//   };

//   // Helper component for displaying detail items
//   const DetailItem = ({ label, value }: { label: string; value: string }) => (
//     <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
//       <span className="text-sm font-medium text-gray-600">{label}</span>
//       <span className="text-sm font-semibold text-gray-900">{value}</span>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4" />
//           <p className="text-amber-700 font-medium">Loading your paid applications...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-8 px-4 md:px-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
//               Paid Applications
//             </h1>
//             <p className="text-amber-700">
//               View and manage all your paid insurance applications
//             </p>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button
//               onClick={handleRefresh}
//               disabled={refreshing}
//               className="flex items-center gap-2 px-4 py-2.5 bg-white border border-amber-200 text-amber-700 rounded-xl hover:bg-amber-50 disabled:opacity-50 transition-colors"
//             >
//               {refreshing ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 <FileText className="w-4 h-4" />
//               )}
//               <span className="font-semibold">Refresh</span>
//             </button>
            
//             <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2.5 rounded-xl">
//               <CheckCircle className="w-5 h-5" />
//               <span className="font-semibold">{stats.total} Paid</span>
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
//             <div className="flex items-start gap-3">
//               <ShieldAlert className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-red-800 font-medium mb-1">Unable to load applications</p>
//                 <p className="text-red-600 text-sm">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
//             <div className="flex items-center gap-4">
//               <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
//                 <FileText className="w-6 h-6" />
//               </div>
//               <div>
//                 <p className="text-sm text-emerald-600 font-medium">Total Applications</p>
//                 <p className="text-2xl font-bold text-emerald-900">{stats.total}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm">
//             <div className="flex items-center gap-4">
//               <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl">
//                 <DollarSign className="w-6 h-6" />
//               </div>
//               <div>
//                 <p className="text-sm text-amber-600 font-medium">Total Premium</p>
//                 <p className="text-2xl font-bold text-amber-900">
//                   ${stats.totalValue.toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
//             <div className="flex items-center gap-4">
//               <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
//                 <ShieldCheck className="w-6 h-6" />
//               </div>
//               <div>
//                 <p className="text-sm text-blue-600 font-medium">Active Policies</p>
//                 <p className="text-2xl font-bold text-blue-900">{stats.active}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm">
//             <div className="flex items-center gap-4">
//               <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl">
//                 <CalendarDays className="w-6 h-6" />
//               </div>
//               <div>
//                 <p className="text-sm text-purple-600 font-medium">Pending Renewal</p>
//                 <p className="text-2xl font-bold text-purple-900">{stats.pendingRenewal}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filter */}
//         <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm">
//           <div className="flex flex-col md:flex-row gap-4 md:items-center">
//             <div className="flex-1 relative">
//               <Search className="w-5 h-5 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type="text"
//                 placeholder="Search applications by name, policy number, or description..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full border border-amber-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-amber-300 focus:border-transparent"
//               />
//             </div>
            
//             <div className="flex gap-2">
//               <button className="px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-colors">
//                 Sort by: Recent
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Applications Grid */}
//         {filteredApplications.length === 0 ? (
//           <div className="bg-white border border-dashed border-amber-200 rounded-2xl p-12 text-center">
//             <div className="max-w-md mx-auto">
//               <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
//                 <FileText className="w-8 h-8 text-amber-500" />
//               </div>
//               <h3 className="text-xl font-bold text-amber-900 mb-2">
//                 {searchTerm ? "No matching applications" : "No paid applications yet"}
//               </h3>
//               <p className="text-amber-600 mb-6">
//                 {searchTerm 
//                   ? "Try adjusting your search terms"
//                   : "Once you make a payment for your insurance applications, they will appear here."
//                 }
//               </p>
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   className="px-4 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
//                 >
//                   Clear Search
//                 </button>
//               )}
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//               {filteredApplications.map((app) => (
//                 <div
//                   key={app.id}
//                   className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 space-y-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         <div className={`p-1.5 rounded-lg ${
//                           app.status === "Active" ? "bg-emerald-100 text-emerald-600" :
//                           app.status === "Pending Renewal" ? "bg-amber-100 text-amber-600" :
//                           "bg-gray-100 text-gray-600"
//                         }`}>
//                           <ShieldCheck className="w-4 h-4" />
//                         </div>
//                         <span className={`text-xs font-semibold px-2 py-1 rounded ${
//                           app.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700" :
//                           "bg-amber-50 text-amber-700"
//                         }`}>
//                           {String(app.paymentStatus ?? "Unknown").toUpperCase()}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="text-xs text-amber-600 font-semibold tracking-wide">
//                           {app.policyNumber}
//                         </p>
//                         <h3 className="text-lg font-bold text-amber-900 mt-1 line-clamp-2">
//                           {app.name}
//                         </h3>
//                         <p className="text-sm text-amber-700 mt-2 line-clamp-2">
//                           {app.description}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-3 pt-3 border-t border-amber-100">
//                     <div className="flex items-center justify-between text-sm">
//                       <div className="flex items-center gap-2 text-amber-800">
//                         <CalendarDays className="w-4 h-4" />
//                         <span>Effective: {formatDate(app.effectiveDate)}</span>
//                       </div>
//                       <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                         app.status === "Active" ? "bg-emerald-100 text-emerald-700" :
//                         app.status === "Pending Renewal" ? "bg-amber-100 text-amber-700" :
//                         "bg-gray-100 text-gray-700"
//                       }`}>
//                         {app.status}
//                       </span>
//                     </div>
                    
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2 text-amber-800">
//                         <DollarSign className="w-4 h-4" />
//                         <span className="font-semibold">${Number(app.premium ?? 0).toLocaleString()}</span>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => {
//                             setSelectedApplication(app);
//                             setViewMode('preview');
//                           }}
//                           className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1"
//                         >
//                           <ExternalLink className="w-3 h-3" />
//                           Preview
//                         </button>
//                         <button
//                           onClick={() => {
//                             setSelectedApplication(app);
//                             setViewMode('full');
//                           }}
//                           className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1"
//                           title="View all details"
//                         >
//                           <Eye className="w-3 h-3" />
//                           Full View
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {/* Results Count */}
//             <div className="text-center text-amber-600 text-sm">
//               Showing {filteredApplications.length} of {applications.length} application{applications.length !== 1 ? 's' : ''}
//               {searchTerm && ` matching "${searchTerm}"`}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Application Details Modal */}
//       {selectedApplication && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8">
//           <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-white border-b border-amber-100 p-6">
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex items-start gap-4">
//                   <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl">
//                     <ShieldCheck className="w-6 h-6" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-amber-600 font-semibold">
//                       {selectedApplication.policyNumber}
//                     </p>
//                     <h2 className="text-2xl font-bold text-amber-900 mt-1">
//                       {selectedApplication.name}
//                     </h2>
//                     <div className="flex gap-2 mt-2">
//                       <span className="text-xs px-2 py-1 rounded-full font-semibold bg-amber-100 text-amber-700">
//                         {viewMode === 'full' ? 'Full Details View' : 'Preview Mode'}
//                       </span>
//                       <span className="text-xs px-2 py-1 rounded-full font-semibold bg-emerald-100 text-emerald-700">
//                         {selectedApplication.rawApplication ? 'API Data Available' : 'Basic View'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setSelectedApplication(null);
//                     setViewMode('preview');
//                   }}
//                   className="p-2 rounded-full hover:bg-amber-50 text-amber-700 flex-shrink-0"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
              
//               {/* View Mode Toggle */}
//               <div className="flex gap-2 mt-4">
//                 <button
//                   onClick={() => setViewMode('preview')}
//                   className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
//                     viewMode === 'preview' 
//                       ? 'bg-amber-500 text-white' 
//                       : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
//                   }`}
//                 >
//                   <ExternalLink className="w-4 h-4 inline mr-2" />
//                   Preview
//                 </button>
//                 <button
//                   onClick={() => setViewMode('full')}
//                   className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
//                     viewMode === 'full' 
//                       ? 'bg-blue-500 text-white' 
//                       : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
//                   }`}
//                 >
//                   <Eye className="w-4 h-4 inline mr-2" />
//                   Full Details
//                 </button>
//               </div>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 space-y-6">
//               {viewMode === 'preview' ? (
//                 // PREVIEW MODE (existing content)
//                 <>
//                   {/* Status Summary */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
//                       <div className="flex items-center gap-3">
//                         <CheckCircle className="w-5 h-5 text-emerald-600" />
//                         <div>
//                           <p className="text-sm text-emerald-600 font-semibold">Payment Status</p>
//                           <p className="text-lg font-bold text-emerald-900">
//                             {selectedApplication.paymentStatus}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className={`border rounded-xl p-4 ${
//                       selectedApplication.status === "Active" 
//                         ? "bg-emerald-50 border-emerald-100" 
//                         : "bg-amber-50 border-amber-100"
//                     }`}>
//                       <div className="flex items-center gap-3">
//                         <Building className="w-5 h-5 text-amber-600" />
//                         <div>
//                           <p className="text-sm text-amber-600 font-semibold">Policy Status</p>
//                           <p className={`text-lg font-bold ${
//                             selectedApplication.status === "Active" 
//                               ? "text-emerald-900" 
//                               : "text-amber-900"
//                           }`}>
//                             {selectedApplication.status}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Details Grid */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Left Column */}
//                     <div className="space-y-6">
//                       <div>
//                         <h3 className="text-sm font-semibold text-amber-600 uppercase mb-4">
//                           Policy Details
//                         </h3>
//                         <div className="space-y-4">
//                           <div>
//                             <p className="text-xs text-amber-500 mb-1">Policy Number</p>
//                             <p className="text-amber-900 font-medium">{selectedApplication.policyNumber}</p>
//                           </div>
//                           <div>
//                             <p className="text-xs text-amber-500 mb-1">Description</p>
//                             <p className="text-amber-900">{selectedApplication.description}</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <h3 className="text-sm font-semibold text-amber-600 uppercase mb-4">
//                           Coverage
//                         </h3>
//                         <div className="space-y-2">
//                           {Array.isArray(selectedApplication.coverage) && selectedApplication.coverage.length > 0 ? (
//                             selectedApplication.coverage.map((item, index) => (
//                               <div key={index} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
//                                 <div className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
//                                 <span className="text-amber-900">{item}</span>
//                               </div>
//                             ))
//                           ) : (
//                             <span className="text-amber-700">-</span>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Right Column */}
//                     <div className="space-y-6">
//                       <div>
//                         <h3 className="text-sm font-semibold text-amber-600 uppercase mb-4">
//                           Dates & Financials
//                         </h3>
//                         <div className="space-y-4">
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <p className="text-xs text-amber-500 mb-1">Effective Date</p>
//                               <p className="text-amber-900 font-medium">
//                                 {formatDate(selectedApplication.effectiveDate)}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-xs text-amber-500 mb-1">Renewal Date</p>
//                               <p className="text-amber-900 font-medium">
//                                 {formatDate(selectedApplication.renewalDate)}
//                               </p>
//                             </div>
//                           </div>
                          
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <p className="text-xs text-amber-500 mb-1">Next Payment</p>
//                               <p className="text-amber-900 font-medium">
//                                 {formatDate(selectedApplication.nextPaymentDate)}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-xs text-amber-500 mb-1">Annual Premium</p>
//                               <p className="text-2xl font-bold text-amber-900">
//                                 ${Number(selectedApplication.premium ?? 0).toLocaleString()}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {selectedApplication.benefits && selectedApplication.benefits.length > 0 && (
//                         <div>
//                           <h3 className="text-sm font-semibold text-amber-600 uppercase mb-4">
//                             Additional Benefits
//                           </h3>
//                           <div className="flex flex-wrap gap-2">
//                             {selectedApplication.benefits.map((benefit, index) => (
//                               <span
//                                 key={index}
//                                 className="px-3 py-1.5 bg-amber-50 text-amber-800 rounded-full text-sm font-medium border border-amber-200"
//                               >
//                                 {benefit}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 // FULL DETAILS MODE (shows all API data)
//                 <>
//                   {selectedApplication.rawApplication ? (
//                     <div className="space-y-6">
//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         {/* Vehicle Information */}
//                         <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
//                           <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
//                             <Building className="w-5 h-5" />
//                             Vehicle Information
//                           </h3>
//                           <div className="space-y-3">
//                             <DetailItem label="Model" value={selectedApplication.rawApplication.model} />
//                             <DetailItem label="Plate Number" value={selectedApplication.rawApplication.plateNumber} />
//                             <DetailItem label="Year" value={selectedApplication.rawApplication.yearOfManufacture.toString()} />
//                             <DetailItem label="Engine Number" value={selectedApplication.rawApplication.engineNumber} />
//                             <DetailItem label="Chassis Number" value={selectedApplication.rawApplication.chassisNumber} />
//                             <DetailItem label="Market Price" value={`$${selectedApplication.rawApplication.marketPrice.toLocaleString()}`} />
//                             <DetailItem label="Insurance Type" value={selectedApplication.rawApplication.insuranceType} />
//                           </div>
//                         </div>

//                         {/* Application Details */}
//                         <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
//                           <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
//                             <FileText className="w-5 h-5" />
//                             Application Details
//                           </h3>
//                           <div className="space-y-3">
//                             <DetailItem label="Application ID" value={selectedApplication.rawApplication.applicationId} />
//                             <DetailItem label="Status" value={selectedApplication.rawApplication.status} />
//                             <DetailItem label="Category" value={selectedApplication.rawApplication.categoryName} />
//                             <DetailItem label="Sub Category" value={selectedApplication.rawApplication.subCategoryName} />
//                             <DetailItem label="Calculated Premium" value={`$${selectedApplication.rawApplication.calculatedPremium.toLocaleString()}`} />
//                             <DetailItem label="Created Date" value={formatDate(selectedApplication.rawApplication.createdAt)} />
//                             <DetailItem label="Message" value={selectedApplication.rawApplication.message || "No message"} />
//                           </div>
//                         </div>
//                       </div>

//                       {/* Client Information */}
//                       <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
//                         <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
//                           <UserCheck className="w-5 h-5" />
//                           Client Information
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div className="space-y-3">
//                             <DetailItem label="Full Name" value={selectedApplication.rawApplication.clientFullName} />
//                             <DetailItem label="Email" value={selectedApplication.rawApplication.clientEmail} />
//                             <DetailItem label="Phone Number" value={selectedApplication.rawApplication.clientPhoneNumber} />
//                             <DetailItem label="Gender" value={selectedApplication.rawApplication.clientGender} />
//                           </div>
//                           <div className="space-y-3">
//                             <DetailItem label="Date of Birth" value={formatDate(selectedApplication.rawApplication.clientDateOfBirth)} />
//                             <DetailItem label="National ID/Passport" value={selectedApplication.rawApplication.clientNationalIdOrPassport} />
//                           </div>
//                         </div>
//                       </div>

//                       {/* Images Section */}
//                       <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
//                         <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
//                           <Download className="w-5 h-5" />
//                           Documents & Images
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           {selectedApplication.rawApplication.clientPassportOrNationalIdImageUrl && (
//                             <div className="text-center">
//                               <p className="text-sm font-medium text-amber-700 mb-2">ID/Passport Image</p>
//                               <div className="bg-white p-3 rounded-lg border border-amber-200">
//                                 <a 
//                                   href={`http://localhost:5150${selectedApplication.rawApplication.clientPassportOrNationalIdImageUrl}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                                 >
//                                   View Document
//                                 </a>
//                               </div>
//                             </div>
//                           )}
//                           {selectedApplication.rawApplication.carImageUrl && (
//                             <div className="text-center">
//                               <p className="text-sm font-medium text-amber-700 mb-2">Car Image</p>
//                               <div className="bg-white p-3 rounded-lg border border-amber-200">
//                                 <a 
//                                   href={`http://localhost:5150${selectedApplication.rawApplication.carImageUrl}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                                 >
//                                   View Image
//                                 </a>
//                               </div>
//                             </div>
//                           )}
//                           {selectedApplication.rawApplication.carLibreImageUrl && (
//                             <div className="text-center">
//                               <p className="text-sm font-medium text-amber-700 mb-2">Car Libre Image</p>
//                               <div className="bg-white p-3 rounded-lg border border-amber-200">
//                                 <a 
//                                   href={`http://localhost:5150${selectedApplication.rawApplication.carLibreImageUrl}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                                 >
//                                   View Document
//                                 </a>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Raw JSON View (for debugging) */}
//                       <details className="bg-gray-50 border border-gray-200 rounded-xl p-4">
//                         <summary className="text-sm font-semibold text-gray-700 cursor-pointer">
//                           View Raw API Data (JSON)
//                         </summary>
//                         <pre className="mt-3 text-xs bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-60">
//                           {JSON.stringify(selectedApplication.rawApplication, null, 2)}
//                         </pre>
//                       </details>
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                         <Eye className="w-8 h-8 text-amber-500" />
//                       </div>
//                       <h3 className="text-xl font-bold text-amber-900 mb-2">Full Details Not Available</h3>
//                       <p className="text-amber-600 mb-4">
//                         Raw application data is not available for this policy.
//                       </p>
//                       <button
//                         onClick={() => setViewMode('preview')}
//                         className="px-4 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
//                       >
//                         Switch to Preview Mode
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}

//               {/* Action Buttons */}
//               <div className="pt-6 border-t border-amber-100 flex flex-col sm:flex-row gap-3">
//                 <button className="flex-1 px-4 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
//                   <Download className="w-4 h-4" />
//                   Download Policy Document
//                 </button>
//                 <button className="flex-1 px-4 py-3 border border-amber-200 text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors">
//                   Request Support
//                 </button>
//                 <button 
//                   onClick={() => {
//                     setSelectedApplication(null);
//                     setViewMode('preview');
//                   }}
//                   className="px-4 py-3 border border-amber-200 text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaidApplications;
// src/components/PaidApplications/PaidApplications.tsx


import React, { useEffect, useMemo, useState } from "react";
import { getPaidApplications, type Policy } from "../../../../api/Coustomer/Policy/policiesApi";
import {
  FileText,
  DollarSign,
  ShieldCheck,
  CalendarDays,
  Loader2,
  CheckCircle,
  Car,
  Heart
} from "lucide-react";
import SearchBar from "../../../../reusable/UI/SearchBar";
import StatCard from "../../../../components/Customer/policy/StatCard";
import ApplicationCard from "../../../../components/Customer/policy/ApplicationCard";
import ApplicationModal from "../../../../components/Customer/policy/ApplicationModal";

const PaidApplications: React.FC = () => {
  const [applications, setApplications] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<Policy | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'full'>('preview');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'MOTOR' | 'LIFE'>('ALL');

  const loadApplications = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    
    try {
      const data = await getPaidApplications();
      setApplications(data);
      
      if (data.length === 0) {
        setError(
          searchTerm 
            ? "No matching applications found. Try different search terms."
            : "No paid applications found. Once you make a payment for an application, it will appear here."
        );
      }
    } catch (err: any) {
      setError(
        err.response?.status === 404 
          ? "No paid applications found. All paid applications will appear here once available."
          : "Failed to load applications. Please try again later."
      );
      console.error("Error loading applications:", err);
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    return applications.filter((app) => {
      // Apply category filter
      if (categoryFilter !== 'ALL' && app.category !== categoryFilter) {
        return false;
      }
      
      // Apply search filter
      const name = app.name ?? "";
      const policyNumber = app.policyNumber ?? "";
      const description = app.description ?? "";
      return (
        name.toLowerCase().includes(q) ||
        policyNumber.toLowerCase().includes(q) ||
        description.toLowerCase().includes(q)
      );
    });
  }, [applications, searchTerm, categoryFilter]);

  const stats = useMemo(() => {
    const total = applications.length;
    const totalValue = applications.reduce((sum, app) => sum + (app.premium || 0), 0);
    const active = applications.filter(app => 
      app.status === "Active" || app.status === "Approved"
    ).length;
    const pendingRenewal = applications.filter(app => 
      app.status === "Pending Renewal" || app.status === "Pending"
    ).length;
    const motorCount = applications.filter(app => app.category === 'MOTOR').length;
    const lifeCount = applications.filter(app => app.category === 'LIFE').length;
    
    return { total, totalValue, active, pendingRenewal, motorCount, lifeCount };
  }, [applications]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadApplications(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4" />
          <p className="text-amber-700 font-medium">Loading your paid applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
              Paid Applications
            </h1>
            <p className="text-amber-700">
              View and manage all your paid insurance applications
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-amber-200 text-amber-700 rounded-xl hover:bg-amber-50 disabled:opacity-50 transition-colors"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              <span className="font-semibold">Refresh</span>
            </button>
            
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2.5 rounded-xl">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">{stats.total} Paid</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0">⚠️</div>
              <div>
                <p className="text-red-800 font-medium mb-1">Unable to load applications</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Applications"
            value={stats.total}
            icon={FileText}
            color="emerald"
          />
          
          <StatCard
            title="Total Premium"
            value={`$${stats.totalValue.toLocaleString()}`}
            icon={DollarSign}
            color="amber"
          />
          
          <StatCard
            title="Motor Policies"
            value={stats.motorCount}
            icon={Car}
            color="blue"
          />
          
          <StatCard
            title="Life Policies"
            value={stats.lifeCount}
            icon={Heart}
            color="purple"
          />
        </div>

        {/* Search and Filter */}
        <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex-1">
              <SearchBar
                placeholder="Search applications by name, policy number, or description..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Category Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => setCategoryFilter('ALL')}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    categoryFilter === 'ALL'
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  All ({applications.length})
                </button>
                <button
                  onClick={() => setCategoryFilter('MOTOR')}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    categoryFilter === 'MOTOR'
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Motor ({stats.motorCount})
                </button>
                <button
                  onClick={() => setCategoryFilter('LIFE')}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    categoryFilter === 'LIFE'
                      ? 'bg-purple-500 text-white'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  Life ({stats.lifeCount})
                </button>
              </div>
              
              <button className="px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-colors">
                Sort by: Recent
              </button>
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white border border-dashed border-amber-200 rounded-2xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">
                {searchTerm 
                  ? "No matching applications" 
                  : categoryFilter !== 'ALL'
                  ? `No ${categoryFilter.toLowerCase()} applications found`
                  : "No paid applications yet"
                }
              </h3>
              <p className="text-amber-600 mb-6">
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : categoryFilter !== 'ALL'
                  ? `No paid ${categoryFilter.toLowerCase()} insurance applications found.`
                  : "Once you make a payment for your insurance applications, they will appear here."
                }
              </p>
              {(searchTerm || categoryFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter('ALL');
                  }}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onPreview={(app) => {
                    setSelectedApplication(app);
                    setViewMode('preview');
                  }}
                  onFullView={(app) => {
                    setSelectedApplication(app);
                    setViewMode('full');
                  }}
                  formatDate={formatDate}
                />
              ))}
            </div>
            
            {/* Results Count */}
            <div className="text-center text-amber-600 text-sm">
              Showing {filteredApplications.length} of {applications.length} application{applications.length !== 1 ? 's' : ''}
              {categoryFilter !== 'ALL' && ` in ${categoryFilter}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
          </>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          viewMode={viewMode}
          onClose={() => {
            setSelectedApplication(null);
            setViewMode('preview');
          }}
          onViewModeChange={setViewMode}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default PaidApplications;