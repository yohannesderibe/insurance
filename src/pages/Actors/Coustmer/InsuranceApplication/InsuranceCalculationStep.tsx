// import React, { useState, useEffect } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import StepProgress from "../../../../reusable/UI/StepProgress";
// import { useInsuranceApplication } from "../../../../context/InsuranceApplicationContext";
// import { DollarSign, ShieldCheck, Hexagon, CheckCircle2, AlertCircle } from "lucide-react";

// const COVERAGE_OPTIONS = [
//   {
//     key: "motorTheft",
//     label: "Motor Theft Protection",
//     description: "Covers loss or damage if your vehicle is stolen.",
//     cost: 100
//   },
//   {
//     key: "naturalDisaster",
//     label: "Natural Disaster Shield",
//     description: "Protects against floods, storms, earthquakes, and more.",
//     cost: 120
//   },
//   {
//     key: "personalAccident",
//     label: "Personal Accident Cover",
//     description: "Offers personal medical coverage for driver & passengers.",
//     cost: 150
//   },
//   {
//     key: "thirdPartyLiability",
//     label: "Third-Party Liability",
//     description: "Required by law—covers damages to others' property or person.",
//     cost: 80
//   }
// ] as const;

// const InsuranceCalculationStep: React.FC = () => {
//   const navigate = useNavigate();
//   const {
//     personalInfo,
//     carInfo,
//     coverages,
//     setCoverages,
//     setCalculationTotals,
//     backendApplicationData,
//     setBackendApplicationData
//   } = useInsuranceApplication();
  
//   const [sendingToFinance, setSendingToFinance] = useState(false);
//   const [fetchingPremium, setFetchingPremium] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Only fetch if we have carInfo with all required fields
//     if (carInfo && 
//         !backendApplicationData && 
//         carInfo.categoryId && 
//         carInfo.subCategoryId && 
//         carInfo.insuranceType) {
//       fetchPremiumFromBackend();
//     }
//   }, [carInfo]);

//   if (!personalInfo) {
//     return <Navigate to="/insurance/apply/personal" replace />;
//   }

//   if (!carInfo) {
//     return <Navigate to="/insurance/apply/car" replace />;
//   }

//   // Use ONLY backend premium - if not available, we can't calculate
//   const basePrice = backendApplicationData?.calculatedPremium || 0;

//   const optionalTotal = COVERAGE_OPTIONS.reduce((sum, option) => {
//     if (coverages[option.key]) {
//       return sum + option.cost;
//     }
//     return sum;
//   }, 0);

//   const total = basePrice + optionalTotal;

//   const selectedOptions = COVERAGE_OPTIONS.filter((option) => coverages[option.key]);

//   const handleCoverageChange = (key: typeof COVERAGE_OPTIONS[number]["key"]) => {
//     setCoverages({
//       ...coverages,
//       [key]: !coverages[key]
//     });
//   };

//   const fetchPremiumFromBackend = async () => {
//     // Check if we have all required fields
//     const requiredFields = [
//       carInfo?.categoryId,
//       carInfo?.subCategoryId,
//       carInfo?.model,
//       carInfo?.plateNumber,
//       carInfo?.yearOfManufacture,
//       carInfo?.engineNumber,
//       carInfo?.chassisNumber,
//       carInfo?.insuranceType
//     ];

//     if (requiredFields.some(field => !field)) {
//       setError("Missing required car information. Please go back and fill all fields.");
//       return;
//     }

//     setFetchingPremium(true);
//     setError(null);
    
//     try {
//       const token = localStorage.getItem('token');
      
//       const formData = new FormData();
//       formData.append('CategoryId', carInfo.categoryId!);
//       formData.append('SubCategoryId', carInfo.subCategoryId!);
//       formData.append('Model', carInfo.model!);
//       formData.append('PlateNumber', carInfo.plateNumber!);
//       formData.append('YearOfManufacture', carInfo.yearOfManufacture);
//       formData.append('EngineNumber', carInfo.engineNumber);
//       formData.append('ChassisNumber', carInfo.chassisNumber);
//       formData.append('InsuranceType', carInfo.insuranceType!);

//       const response = await fetch('/api/Client/apply/motor', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'accept': '*/*',
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch premium: ${response.status}`);
//       }

//       const data = await response.json();
//       setBackendApplicationData(data);
      
//     } catch (error) {
//       console.error('Error fetching premium:', error);
//       setError("Failed to fetch premium from server. Please try again.");
//     } finally {
//       setFetchingPremium(false);
//     }
//   };

//   const handleContinue = () => {
//     if (!backendApplicationData) {
//       setError("Please fetch premium from backend first.");
//       return;
//     }

//     setSendingToFinance(true);
//     setTimeout(() => {
//       setCalculationTotals({
//         basePrice,
//         optionalTotal,
//         total
//       });
//       setSendingToFinance(false);
//       navigate("/insurance/apply/review");
//     }, 1200);
//   };

//   return (
//     <div className="min-h-screen bg-[#FFF8E1] py-10 px-4 md:px-8">
//       <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-[#FFE082] p-6 md:p-10">
//         <StepProgress currentStep={3} />

//         <header className="mb-8">
//           <p className="text-sm text-[#FFC107] font-semibold uppercase tracking-wide">Step 3 of 3</p>
//           <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mt-2">Insurance Calculation</h1>
//           <p className="text-[#5D4037] mt-2">
//             Review details, select optional coverages, and confirm your insurance plan.
//           </p>
//         </header>

//         {/* Error Display */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
//             <AlertCircle className="w-5 h-5 text-red-500" />
//             <p className="text-red-700">{error}</p>
//           </div>
//         )}

//         {/* Loading State */}
//         {fetchingPremium && (
//           <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3">
//             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
//             <p className="text-blue-700">Fetching premium from backend...</p>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-6">
//             <section className="border border-[#FFE082] rounded-2xl p-6 space-y-4 bg-white">
//               <div className="flex items-center gap-3">
//                 <ShieldCheck className="w-5 h-5 text-[#FFC107]" />
//                 <h2 className="text-lg font-semibold text-[#000000]">Application Summary</h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#4E342E]">
//                 <div>
//                   <p className="font-semibold">Applicant</p>
//                   <p>{personalInfo.fullName}</p>
//                   <p className="text-xs text-gray-500">{personalInfo.email}</p>
//                 </div>
//                 <div>
//                   <p className="font-semibold">Contact</p>
//                   <p>{personalInfo.phoneNumber}</p>
//                   <p className="text-xs text-gray-500">{personalInfo.address}</p>
//                 </div>
//                 {backendApplicationData && (
//                   <>
//                     <div>
//                       <p className="font-semibold">Category</p>
//                       <p>{backendApplicationData.categoryName}</p>
//                     </div>
//                     <div>
//                       <p className="font-semibold">Subcategory</p>
//                       <p>{backendApplicationData.subCategoryName}</p>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </section>

//             <section className="border border-[#FFE082] rounded-2xl p-6 space-y-4 bg-white">
//               <div className="flex items-center gap-3">
//                 <ShieldCheck className="w-5 h-5 text-[#FFC107]" />
//                 <h2 className="text-lg font-semibold text-[#000000]">Vehicle Information</h2>
//               </div>
              
//               {backendApplicationData ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#4E342E]">
//                   <div>
//                     <p className="font-semibold">Model & Year</p>
//                     <p>{backendApplicationData.model}</p>
//                     <p>Year: {backendApplicationData.yearOfManufacture}</p>
//                   </div>
//                   <div>
//                     <p className="font-semibold">Plate Number</p>
//                     <p>{backendApplicationData.plateNumber}</p>
//                   </div>
//                   <div>
//                     <p className="font-semibold">Engine Number</p>
//                     <p>{backendApplicationData.engineNumber}</p>
//                   </div>
//                   <div>
//                     <p className="font-semibold">Chassis Number</p>
//                     <p>{backendApplicationData.chassisNumber}</p>
//                   </div>
//                   <div>
//                     <p className="font-semibold">Market Price</p>
//                     <p>${backendApplicationData.marketPrice.toLocaleString()}</p>
//                   </div>
//                   <div>
//                     <p className="font-semibold">Insurance Type</p>
//                     <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
//                       backendApplicationData.insuranceType === 'Full' 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-blue-100 text-blue-800'
//                     }`}>
//                       {backendApplicationData.insuranceType} Insurance
//                     </span>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center py-4">
//                   <p className="text-gray-500">Vehicle information will appear after fetching premium from backend.</p>
//                 </div>
//               )}
              
