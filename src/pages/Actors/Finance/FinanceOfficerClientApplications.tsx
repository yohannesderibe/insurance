import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  getApplications, 
  updateApplicationStatus, 
  type MotorApplication 
} from "../../../api/Finance/FinanceClientSideApi";
import { TableRow, TableCell } from "@mui/material";
import ReusableTable from "../../../components/Tables/ReusableTable";
import { Search, CheckCircle, XCircle, Calendar, User, Eye, AlertCircle, DollarSign, RefreshCw } from "lucide-react";

type FilterStatus = "All" | "Pending" | "Approved" | "Rejected" | "Edited" | "AwaitingPayment";

// View Modal Component
const ViewModal: React.FC<{
  application: MotorApplication | null;
  onClose: () => void;
}> = ({ application, onClose }) => {
  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl border border-amber-200 shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-amber-900">Application Details</h3>
          <button onClick={onClose} className="px-3 py-1 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50">
            Close
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2">
              Client Information
            </h4>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Client ID</label>
              <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.clientId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Customer Name</label>
              <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.customerName}</p>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2">
              Vehicle Information
            </h4>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Model</label>
              <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.model}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Category</label>
              <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.categoryName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Sub Category</label>
              <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.subCategoryName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Year of Manufacture</label>
              <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.yearOfManufacture}</p>
            </div>
          </div>

          {/* Registration Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2">
              Registration Details
            </h4>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Registration Number</label>
              <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.registrationNumber || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Engine Number</label>
              <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.engineNumber || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Chassis Number</label>
              <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.chassisNumber || 'N/A'}</p>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2">
              Financial Information
            </h4>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Market Price</label>
              <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">${application.marketPrice.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Calculated Premium</label>
              <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">${application.calculatedPremium.toLocaleString()}</p>
            </div>
          </div>

          {/* Application Details */}
          <div className="space-y-4 md:col-span-2">
            <h4 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2">
              Application Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  application.status === 'AwaitingPayment' ? 'bg-blue-100 text-blue-800' :
                  application.status === 'Edited' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {application.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Created At</label>
                <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">
                  {new Date(application.createdAt).toLocaleDateString()} {new Date(application.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Application ID</label>
                <p className="text-amber-900 bg-amber-50 p-2 rounded-lg text-xs font-mono">{application.id}</p>
              </div>
            </div>
            {application.message && (
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Message</label>
                <p className="text-amber-900 bg-amber-50 p-2 rounded-lg">{application.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Approve Confirmation Modal
const ApproveModal: React.FC<{
  application: MotorApplication | null;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}> = ({ application, onClose, onConfirm, loading }) => {
  if (!application) return null;

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
            Are you sure you want to approve this insurance application?
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-green-800 mb-2">Application Details:</p>
            <p className="text-sm text-green-700"><strong>Client:</strong> {application.customerName}</p>
            <p className="text-sm text-green-700"><strong>Vehicle:</strong> {application.model} ({application.yearOfManufacture})</p>
            <p className="text-sm text-green-700"><strong>Sub Category:</strong> {application.subCategoryName}</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Financial Details
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-blue-600">Market Price</p>
                <p className="text-sm font-semibold text-blue-800">${application.marketPrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-blue-600">Calculated Premium</p>
                <p className="text-sm font-semibold text-blue-800">${application.calculatedPremium.toLocaleString()}</p>
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
  application: MotorApplication | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading: boolean;
}> = ({ application, onClose, onConfirm, loading }) => {
  const [rejectionReason, setRejectionReason] = useState("");

  if (!application) return null;

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
            Please provide a reason for rejecting this application. The customer will receive this message.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-red-800 mb-2">Application Details:</p>
            <p className="text-sm text-red-700"><strong>Client:</strong> {application.customerName}</p>
            <p className="text-sm text-red-700"><strong>Vehicle:</strong> {application.model} ({application.yearOfManufacture})</p>
            <p className="text-sm text-red-700"><strong>Sub Category:</strong> {application.subCategoryName}</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-xs text-red-600">Market Price</p>
                <p className="text-sm font-semibold text-red-800">${application.marketPrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-red-600">Calculated Premium</p>
                <p className="text-sm font-semibold text-red-800">${application.calculatedPremium.toLocaleString()}</p>
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
  const [allApplications, setAllApplications] = useState<MotorApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FilterStatus>((searchParams.get("status") as FilterStatus) || "All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [viewing, setViewing] = useState<MotorApplication | null>(null);
  const [approving, setApproving] = useState<MotorApplication | null>(null);
  const [rejecting, setRejecting] = useState<MotorApplication | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      console.log('🔄 Starting to fetch applications...');
      const data = await getApplications();
      console.log('📥 Received applications:', data);
      
      // Log status distribution
      const statusCount = data.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('📊 Status distribution:', statusCount);
      setAllApplications(data);
    } catch (error) {
      console.error('❌ Error fetching applications:', error);
      alert("Error fetching applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchApplications(); 
  }, []);

  const filteredApplications = useMemo(() => {
    const filtered = allApplications.filter(app => {
      const matchesText = `${app.customerName} ${app.model} ${app.subCategoryName}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "All" ? true : app.status === status;
      const submittedDate = new Date(app.createdAt).getTime();
      const fromOk = dateFrom ? submittedDate >= new Date(dateFrom).getTime() : true;
      const toOk = dateTo ? submittedDate <= new Date(dateTo).getTime() : true;
      return matchesText && matchesStatus && fromOk && toOk;
    });
    
    console.log(`🔍 Filtered applications: ${filtered.length} (Status: ${status}, Search: "${search}")`);
    filtered.forEach((app, index) => {
      console.log(`   ${index + 1}. ID: ${app.id}, Status: ${app.status}, Model: ${app.model}`);
    });
    return filtered;
  }, [allApplications, search, status, dateFrom, dateTo]);

  const handleApprove = async (application: MotorApplication) => {
    if (!application?.id) {
      console.error('❌ Cannot approve: Application ID is missing', application);
      alert('Error: Application ID is missing');
      return;
    }

    setActionLoading(true);
    try {
      console.log(`✅ Starting approve process for: ${application.id}`);
      await updateApplicationStatus(application.id, "Approved");
      console.log(`✅ Approve API call completed for: ${application.id}`);
      
      // Give the backend a moment to process, then refresh
      setTimeout(async () => {
        console.log('🔄 Refreshing data after approve...');
        await fetchApplications();
        alert("✅ Application approved successfully! The status should now show as 'Approved'.");
        setApproving(null);
      }, 1500);
      
    } catch (error: any) {
      console.error('❌ Approve error:', error);
      alert(`❌ Error approving application: ${error.response?.data?.message || error.message}`);
      setActionLoading(false);
    }
  };

  const handleReject = async (application: MotorApplication, reason: string) => {
    if (!application?.id) {
      console.error('❌ Cannot reject: Application ID is missing', application);
      alert('Error: Application ID is missing');
      return;
    }

    setActionLoading(true);
    try {
      console.log(`❌ Starting reject process for: ${application.id}`);
      await updateApplicationStatus(application.id, "Rejected", reason);
      console.log(`❌ Reject API call completed for: ${application.id}`);
      
      // Give the backend a moment to process, then refresh
      setTimeout(async () => {
        console.log('🔄 Refreshing data after reject...');
        await fetchApplications();
        alert("✅ Application rejected successfully! The status should now show as 'Rejected'.");
        setRejecting(null);
      }, 1500);
      
    } catch (error: any) {
      console.error('❌ Reject error:', error);
      alert(`❌ Error rejecting application: ${error.response?.data?.message || error.message}`);
      setActionLoading(false);
    }
  };

  const columns = [
    { label: "Customer Name", key: "customerName" },
    { label: "Model", key: "model" },
    { label: "Sub Category", key: "subCategoryName" },
    { label: "Year", key: "yearOfManufacture", align: "center" as const },
    { label: "Market Price", key: "marketPrice", align: "right" as const },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions", align: "center" as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-yellow-50/50">
      <div className="bg-white border-b border-amber-200 shadow-sm mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">Motor Insurance Applications</h1>
              <p className="text-amber-700 mt-1">Review customer-submitted motor insurance applications.</p>
            </div>
            <button 
              onClick={fetchApplications}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search by customer, model, or category..." 
                className="w-full border border-amber-200 rounded-lg pl-10 p-2 text-sm focus:ring-1 focus:ring-amber-500" 
              />
            </div>
            <div>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value as FilterStatus)} 
                className="w-full border border-amber-200 rounded-lg p-2 text-sm"
              >
                {(["All", "Pending", "Approved", "Rejected", "Edited", "AwaitingPayment"] as FilterStatus[]).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input 
                type="date" 
                value={dateFrom} 
                onChange={e => setDateFrom(e.target.value)} 
                className="w-full border border-amber-200 rounded-lg pl-10 p-2 text-sm" 
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input 
                type="date" 
                value={dateTo} 
                onChange={e => setDateTo(e.target.value)} 
                className="w-full border border-amber-200 rounded-lg pl-10 p-2 text-sm" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <>
              <ReusableTable
                columns={columns}
                data={filteredApplications}
                renderRow={(row: MotorApplication) => (
                  <TableRow key={row.id} className="hover:bg-amber-50">
                    <TableCell className="py-3 px-4 font-medium text-amber-900">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {row.customerName}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-amber-800">
                      {row.model}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-amber-800">
                      {row.subCategoryName}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-amber-700" align="center">
                      {row.yearOfManufacture}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-amber-700" align="right">
                      ${row.marketPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        row.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        row.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        row.status === 'AwaitingPayment' ? 'bg-blue-100 text-blue-800' :
                        row.status === 'Edited' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => setViewing(row)} 
                          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {row.status === 'Pending' && (
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
                )}
              />
              {filteredApplications.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-amber-400 text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">No Applications</h3>
                  <p className="text-amber-600">No motor insurance applications match your filters</p>
                  <button 
                    onClick={fetchApplications}
                    className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                  >
                    Refresh Data
                  </button>
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
