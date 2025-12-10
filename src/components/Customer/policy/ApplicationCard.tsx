import React from "react";
import { ShieldCheck, CalendarDays, DollarSign, ExternalLink, Eye, Car, Heart } from "lucide-react";
import { type Policy } from "../../../api/Coustomer/Policy/policiesApi";

interface ApplicationCardProps {
  application: Policy;
  onPreview: (app: Policy) => void;
  onFullView: (app: Policy) => void;
  formatDate: (dateString?: string) => string;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  application, 
  onPreview, 
  onFullView,
  formatDate 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 space-y-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${
              application.status === "Active" ? "bg-emerald-100 text-emerald-600" :
              application.status === "Pending Renewal" ? "bg-amber-100 text-amber-600" :
              "bg-gray-100 text-gray-600"
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${
              application.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700" :
              "bg-amber-50 text-amber-700"
            }`}>
              {String(application.paymentStatus ?? "Unknown").toUpperCase()}
            </span>
            {/* Category badge */}
            <span className={`text-xs font-semibold px-2 py-1 rounded ${
              application.category === 'MOTOR' 
                ? 'bg-blue-50 text-blue-700'
                : application.category === 'LIFE'
                ? 'bg-purple-50 text-purple-700'
                : 'bg-gray-50 text-gray-700'
            }`}>
              {application.category || 'Unknown'}
            </span>
          </div>
          <div>
            <p className="text-xs text-amber-600 font-semibold tracking-wide">
              {application.policyNumber}
            </p>
            <h3 className="text-lg font-bold text-amber-900 mt-1 line-clamp-2">
              {application.name}
            </h3>
            <p className="text-sm text-amber-700 mt-2 line-clamp-2">
              {application.description}
            </p>
          </div>
        </div>
        
        {/* Category Icon */}
        <div className={`p-2 rounded-lg ${
          application.category === 'MOTOR'
            ? 'bg-blue-50 text-blue-600'
            : application.category === 'LIFE'
            ? 'bg-purple-50 text-purple-600'
            : 'bg-gray-50 text-gray-600'
        }`}>
          {application.category === 'MOTOR' ? (
            <Car className="w-5 h-5" />
          ) : application.category === 'LIFE' ? (
            <Heart className="w-5 h-5" />
          ) : (
            <ShieldCheck className="w-5 h-5" />
          )}
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-amber-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-amber-800">
            <CalendarDays className="w-4 h-4" />
            <span>Effective: {formatDate(application.effectiveDate)}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            application.status === "Active" ? "bg-emerald-100 text-emerald-700" :
            application.status === "Pending Renewal" ? "bg-amber-100 text-amber-700" :
            "bg-gray-100 text-gray-700"
          }`}>
            {application.status}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold">${Number(application.premium ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPreview(application)}
              className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Preview
            </button>
            <button
              onClick={() => onFullView(application)}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1"
              title="View all details"
            >
              <Eye className="w-3 h-3" />
              Full View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;