//               {/* Premium Fetch Button */}
//               <div className="mt-4 pt-4 border-t border-[#FFE082]">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="font-semibold text-[#000000]">Premium Status</p>
//                     <p className="text-sm text-[#5D4037]">
//                       {backendApplicationData 
//                         ? `Premium calculated: $${backendApplicationData.calculatedPremium.toLocaleString()}`
//                         : "Premium not fetched yet"}
//                     </p>
//                   </div>
//                   <button
//                     onClick={fetchPremiumFromBackend}
//                     disabled={fetchingPremium || !carInfo?.insuranceType}
//                     className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     {fetchingPremium ? "Fetching..." : backendApplicationData ? "Refresh Premium" : "Get Premium"}
//                   </button>
//                 </div>
//               </div>
//             </section>

//             <section className="border border-[#FFE082] rounded-2xl p-6 space-y-4 bg-white">
//               <div className="flex items-center gap-3">
//                 <Hexagon className="w-5 h-5 text-[#FFC107]" />
//                 <h2 className="text-lg font-semibold text-[#000000]">Optional Coverages</h2>
//               </div>
//               <p className="text-sm text-[#5D4037] mb-4">
//                 Select additional coverage options to enhance your insurance policy.
//               </p>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {COVERAGE_OPTIONS.map((option) => (
//                   <label
//                     key={option.key}
//                     className={`border rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-colors ${
//                       coverages[option.key]
//                         ? "border-[#FFC107] bg-[#FFF8E1]"
//                         : "border-[#FFE082] hover:border-[#FFC107]"
//                     }`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={coverages[option.key]}
//                       onChange={() => handleCoverageChange(option.key)}
//                       className="h-5 w-5 rounded text-[#FFC107]"
//                       disabled={!backendApplicationData}
//                     />
//                     <div>
//                       <p className="font-semibold text-[#000000]">{option.label}</p>
//                       <p className="text-sm text-[#5D4037]">{option.description}</p>
//                       <p className="text-xs font-semibold text-[#FFC107] mt-1">Adds ${option.cost}</p>
//                     </div>
//                   </label>
//                 ))}
//               </div>

//               <div className="mt-6 border border-dashed border-[#FFC107] rounded-2xl p-4 bg-[#FFF8E1]">
//                 <p className="text-sm font-semibold text-[#000000] mb-2">Selected Options</p>
//                 {selectedOptions.length === 0 ? (
//                   <p className="text-sm text-[#5D4037]">No optional coverages selected.</p>
//                 ) : (
//                   <ul className="space-y-2">
//                     {selectedOptions.map((option) => (
//                       <li key={option.key} className="flex items-center gap-2 text-sm text-[#4E342E]">
//                         <CheckCircle2 className="w-4 h-4 text-[#FFC107]" />
//                         {option.label} (+${option.cost})
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </section>
//           </div>

//           <aside className="border border-[#FFC107] rounded-2xl p-6 space-y-5 bg-[#FFF8E1] h-fit">
//             <div className="flex items-center gap-2 text-[#000000]">
//               <DollarSign className="w-5 h-5" />
//               <h3 className="text-lg font-semibold">Premium Calculation</h3>
//             </div>
            
//             <div className="space-y-3 text-sm text-[#4E342E]">
//               <div className="flex justify-between">
//                 <span>Base Premium</span>
//                 <div className="text-right">
//                   {backendApplicationData ? (
//                     <>
//                       <strong>${backendApplicationData.calculatedPremium.toLocaleString()}</strong>
//                       <p className="text-xs text-green-600">Calculated by backend</p>
//                     </>
//                   ) : (
//                     <span className="text-gray-400">Not available</span>
//                   )}
//                 </div>
//               </div>
              
//               <div className="flex justify-between">
//                 <span>Optional Coverages</span>
//                 <strong>${optionalTotal.toLocaleString()}</strong>
//               </div>
              
//               <div className="h-px bg-[#FFD54F]" />
              
//               <div className="flex justify-between text-lg font-bold text-[#000000]">
//                 <span>Total Premium</span>
//                 <span>${total.toLocaleString()}</span>
//               </div>
              
//               <p className="text-xs text-[#5D4037]">
//                 * Optional coverages can be customized later with a finance officer.
//               </p>
//             </div>
            
//             <div className="space-y-3">
//               <button
//                 onClick={handleContinue}
//                 className="w-full py-3 rounded-2xl bg-[#FFC107] text-black font-semibold text-sm hover:bg-[#FFB300] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={sendingToFinance || !backendApplicationData}
//               >
//                 {sendingToFinance ? "Sending to Finance Officer..." : "Continue to Finance Officer"}
//               </button>
              
//               <button
//                 type="button"
//                 onClick={() => navigate("/insurance/apply/car")}
//                 className="w-full py-3 rounded-2xl border border-[#FFC107] text-[#000000] font-semibold text-sm hover:bg-white transition-colors"
//               >
//                 Back to Car Info
//               </button>
//             </div>
            
