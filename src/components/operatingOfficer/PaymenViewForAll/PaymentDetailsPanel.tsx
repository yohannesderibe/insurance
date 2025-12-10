// components/PaymentDetailsPanel.tsx
import React from "react";
import type { PaymentInfo } from "../../../api/OperatingOfficer/recent";
import { 
  CreditCard, 
  User, 
  Calendar, 
  DollarSign, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Copy,
  Mail,
  Phone,
  Shield,
  Car,
  Receipt
} from "lucide-react";

interface PaymentDetailsPanelProps {
  payment: PaymentInfo | null;
}

const PaymentDetailsPanel: React.FC<PaymentDetailsPanelProps> = ({ payment }) => {
  if (!payment) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 h-full flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Payment Selected</h3>
          <p className="text-gray-500 max-w-md">
            Select a payment from the list on the left to view detailed information, 
            update status, or take action.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(payment.applicationId);
    alert('Application ID copied to clipboard!');
  };

  const handleCopyReference = () => {
    if (payment.reference) {
      navigator.clipboard.writeText(payment.reference);
      alert('Reference copied to clipboard!');
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Payment Details</h2>
            <p className="text-amber-100 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Operating Officer View
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold ${payment.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {payment.paymentStatus}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Application Info Card */}
        <div className="bg-white rounded-xl border border-amber-200 p-5 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-amber-600" />
            Application Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Application ID</label>
              <div className="flex items-center">
                <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono flex-1">
                  {payment.applicationId}
                </code>
                <button 
                  onClick={handleCopyId}
                  className="ml-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy ID"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Reference Number</label>
              <div className="flex items-center">
                <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono flex-1">
                  {payment.reference || 'Not Available'}
                </code>
                {payment.reference && (
                  <button 
                    onClick={handleCopyReference}
                    className="ml-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Copy Reference"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Created Date</label>
              <div className="flex items-center text-gray-800">
                <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                {formatDate(payment.createdAt)}
              </div>
              <div className="text-sm text-gray-500 ml-6">
                {formatTime(payment.createdAt)}
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Client ID</label>
              <div className="flex items-center text-gray-800">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                {payment.clientId}
              </div>
            </div>
          </div>
        </div>

        {/* Client Info Card */}
        <div className="bg-white rounded-xl border border-blue-200 p-5 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Client Information
          </h3>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {payment.clientFullName.charAt(0)}
              </span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800">{payment.clientFullName}</h4>
              <div className="flex items-center space-x-4 mt-2">
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
                  <Mail className="w-4 h-4 mr-1" />
                  Send Email
                </button>
                <button className="flex items-center text-sm text-green-600 hover:text-green-800 transition-colors">
                  <Phone className="w-4 h-4 mr-1" />
                  Call Client
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info Card */}
        <div className="bg-white rounded-xl border border-green-200 p-5 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Payment Details
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Premium Amount</p>
                <p className="text-3xl font-bold text-green-700">
                  ${payment.premiumAmount.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Status</p>
                <p className={`text-lg font-bold ${payment.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                  {payment.isPaid ? '✓ Paid' : '● Pending'}
                </p>
              </div>
            </div>
            
            {payment.checkoutUrl && (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Payment Link</p>
                <div className="flex items-center">
                  <code className="bg-white px-3 py-2 rounded-lg text-sm font-mono flex-1 truncate">
                    {payment.checkoutUrl}
                  </code>
                  <a 
                    href={payment.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    title="Open Payment Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Mark as Paid
          </button>
          <button className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-yellow-700 transition-all flex items-center justify-center">
            <Receipt className="w-5 h-5 mr-2" />
            Generate Receipt
          </button>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="border-t border-amber-200 bg-white p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Days Since Creation</p>
            <p className="text-lg font-bold text-gray-800">
              {Math.floor((new Date().getTime() - new Date(payment.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-lg font-bold text-green-700">
              ${payment.premiumAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Action Required</p>
            <p className="text-lg font-bold text-yellow-600">
              {payment.isPaid ? 'No' : 'Yes'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsPanel;