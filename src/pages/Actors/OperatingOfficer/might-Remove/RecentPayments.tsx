// pages/OperatingOfficer/RecentPayments.tsx
import React, { useState, useEffect } from "react";
import { getRecentPayments, type PaymentInfo } from "../../../../api/OperatingOfficer/recent";
import { useNavigate } from "react-router-dom";
import { 
  CreditCard, 
  User, 
  Calendar, 
  DollarSign, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  Shield,
  TrendingUp,
  Eye,
  Mail,
  Phone,
  ExternalLink,
  Copy,
  ChevronDown,
  MoreVertical,
  AlertCircle,
  Hexagon,
  Home,
  Zap,
  Star
} from "lucide-react";

const RecentPayments: React.FC = () => {
  const [payments, setPayments] = useState<PaymentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<PaymentInfo | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const recentPayments = await getRecentPayments();
      setPayments(recentPayments);
      if (recentPayments.length > 0 && !selectedPayment) {
        setSelectedPayment(recentPayments[0]);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRefresh = () => {
    fetchPayments();
  };

  const handleSelectPayment = (payment: PaymentInfo) => {
    setSelectedPayment(payment);
  };

  // Filter and search payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.clientFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.clientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === "all" || 
      (filterStatus === "unpaid" && payment.paymentStatus === "Unpaid") ||
      (filterStatus === "paid" && payment.isPaid) ||
      (filterStatus === "pending" && payment.paymentStatus === "Pending");
    
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const totalUnpaidAmount = payments
    .filter(p => p.paymentStatus === "Unpaid")
    .reduce((sum, p) => sum + p.premiumAmount, 0);

  const totalPaidAmount = payments
    .filter(p => p.isPaid)
    .reduce((sum, p) => sum + p.premiumAmount, 0);

  const unpaidCount = payments.filter(p => p.paymentStatus === "Unpaid").length;
  const paidCount = payments.filter(p => p.isPaid).length;
  const totalCount = payments.length;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-honey-green text-honey-green-dark border-honey-green-light';
      case 'unpaid':
        return 'bg-honey-yellow text-honey-yellow-dark border-honey-yellow-light';
      case 'pending':
        return 'bg-honey-orange text-honey-orange-dark border-honey-orange-light';
      default:
        return 'bg-honey-cream text-honey-brown border-honey-light';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    // You could use a toast notification here instead
    alert('Copied to clipboard!');
  };

  const handleSendEmail = (email: string, name: string) => {
    const subject = `Payment Reminder - Bee Insurance`;
    const body = `Dear ${name},\n\nThis is a reminder about your pending insurance payment at Bee Insurance.\n\nPlease log in to your account to complete the payment.\n\nBest regards,\nBee Insurance Team`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-honey-light via-honey-cream to-honey-gold/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Bee Theme */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Hexagon className="w-8 h-8 text-amber-600 mr-2" />
                <h1 className="text-3xl font-bold text-amber-900">Payment Hive</h1>
              </div>
              <p className="text-amber-700">
                Manage all insurance payments from the central hive
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button
                onClick={() => navigate("/operating/dashboard")}
                className="px-4 py-2 border border-amber-300 rounded-xl bg-white text-amber-700 hover:bg-amber-50 transition-colors flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Hive
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Honeycomb Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-honey-light to-honey-gold/20 rounded-2xl border border-amber-200 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Total Applications</p>
                <p className="text-3xl font-bold text-amber-900 mt-1">{totalCount}</p>
              </div>
              <div className="relative">
                <Hexagon className="w-10 h-10 text-amber-500" />
                <Star className="w-6 h-6 text-amber-700 absolute -top-1 -right-1" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-amber-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              Active in hive
            </div>
          </div>

          <div className="bg-gradient-to-br from-honey-green-light to-honey-green/20 rounded-2xl border border-green-200 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Collected Honey</p>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  ${totalPaidAmount.toLocaleString()}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {paidCount} successful
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-honey-yellow-light to-honey-yellow/20 rounded-2xl border border-yellow-200 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending Honey</p>
                <p className="text-3xl font-bold text-yellow-900 mt-1">
                  ${totalUnpaidAmount.toLocaleString()}
                </p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                {unpaidCount} waiting
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-honey-orange-light to-honey-orange/20 rounded-2xl border border-orange-200 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Action Required</p>
                <p className="text-3xl font-bold text-orange-900 mt-1">{unpaidCount}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-500" />
            </div>
            <div className="mt-4 text-sm text-orange-600">
              Needs attention
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Payment List */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100 shadow-xl">
              {/* Toolbar */}
              <div className="p-6 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                      <input
                        type="text"
                        placeholder="Search in the hive..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-3 border border-amber-300 rounded-xl bg-white hover:bg-amber-50 flex items-center text-amber-700"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </button>
                      {showFilters && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-amber-200 rounded-xl shadow-lg z-10">
                          <div className="p-2">
                            <select
                              value={filterStatus}
                              onChange={(e) => setFilterStatus(e.target.value)}
                              className="w-full px-3 py-2 border border-amber-200 rounded-lg bg-white text-sm"
                            >
                              <option value="all">All Status</option>
                              <option value="unpaid">Unpaid Only</option>
                              <option value="paid">Paid Only</option>
                              <option value="pending">Pending</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                    <button className="px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment List */}
              <div className="h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                      <p className="text-amber-700">Gathering honey from the hive...</p>
                    </div>
                  </div>
                ) : filteredPayments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <Hexagon className="w-20 h-20 text-amber-300 mb-4" />
                    <h3 className="text-xl font-semibold text-amber-800 mb-2">
                      {searchTerm ? 'No honey found' : 'Hive is empty'}
                    </h3>
                    <p className="text-amber-600 text-center">
                      {searchTerm ? 'Try different search terms' : 'No payment records in the hive yet'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-amber-100">
                    {filteredPayments.map((payment) => (
                      <div
                        key={payment.applicationId}
                        className={`p-6 hover:bg-amber-50/50 cursor-pointer transition-all duration-200 ${
                          selectedPayment?.applicationId === payment.applicationId 
                            ? 'bg-amber-100/50 border-r-4 border-amber-500' 
                            : ''
                        }`}
                        onClick={() => handleSelectPayment(payment)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <Hexagon className="w-8 h-8 text-amber-500" />
                                <CreditCard className="w-4 h-4 text-amber-700 absolute inset-0 m-auto" />
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <h4 className="font-bold text-amber-900">
                                    {payment.clientFullName}
                                  </h4>
                                  <span className="ml-3 text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                                    {payment.clientId.substring(0, 8)}...
                                  </span>
                                </div>
                                <p className="text-sm text-amber-700 mt-1 flex items-center">
                                  <FileText className="w-3 h-3 mr-1" />
                                  Application ID: {payment.applicationId.substring(0, 12)}...
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="text-xl font-bold text-amber-900">
                                  ${payment.premiumAmount.toLocaleString()}
                                </p>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.paymentStatus)}`}>
                                  {payment.paymentStatus === 'Unpaid' && <Clock className="w-3 h-3 mr-1" />}
                                  {payment.isPaid ? 'Collected' : payment.paymentStatus}
                                </span>
                              </div>
                              <ChevronRight className={`w-5 h-5 text-amber-400 ${
                                selectedPayment?.applicationId === payment.applicationId ? 'text-amber-600' : ''
                              }`} />
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm text-amber-700">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center bg-amber-100/50 px-3 py-1 rounded-lg">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(payment.createdAt)}
                            </span>
                            <span className="text-amber-600">
                              {formatTime(payment.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyId(payment.applicationId);
                              }}
                              className="p-1 hover:bg-amber-200 rounded-lg transition-colors"
                              title="Copy to hive"
                            >
                              <Copy className="w-4 h-4 text-amber-600" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendEmail('client@example.com', payment.clientFullName);
                              }}
                              className="p-1 hover:bg-amber-200 rounded-lg transition-colors"
                              title="Send bee-mail"
                            >
                              <Mail className="w-4 h-4 text-amber-600" />
                            </button>
                            <button className="p-1 hover:bg-amber-200 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4 text-amber-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {!loading && filteredPayments.length > 0 && (
                <div className="p-6 border-t border-amber-200 bg-amber-50/50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-amber-700">
                      Showing <span className="font-bold">{filteredPayments.length}</span> of <span className="font-bold">{payments.length}</span> applications in hive
                    </p>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 border border-amber-300 rounded-lg hover:bg-amber-100 text-amber-700">
                        ← Previous
                      </button>
                      <button className="px-3 py-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
                        1
                      </button>
                      <button className="px-3 py-1 border border-amber-300 rounded-lg hover:bg-amber-100 text-amber-700">
                        2
                      </button>
                      <button className="px-3 py-1 border border-amber-300 rounded-lg hover:bg-amber-100 text-amber-700">
                        Next →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Details View */}
          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100 shadow-xl sticky top-6">
              <div className="p-6 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50/50">
                <h2 className="text-xl font-bold text-amber-900 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-amber-600" />
                  Hive Details
                </h2>
              </div>
              
              {selectedPayment ? (
                <div className="p-6 space-y-6">
                  {/* Client Info */}
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2 text-amber-600" />
                      Beekeeper Info
                    </h3>
                    <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-amber-700" />
                        </div>
                        <div>
                          <h4 className="font-bold text-amber-900">{selectedPayment.clientFullName}</h4>
                          <p className="text-sm text-amber-600">Hive ID: {selectedPayment.clientId}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleSendEmail('client@example.com', selectedPayment.clientFullName)}
                          className="flex-1 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Send Bee-mail
                        </button>
                        <button className="flex-1 py-2 border border-amber-300 rounded-lg hover:bg-amber-50 text-amber-700 flex items-center justify-center">
                          <Phone className="w-4 h-4 mr-2" />
                          Buzz Client
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-amber-600" />
                      Honey Collection
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-amber-50/50 rounded-lg border border-amber-200">
                        <span className="text-amber-700">Application ID</span>
                        <div className="flex items-center">
                          <code className="text-sm bg-white px-2 py-1 rounded border border-amber-200">
                            {selectedPayment.applicationId.substring(0, 12)}...
                          </code>
                          <button 
                            onClick={() => handleCopyId(selectedPayment.applicationId)}
                            className="ml-2 p-1 hover:bg-amber-200 rounded"
                          >
                            <Copy className="w-4 h-4 text-amber-600" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-yellow-50/50 rounded-lg border border-amber-200">
                        <span className="text-amber-700">Honey Amount</span>
                        <span className="text-2xl font-bold text-amber-800">
                          ${selectedPayment.premiumAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-amber-50/50 rounded-lg border border-amber-200">
                        <span className="text-amber-700">Collection Status</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPayment.paymentStatus)}`}>
                          {selectedPayment.isPaid ? 'Collected' : selectedPayment.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-amber-50/50 rounded-lg border border-amber-200">
                        <span className="text-amber-700">Date Added</span>
                        <span className="text-amber-900">{formatDate(selectedPayment.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-amber-600" />
                      Hive Actions
                    </h3>
                    <div className="space-y-2">
                      {!selectedPayment.isPaid && (
                        <>
                          <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center shadow-md">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Mark as Collected
                          </button>
                          <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl hover:from-amber-600 hover:to-yellow-700 transition-all flex items-center justify-center shadow-md">
                            <Clock className="w-5 h-5 mr-2" />
                            Set Buzz Reminder
                          </button>
                        </>
                      )}
                      <button className="w-full py-3 border border-amber-300 rounded-xl hover:bg-amber-50 text-amber-700 flex items-center justify-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Generate Honeycomb Report
                      </button>
                      {selectedPayment.checkoutUrl && (
                        <a
                          href={selectedPayment.checkoutUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center shadow-md"
                        >
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Open Payment Flower
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Hexagon className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-amber-600 mb-2">
                    No Honey Selected
                  </h3>
                  <p className="text-amber-500">
                    Select a honey collection from the hive to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-yellow-50/50 rounded-2xl border border-amber-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center">
              <Zap className="w-6 h-6 text-amber-600 mr-2" />
              <div>
                <p className="font-semibold text-amber-800">Bee Insurance Hive</p>
                <p className="text-sm text-amber-600">Sweet, secure, and efficient payments</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <button className="px-4 py-2 border border-amber-300 rounded-lg text-amber-700 hover:bg-amber-50">
                Hive Statistics
              </button>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
                Export Full Hive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentPayments;