import React from "react";
import { 
  ShieldCheck, CheckCircle, Building, FileText, UserCheck, Download, 
  X, ExternalLink, Eye, Car, Heart
} from "lucide-react";
import { 
  type Policy, 
  isMotorApplication, 
  isLifeApplication 
} from "../../../api/Coustomer/Policy/policiesApi";
import DetailItem from "./DetailItem";

interface ApplicationModalProps {
  application: Policy;
  viewMode: 'preview' | 'full';
  onClose: () => void;
  onViewModeChange: (mode: 'preview' | 'full') => void;
  formatDate: (dateString?: string) => string;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  application,
  viewMode,
  onClose,
  onViewModeChange,
  formatDate
}) => {
  const ImageGallery: React.FC = () => {
    if (!application.rawApplication) return null;
    
    const { rawApplication } = application;
    
    const images = [
      {
        title: "ID/Passport Image",
        url: rawApplication.clientPassportOrNationalIdImageUrl,
        alt: "ID Document"
      },
      ...(isMotorApplication(rawApplication) && rawApplication.carImageUrl ? [{
        title: "Car Image",
        url: rawApplication.carImageUrl,
        alt: "Car Photo"
      }] : []),
      ...(isMotorApplication(rawApplication) && rawApplication.carLibreImageUrl ? [{
        title: "Car Libre Image",
        url: rawApplication.carLibreImageUrl,
        alt: "Car Libre Document"
      }] : [])
    ].filter(img => img.url);

    if (images.length === 0) return null;

    return (
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
        <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Documents & Images
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={index} className="text-center">
              <p className="text-sm font-medium text-amber-700 mb-2">{img.title}</p>
              <div className="bg-white p-3 rounded-lg border border-amber-200">
                <img
                  src={`http://localhost:5150${img.url}`}
                  alt={img.alt}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <a 
                  href={`http://localhost:5150${img.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-block"
                >
                  View Full Size
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PreviewView: React.FC = () => (
    <>
      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-sm text-emerald-600 font-semibold">Payment Status</p>
              <p className="text-lg font-bold text-emerald-900">
                {application.paymentStatus}
              </p>
            </div>
          </div>
        </div>
        <div className={`border rounded-xl p-4 ${
          application.status === "Active" 
            ? "bg-emerald-50 border-emerald-100" 
            : "bg-amber-50 border-amber-100"
        }`}>
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm text-amber-600 font-semibold">Policy Status</p>
              <p className={`text-lg font-bold ${
                application.status === "Active" 
                  ? "text-emerald-900" 
                  : "text-amber-900"
              }`}>
                {application.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Badge */}
      <div className="flex justify-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${
          application.category === 'MOTOR'
            ? 'bg-blue-50 text-blue-700 border border-blue-100'
            : application.category === 'LIFE'
            ? 'bg-purple-50 text-purple-700 border border-purple-100'
            : 'bg-gray-50 text-gray-700 border border-gray-100'
        }`}>
          {application.category === 'MOTOR' ? (
            <>
              <Car className="w-4 h-4" />
              <span className="font-semibold">Motor Insurance</span>
            </>
          ) : application.category === 'LIFE' ? (
            <>
              <Heart className="w-4 h-4" />
              <span className="font-semibold">Life Insurance</span>
            </>
          ) : (
            <span className="font-semibold">Insurance</span>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-amber-600 uppercase mb-4">
              Policy Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-amber-500 mb-1">Policy Number</p>
                <p className="text-amber-900 font-medium">{application.policyNumber}</p>
              </div>
              <div>
                <p className="text-xs text-amber-500 mb-1">Description</p>
                <p className="text-amber-900">{application.description}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-amber-600 uppercase mb-4">
              Coverage
            </h3>
            <div className="space-y-2">
              {Array.isArray(application.coverage) && application.coverage.length > 0 ? (
                application.coverage.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                    <div className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
                    <span className="text-amber-900">{item}</span>
                  </div>
                ))
              ) : (
                <span className="text-amber-700">-</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-amber-600 uppercase mb-4">
              Dates & Financials
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-amber-500 mb-1">Effective Date</p>
                  <p className="text-amber-900 font-medium">
                    {formatDate(application.effectiveDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-amber-500 mb-1">Renewal Date</p>
                  <p className="text-amber-900 font-medium">
                    {formatDate(application.renewalDate)}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-amber-500 mb-1">Next Payment</p>
                  <p className="text-amber-900 font-medium">
                    {formatDate(application.nextPaymentDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-amber-500 mb-1">Annual Premium</p>
                  <p className="text-2xl font-bold text-amber-900">
                    ${Number(application.premium ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {application.benefits && application.benefits.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-amber-600 uppercase mb-4">
                Additional Benefits
              </h3>
              <div className="flex flex-wrap gap-2">
                {application.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-amber-50 text-amber-800 rounded-full text-sm font-medium border border-amber-200"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const FullView: React.FC = () => {
    if (!application.rawApplication) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-amber-900 mb-2">Full Details Not Available</h3>
          <p className="text-amber-600 mb-4">
            Raw application data is not available for this policy.
          </p>
          <button
            onClick={() => onViewModeChange('preview')}
            className="px-4 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
          >
            Switch to Preview Mode
          </button>
        </div>
      );
    }

    const { rawApplication } = application;

    return (
      <div className="space-y-6">
        {/* Category Header */}
        <div className={`p-4 rounded-xl ${
          application.category === 'MOTOR'
            ? 'bg-blue-50 border border-blue-100'
            : application.category === 'LIFE'
            ? 'bg-purple-50 border border-purple-100'
            : 'bg-gray-50 border border-gray-100'
        }`}>
          <div className="flex items-center gap-3">
            {application.category === 'MOTOR' ? (
              <>
                <Car className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-bold text-blue-900">Motor Insurance Application</h3>
                  <p className="text-sm text-blue-700">Complete vehicle and insurance details</p>
                </div>
              </>
            ) : application.category === 'LIFE' ? (
              <>
                <Heart className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="font-bold text-purple-900">Life Insurance Application</h3>
                  <p className="text-sm text-purple-700">Complete life insurance details</p>
                </div>
              </>
            ) : (
              <>
                <ShieldCheck className="w-6 h-6 text-gray-600" />
                <div>
                  <h3 className="font-bold text-gray-900">Insurance Application</h3>
                  <p className="text-sm text-gray-700">Complete application details</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Insurance Information */}
          {isMotorApplication(rawApplication) ? (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5" />
                Vehicle Information
              </h3>
              <div className="space-y-3">
                <DetailItem label="Model" value={rawApplication.model} />
                <DetailItem label="Plate Number" value={rawApplication.plateNumber} />
                <DetailItem label="Year" value={rawApplication.yearOfManufacture.toString()} />
                <DetailItem label="Engine Number" value={rawApplication.engineNumber} />
                <DetailItem label="Chassis Number" value={rawApplication.chassisNumber} />
                <DetailItem label="Market Price" value={`$${rawApplication.marketPrice.toLocaleString()}`} />
                <DetailItem label="Insurance Type" value={rawApplication.insuranceType} />
              </div>
            </div>
          ) : isLifeApplication(rawApplication) ? (
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
              <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Life Insurance Information
              </h3>
              <div className="space-y-3">
                <DetailItem label="Insurance Type" value={rawApplication.lifeInsuranceType} />
                <DetailItem label="Age" value={rawApplication.age.toString()} />
                <DetailItem label="Height" value={`${rawApplication.height} cm`} />
                <DetailItem label="Weight" value={`${rawApplication.weight} kg`} />
                <DetailItem label="Life Price" value={`$${rawApplication.lifePrice.toLocaleString()}`} />
                <DetailItem label="Category" value={rawApplication.categoryName} />
                <DetailItem label="Sub Category" value={rawApplication.subCategoryName} />
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Insurance Information
              </h3>
              <p className="text-gray-600">
                Unable to determine application type. Showing generic information.
              </p>
            </div>
          )}

          {/* Application Details */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Application Details
            </h3>
            <div className="space-y-3">
              <DetailItem label="Application ID" value={rawApplication.applicationId} />
              <DetailItem label="Status" value={rawApplication.status} />
              <DetailItem label="Created Date" value={formatDate(rawApplication.createdAt)} />
              <DetailItem label="Message" value={rawApplication.message || "No message"} />
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
          <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Client Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <DetailItem label="Full Name" value={rawApplication.clientFullName} />
              <DetailItem label="Email" value={rawApplication.clientEmail} />
              <DetailItem label="Phone Number" value={rawApplication.clientPhoneNumber} />
              <DetailItem label="Gender" value={rawApplication.clientGender} />
            </div>
            <div className="space-y-3">
              <DetailItem label="Date of Birth" value={formatDate(rawApplication.clientDateOfBirth)} />
              <DetailItem label="National ID/Passport" value={rawApplication.clientNationalIdOrPassport} />
            </div>
          </div>
        </div>

        {/* Images Section */}
        <ImageGallery />

        {/* Raw JSON View (for debugging) */}
        <details className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <summary className="text-sm font-semibold text-gray-700 cursor-pointer">
            View Raw API Data (JSON)
          </summary>
          <pre className="mt-3 text-xs bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-60">
            {JSON.stringify(rawApplication, null, 2)}
          </pre>
        </details>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-amber-100 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${
                application.category === 'MOTOR'
                  ? 'bg-blue-100 text-blue-600'
                  : application.category === 'LIFE'
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-amber-100 text-amber-600'
              }`}>
                {application.category === 'MOTOR' ? (
                  <Car className="w-6 h-6" />
                ) : application.category === 'LIFE' ? (
                  <Heart className="w-6 h-6" />
                ) : (
                  <ShieldCheck className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-sm text-amber-600 font-semibold">
                  {application.policyNumber}
                </p>
                <h2 className="text-2xl font-bold text-amber-900 mt-1">
                  {application.name}
                </h2>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded-full font-semibold bg-amber-100 text-amber-700">
                    {viewMode === 'full' ? 'Full Details View' : 'Preview Mode'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    application.category === 'MOTOR'
                      ? 'bg-blue-100 text-blue-700'
                      : application.category === 'LIFE'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {application.category || 'Unknown'} Insurance
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full font-semibold bg-emerald-100 text-emerald-700">
                    {application.rawApplication ? 'API Data Available' : 'Basic View'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-amber-50 text-amber-700 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onViewModeChange('preview')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                viewMode === 'preview' 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              <ExternalLink className="w-4 h-4 inline mr-2" />
              Preview
            </button>
            <button
              onClick={() => onViewModeChange('full')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                viewMode === 'full' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Full Details
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {viewMode === 'preview' ? <PreviewView /> : <FullView />}

          {/* Action Buttons */}
          <div className="pt-6 border-t border-amber-100 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download Policy Document
            </button>
            <button className="flex-1 px-4 py-3 border border-amber-200 text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors">
              Request Support
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-3 border border-amber-200 text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;