//             {/* Application Status */}
//             {backendApplicationData && (
//               <div className="mt-4 pt-4 border-t border-[#FFE082]">
//                 <p className="text-xs font-semibold text-[#000000]">Application Status</p>
//                 <p className="text-xs text-[#5D4037]">{backendApplicationData.status}</p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Application ID: {backendApplicationData.applicationId}
//                 </p>
//               </div>
//             )}
//           </aside>
//         </div>
//       </div>

//       {sendingToFinance && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC107]" />
//             <p className="text-[#000000] font-semibold">Sending application to Finance Officer...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InsuranceCalculationStep;
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import StepProgress from "../../../../reusable/UI/StepProgress";
import { useInsuranceApplication } from "../../../../context/InsuranceApplicationContext";
import { DollarSign, ShieldCheck, Hexagon, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { confirmMotorInsurance } from "../../../../api/Coustomer/applications/motorInsuranceApi";

const COVERAGE_OPTIONS = [
  {
    key: "motorTheft",
    label: "Motor Theft Protection",
    description: "Covers loss or damage if your vehicle is stolen.",
    cost: 100
  },
  {
    key: "naturalDisaster",
    label: "Natural Disaster Shield",
    description: "Protects against floods, storms, earthquakes, and more.",
    cost: 120
  },
  {
    key: "personalAccident",
    label: "Personal Accident Cover",
    description: "Offers personal medical coverage for driver & passengers.",
    cost: 150
  },
  {
    key: "thirdPartyLiability",
    label: "Third-Party Liability",
    description: "Required by law—covers damages to others' property or person.",
    cost: 80
  }
] as const;

const InsuranceCalculationStep: React.FC = () => {
  const navigate = useNavigate();
  const {
    personalInfo,
    carInfo,
    coverages,
    setCoverages,
    setCalculationTotals,
    backendApplicationData,
    setBackendApplicationData
  } = useInsuranceApplication();
  
  const [sendingToFinance, setSendingToFinance] = useState(false);
  const [refreshingPremium, setRefreshingPremium] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Backend data in context:", backendApplicationData);
    console.log("Car info in context:", carInfo);
  }, [backendApplicationData, carInfo]);

  if (!personalInfo) {
    return <Navigate to="/insurance/apply/personal" replace />;
  }

  if (!carInfo) {
    return <Navigate to="/insurance/apply/car" replace />;
  }

  // Check if we have backend data - if not, show loading
  if (!backendApplicationData) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] py-10 px-4 md:px-8">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-[#FFE082] p-6 md:p-10">
          <StepProgress currentStep={3} />
          
          <header className="mb-8">
            <p className="text-sm text-[#FFC107] font-semibold uppercase tracking-wide">Step 3 of 3</p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mt-2">Loading Application Data</h1>
            <p className="text-[#5D4037] mt-2">
              Please wait while we load your insurance application data...
            </p>
          </header>
          
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFC107] mb-4"></div>
            <p className="text-gray-600 mb-2">Loading premium information...</p>
            <p className="text-sm text-gray-500 text-center mb-6">
              If this takes too long, you may need to go back and resubmit your car information.
            </p>
            <button
              onClick={() => navigate("/insurance/apply/car")}
              className="px-6 py-2 rounded-lg border border-[#FFC107] text-[#000000] font-semibold text-sm hover:bg-white transition-colors"
            >
              Go Back to Car Info
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use backend premium
  const basePrice = backendApplicationData.calculatedPremium || 0;

  const optionalTotal = COVERAGE_OPTIONS.reduce((sum, option) => {
    if (coverages[option.key]) {
      return sum + option.cost;
    }
    return sum;
  }, 0);

  const total = basePrice + optionalTotal;

  const selectedOptions = COVERAGE_OPTIONS.filter((option) => coverages[option.key]);

  const handleCoverageChange = (key: typeof COVERAGE_OPTIONS[number]["key"]) => {
    setCoverages({
      ...coverages,
      [key]: !coverages[key]
    });
  };

  // Function to refresh premium (optional)
  const refreshPremium = async () => {
    if (!carInfo || !carInfo.insuranceType) {
      setError("Cannot refresh: missing car information");
      return;
    }

    setRefreshingPremium(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('CategoryId', carInfo.categoryId!);
      formData.append('SubCategoryId', carInfo.subCategoryId!);
      formData.append('Model', carInfo.model!);
      formData.append('PlateNumber', carInfo.plateNumber!);
      formData.append('YearOfManufacture', carInfo.yearOfManufacture);
      formData.append('EngineNumber', carInfo.engineNumber);
      formData.append('ChassisNumber', carInfo.chassisNumber);
      formData.append('InsuranceType', carInfo.insuranceType!);

      const response = await fetch('/api/Client/apply/motor', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh premium: ${response.status}`);
      }

      const data = await response.json();
      setBackendApplicationData(data);
      
    } catch (error) {
      console.error('Error refreshing premium:', error);
      setError("Failed to refresh premium. The current data is still valid.");
    } finally {
      setRefreshingPremium(false);
    }
  };

  const handleContinue = () => {
      if(!backendApplicationData?.applicationId){
        alert("No application data available.please go back and resubmit");
        return;
      }

try{
    setSendingToFinance(true);
    setError(null);

    //call the confirm endpoint with the application id from priview
    const confirmedData = await confirmMotorInsurance(backendApplicationData.applicationId);
    console.log("Application confirmed and sent to FO:" , confirmedData);

    //update the backend data with the confirmed application 
    setBackendApplicationData(confirmedData);

    //save calculation step 
    setCalculationTotals({
      basePrice: confirmedData.calculatedPremium || 0,
      optionalTotal,
      total: (confirmedData.calculatedPremium || 0) + optionalTotal 
    });

      navigate("/insurance/apply/payment");
  
} catch(error: any){
  console.error("error conforming application: ", error);
  setError(error.message || "failed to submit your application to Finance officer. ")
} finally{
   setSendingToFinance(false);
}

  return (
    <div className="min-h-screen bg-[#FFF8E1] py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-[#FFE082] p-6 md:p-10">
        <StepProgress currentStep={3} />

        <header className="mb-8">
          <p className="text-sm text-[#FFC107] font-semibold uppercase tracking-wide">Step 3 of 3</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mt-2">Insurance Calculation</h1>
          <p className="text-[#5D4037] mt-2">
            Review details, select optional coverages, and confirm your insurance plan.
          </p>
        </header>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Application Summary - Using backend data */}
            <section className="border border-[#FFE082] rounded-2xl p-6 space-y-4 bg-white">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#FFC107]" />
                <h2 className="text-lg font-semibold text-[#000000]">Application Summary</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#4E342E]">
                <div>
                  <p className="font-semibold">Applicant</p>
                  <p>{backendApplicationData.clientFullName}</p>
                  <p className="text-xs text-gray-500">{backendApplicationData.clientEmail}</p>
                </div>
                <div>
                  <p className="font-semibold">Contact</p>
                  <p>{backendApplicationData.clientPhoneNumber}</p>
                  <p className="text-xs text-gray-500">ID: {backendApplicationData.clientNationalIdOrPassport}</p>
                </div>
                <div>
                  <p className="font-semibold">Category</p>
                  <p>{backendApplicationData.categoryName}</p>
                </div>
                <div>
                  <p className="font-semibold">Subcategory</p>
                  <p>{backendApplicationData.subCategoryName}</p>
                </div>
              </div>
            </section>

            {/* Vehicle Information - Using backend data */}
            <section className="border border-[#FFE082] rounded-2xl p-6 space-y-4 bg-white">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#FFC107]" />
                <h2 className="text-lg font-semibold text-[#000000]">Vehicle Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#4E342E]">
                <div>
                  <p className="font-semibold">Model & Year</p>
                  <p>{backendApplicationData.model}</p>
                  <p>Year: {backendApplicationData.yearOfManufacture}</p>
                </div>
                <div>
                  <p className="font-semibold">Plate Number</p>
                  <p>{backendApplicationData.plateNumber}</p>
                </div>
                <div>
                  <p className="font-semibold">Engine Number</p>
                  <p>{backendApplicationData.engineNumber}</p>
                </div>
                <div>
                  <p className="font-semibold">Chassis Number</p>
                  <p>{backendApplicationData.chassisNumber}</p>
                </div>
                <div>
                  <p className="font-semibold">Market Price</p>
                  <p>${backendApplicationData.marketPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Insurance Type</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                    backendApplicationData.insuranceType === 'Full' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {backendApplicationData.insuranceType} Insurance
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Premium: ${backendApplicationData.calculatedPremium.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {/* Refresh Premium Button */}
              <div className="mt-4 pt-4 border-t border-[#FFE082]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#000000]">Application Status</p>
                    <p className="text-sm text-[#5D4037]">
                      {backendApplicationData.status} - {backendApplicationData.message}
                    </p>
                  </div>
                  <button
                    onClick={refreshPremium}
                    disabled={refreshingPremium}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshingPremium ? 'animate-spin' : ''}`} />
                    {refreshingPremium ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              </div>
            </section>

            {/* Optional Coverages */}
            <section className="border border-[#FFE082] rounded-2xl p-6 space-y-4 bg-white">
              <div className="flex items-center gap-3">
                <Hexagon className="w-5 h-5 text-[#FFC107]" />
                <h2 className="text-lg font-semibold text-[#000000]">Optional Coverages</h2>
              </div>
              <p className="text-sm text-[#5D4037] mb-4">
                Select additional coverage options to enhance your insurance policy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COVERAGE_OPTIONS.map((option) => (
                  <label
                    key={option.key}
                    className={`border rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                      coverages[option.key]
                        ? "border-[#FFC107] bg-[#FFF8E1]"
                        : "border-[#FFE082] hover:border-[#FFC107]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={coverages[option.key]}
                      onChange={() => handleCoverageChange(option.key)}
                      className="h-5 w-5 rounded text-[#FFC107]"
                    />
                    <div>
                      <p className="font-semibold text-[#000000]">{option.label}</p>
                      <p className="text-sm text-[#5D4037]">{option.description}</p>
                      <p className="text-xs font-semibold text-[#FFC107] mt-1">Adds ${option.cost}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6 border border-dashed border-[#FFC107] rounded-2xl p-4 bg-[#FFF8E1]">
                <p className="text-sm font-semibold text-[#000000] mb-2">Selected Options</p>
                {selectedOptions.length === 0 ? (
                  <p className="text-sm text-[#5D4037]">No optional coverages selected.</p>
                ) : (
                  <ul className="space-y-2">
                    {selectedOptions.map((option) => (
                      <li key={option.key} className="flex items-center gap-2 text-sm text-[#4E342E]">
                        <CheckCircle2 className="w-4 h-4 text-[#FFC107]" />
                        {option.label} (+${option.cost})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>

          {/* Premium Calculation Sidebar */}
          <aside className="border border-[#FFC107] rounded-2xl p-6 space-y-5 bg-[#FFF8E1] h-fit">
            <div className="flex items-center gap-2 text-[#000000]">
              <DollarSign className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Premium Calculation</h3>
            </div>
            
            <div className="space-y-3 text-sm text-[#4E342E]">
              <div className="flex justify-between">
                <span>Base Premium</span>
                <div className="text-right">
                  <strong>${backendApplicationData.calculatedPremium.toLocaleString()}</strong>
                  <p className="text-xs text-green-600">✓ System calculated</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span>Optional Coverages</span>
                <strong>${optionalTotal.toLocaleString()}</strong>
              </div>
              
              <div className="h-px bg-[#FFD54F]" />
              
              <div className="flex justify-between text-lg font-bold text-[#000000]">
                <span>Total Premium</span>
                <span>${total.toLocaleString()}</span>
              </div>
              
              <p className="text-xs text-[#5D4037]">
                * Optional coverages can be customized later with a finance officer.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleContinue}
                className="w-full py-3 rounded-2xl bg-[#FFC107] text-black font-semibold text-sm hover:bg-[#FFB300] transition-colors"
                disabled={sendingToFinance}
              >
                {sendingToFinance ? "Sending to Finance Officer..." : "Continue to Finance Officer"}
              </button>
              
              <button
                type="button"
                onClick={() => navigate("/insurance/apply/car")}
                className="w-full py-3 rounded-2xl border border-[#FFC107] text-[#000000] font-semibold text-sm hover:bg-white transition-colors"
              >
                Back to Car Info
              </button>
            </div>
            
            {/* Application Details */}
            <div className="mt-4 pt-4 border-t border-[#FFE082]">
              <p className="text-xs font-semibold text-[#000000]">Application Details</p>
              <p className="text-xs text-gray-500">
                ID: {backendApplicationData.applicationId}
              </p>
              <p className="text-xs text-gray-500">
                Client ID: {backendApplicationData.clientId}
              </p>
              <p className="text-xs text-gray-500">
                Created: {new Date(backendApplicationData.createdAt).toLocaleString()}
              </p>
            </div>
          </aside>
        </div>
      </div>

      {sendingToFinance && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC107]" />
            <p className="text-[#000000] font-semibold">Sending application to Finance Officer...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceCalculationStep;