// components/PaymentCard.tsx
import React from "react";
import type { PaymentInfo } from "../../../api/OperatingOfficer/recent";
import { CreditCard, User, Calendar, DollarSign, FileText, Clock, CheckCircle, XCircle } from "lucide-react";

interface PaymentCardProps {
  payment: PaymentInfo;
  onSelect: (payment: PaymentInfo) => void;
  isSelected?: boolean;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment, onSelect, isSelected }) => {
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div 
      className={`
        bg-white rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg
        ${isSelected 
          ? 'border-amber-500 bg-amber-50 shadow-md' 
          : 'border-gray-200 hover:border-amber-300'
        }
      `}
      onClick={() => onSelect(payment)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-amber-600" />
          <span className="font-mono text-sm font-medium text-gray-700">
            {payment.applicationId.substring(0, 8)}...
          </span>
        </div>
        
        <span className={`
          inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
          ${getStatusColor(payment.paymentStatus)}
        `}>
          {payment.paymentStatus === 'Unpaid' && <Clock className="w-3 h-3 mr-1" />}
          {payment.paymentStatus === 'Paid' && <CheckCircle className="w-3 h-3 mr-1" />}
          {payment.isPaid ? 'Paid' : payment.paymentStatus}
        </span>
      </div>

      {/* Client Info */}
      <div className="mb-3">
        <div className="flex items-center space-x-2 mb-1">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-800">
            {payment.clientFullName}
          </span>
        </div>
        <div className="text-xs text-gray-500 ml-6">
          Client ID: {payment.clientId.substring(0, 8)}...
        </div>
      </div>

      {/* Premium Amount */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-sm text-gray-600">Premium Amount</span>
        </div>
        <span className="text-lg font-bold text-green-700">
          ${payment.premiumAmount.toLocaleString()}
        </span>
      </div>

      {/* Reference & Date */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <FileText className="w-3 h-3" />
          <span>
            {payment.reference 
              ? `Ref: ${payment.reference.substring(0, 8)}...`
              : 'No reference'
            }
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(payment.createdAt)}</span>
          <span className="text-gray-400">•</span>
          <span>{formatTime(payment.createdAt)}</span>
        </div>
      </div>

      {/* Action Indicator */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-amber-200">
          <div className="flex items-center justify-center">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping mr-2"></div>
            <span className="text-xs text-amber-600 font-medium">Selected - View details on right</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentCard;