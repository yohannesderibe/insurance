// import React, { useState, useEffect } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import StepProgress from "../../../../reusable/UI/StepProgress";
// import { useInsuranceApplication } from "../../../../context/InsuranceApplicationContext";
// import { useLifeInsurance, type LifeInfo } from "../../../../context/LifeInsuranceContext";
// import { lifeApiService } from "../../../../api/Coustomer/applications/lifeApi";

// // Example dropdown options
// const smokerOptions = ["No", "Yes"];
// const relationOptions = [
//   "Spouse",
//   "Child",
//   "Parent",
//   "Sibling",
//   "Other"
// ];
// const lifeInsuranceTypeOptions = ["FullLife", "HalfLife"];

// // Static category IDs based on your API calls
// const LIFE_CATEGORY_ID = "bd189b1b-47a0-4d06-a118-2c0b0bac45ce";
// const LIFE_SUBCATEGORY_ID = "5e3e5ee6-3266-4c4d-a3dc-0c1a098d9c8e";

// // Interface for life info that we'll manage locally

// const LifeInfoStep: React.FC = () => {
//   const navigate = useNavigate();
//   const { 
//     personalInfo,
//     setCalculationTotals
//   } = useInsuranceApplication();

//   const {
//     lifeInfo: contextLifeInfo,
//     setLifeInfo,
//     backendLifeApplicationData,
//     setBackendLifeApplicationData
//   } = useLifeInsurance();

//   // if personal info not filled, bounce back
//   if (!personalInfo) {
//     return <Navigate to="/insurance/apply/personal" replace />;
//   }

//   // Initialize form with local state
//   // Initialize form with context data or defaults
//   const [form, setForm] = useState<LifeInfo>(() => ({
//     age: contextLifeInfo?.age ?? 0,
//     height: contextLifeInfo?.height ?? 0,
//     weight: contextLifeInfo?.weight ?? 0,
//     coverageAmount: contextLifeInfo?.coverageAmount ?? 0,
//     beneficiaryName: contextLifeInfo?.beneficiaryName ?? "",
//     beneficiaryRelation: contextLifeInfo?.beneficiaryRelation ?? "",
//     policyTermYears: contextLifeInfo?.policyTermYears ?? 0,
//     smokerStatus: contextLifeInfo?.smokerStatus ?? "",
//     lifeInsuranceType: contextLifeInfo?.lifeInsuranceType ?? "FullLife",
//     categoryId: LIFE_CATEGORY_ID,
//     subCategoryId: LIFE_SUBCATEGORY_ID,
//     message: ""
//   }));
// const [errors, setErrors] = useState<Record<string, string>>({});
//   const [submitting, setSubmitting] = useState(false);
//   const [previewData, setPreviewData] = useState<any>(backendLifeApplicationData);
//   const [showPreview, setShowPreview] = useState(!!backendLifeApplicationData);

//   // If we already have backend data, populate the form
//   useEffect(() => {
//     if (backendLifeApplicationData) {
//       setForm(prev => ({
//         ...prev,
//         age: backendLifeApplicationData.age || 0,
//         height: backendLifeApplicationData.height || 0,
//         weight: backendLifeApplicationData.weight || 0,
//         lifeInsuranceType: backendLifeApplicationData.lifeInsuranceType as "FullLife" | "HalfLife" || "FullLife"
//       }));
//       setPreviewData(backendLifeApplicationData);
//       setShowPreview(true);
//     }
//   }, [backendLifeApplicationData]);

//   const handleChange = (
//     field: keyof LifeInfo,
//     value: string
//   ) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: 
//         field === "age" ||
//         field === "height" ||
//         field === "weight" ||
//         field === "coverageAmount" ||
//         field === "policyTermYears"
//           ? Number(value)
//           : value
//     }));
//     setErrors((prev) => ({ ...prev, [field]: "" }));
//   };

//   const validate = () => {
//     const requiredFields: Array<keyof LifeInfo> = [
//       "age",
//       "height",
//       "weight",
//       "lifeInsuranceType"
//     ];

//     const newErrors: Record<string, string> = {};

//     requiredFields.forEach((field) => {
//       const value = form[field];
//       if (
//         value === "" ||
//         value === undefined ||
//         value === null ||
//         (typeof value === "number" && value <= 0)
//       ) {
//         newErrors[field] = "This field is required";
//       }
//     });

//     // Additional validation for age
//     if (form.age < 18) {
//       newErrors.age = "Minimum age is 18";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handlePreview = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!validate()) return;

//     setSubmitting(true);
//     try {
//       const previewRequest = {
//         CategoryId: form.categoryId!,
//         SubCategoryId: form.subCategoryId!,
//         Age: form.age,
//         Height: form.height,
//         Weight: form.weight,
//         Message: form.message || "string",
//         LifeInsuranceType: form.lifeInsuranceType!
//       };

//       const response = await lifeApiService.previewLifeApplication(previewRequest);
//       setPreviewData(response);
//       setShowPreview(true);
//       setLifeInfo(form); // Save to context
//     } catch (error) {
//       console.error("Preview failed:", error);
//       alert("Failed to get preview. Please check your connection and try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleConfirm = async () => {
//     if (!previewData?.applicationId) return;

//     setSubmitting(true);
//     try {
//       const confirmedData = await lifeApiService.confirmLifeApplication(previewData.applicationId);
//       setBackendLifeApplicationData(confirmedData);
//       setShowPreview(false);

//       // Save calculation totals to main context
//       setCalculationTotals({
//         basePrice: confirmedData.lifePrice || 0,
//         optionalTotal: 0,
//         total: confirmedData.lifePrice || 0
//       });

//       // Navigate to calculation step
//       navigate("/insurance/apply/calculation");
//     } catch (error) {
//       console.error("Confirmation failed:", error);
//       alert("Failed to confirm application. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleBack = () => {
//     setShowPreview(false);
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-10 px-4 md:px-8">
//       <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-green-100 p-6 md:p-10">
//         <StepProgress currentStep={2} />

//         <header className="mb-8">
//           <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">
//             Step 2 of 3
//           </p>
//           <h1 className="text-3xl md:text-4xl font-bold text-green-900 mt-2">
//             Life insurance details
//           </h1>
//           <p className="text-green-700 mt-2">
//             Tell us a bit about the coverage you want and your beneficiary.
//           </p>
//         </header>

//         {!showPreview ? (
//           <form onSubmit={handlePreview} className="space-y-8">
//             {/* Basic Info */}
//             <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {[
//                 {
//                   label: "Age",
//                   field: "age",
//                   type: "number",
//                   min: 18
//                 },
//                 {
//                   label: "Height (cm)",
//                   field: "height",
//                   type: "number"
//                 },
//                 {
//                   label: "Weight (kg)",
//                   field: "weight",
//                   type: "number"
//                 }
//               ].map(({ label, field, type, min }) => (
//                 <div key={field}>
//                   <label className="text-sm font-medium text-green-900 mb-1 block">
//                     {label} *
//                   </label>
//                   <input
//                     type={type}
//                     value={form[field as keyof LifeInfo] as string | number}
//                     onChange={(e) =>
//                       handleChange(
//                         field as keyof LifeInfo,
//                         e.target.value
//                       )
//                     }
//                     min={min}
//                     className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-300"
//                   />
//                   {errors[field] && (
//                     <p className="text-xs text-red-600 mt-1">
//                       {errors[field]}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </section>

//             {/* Life Insurance Type */}
//             <section>
//               <label className="text-sm font-medium text-green-900 mb-1 block">
//                 Life Insurance Type *
//               </label>
//               <div className="flex space-x-4">
//                 {lifeInsuranceTypeOptions.map((type) => (
//                   <button
//                     key={type}
//                     type="button"
//                     onClick={() => handleChange("lifeInsuranceType", type)}
//                     className={`px-6 py-3 rounded-2xl border font-semibold text-sm transition-colors ${
//                       form.lifeInsuranceType === type
//                         ? "bg-green-600 text-white border-green-600"
//                         : "bg-white text-green-700 border-green-200 hover:bg-green-50"
//                     }`}
//                   >
//                     {type === "FullLife" ? "Full Life" : "Half Life"}
//                   </button>
//                 ))}
//               </div>
//               {errors.lifeInsuranceType && (
//                 <p className="text-xs text-red-600 mt-1">
//                   {errors.lifeInsuranceType}
//                 </p>
//               )}
//             </section>

//             {/* Optional Fields */}
//             <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {[
//                 {
//                   label: "Coverage amount (USD)",
//                   field: "coverageAmount",
//                   type: "number"
//                 },
//                 {
//                   label: "Policy term (years)",
//                   field: "policyTermYears",
//                   type: "number"
//                 },
//                 {
//                   label: "Beneficiary name",
//                   field: "beneficiaryName"
//                 }
//               ].map(({ label, field, type }) => (
//                 <div key={field}>
//                   <label className="text-sm font-medium text-green-900 mb-1 block">
//                     {label}
//                   </label>
//                   <input
//                     type={type ?? "text"}
//                     value={
//                       form[field as keyof LifeInfo] as string | number
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         field as keyof LifeInfo,
//                         e.target.value
//                       )
//                     }
//                     className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-300"
//                   />
//                 </div>
//               ))}
//             </section>

//             {/* Dropdowns */}
//             <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="text-sm font-medium text-green-900 mb-1 block">
//                   Beneficiary relation
//                 </label>
//                 <select
//                   value={form.beneficiaryRelation}
//                   onChange={(e) =>
//                     handleChange(
//                       "beneficiaryRelation",
//                       e.target.value
//                     )
//                   }
//                   className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-300"
//                 >
//                   <option value="">Select relation</option>
//                   {relationOptions.map((opt) => (
//                     <option key={opt} value={opt}>
//                       {opt}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-green-900 mb-1 block">
//                   Smoker status
//                 </label>
//                 <select
//                   value={form.smokerStatus}
//                   onChange={(e) =>
//                     handleChange("smokerStatus", e.target.value)
//                   }
//                   className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-300"
//                 >
//                   <option value="">Select option</option>
//                   {smokerOptions.map((opt) => (
//                     <option key={opt} value={opt}>
//                       {opt}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </section>

//             {/* Message */}
//             <div>
//               <label className="text-sm font-medium text-green-900 mb-1 block">
//                 Additional Message (Optional)
//               </label>
//               <textarea
//                 value={form.message}
//                 onChange={(e) => handleChange("message", e.target.value)}
//                 rows={3}
//                 className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-300"
//                 placeholder="Any additional information..."
//               />
//             </div>

//             <div className="flex justify-between">
//               <button
//                 type="button"
//                 onClick={() => navigate("/insurance/apply/personal")}
//                 className="px-6 py-3 rounded-2xl border border-green-200 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors"
//               >
//                 Back to Personal Info
//               </button>
//               <button
//                 type="submit"
//                 className="px-6 py-3 rounded-2xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors"
//                 disabled={submitting}
//               >
//                 {submitting ? "Getting Preview..." : "Get Price Preview"}
//               </button>
//             </div>
//           </form>
//         ) : (
//           // Preview Section
//           <div className="space-y-8">
//             <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
//               <h2 className="text-xl font-bold text-green-900 mb-4">Application Preview</h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <h3 className="text-sm font-medium text-green-700">Personal Information</h3>
//                   <p className="mt-2"><span className="font-semibold">Name:</span> {previewData?.clientFullName}</p>
//                   <p><span className="font-semibold">Age:</span> {previewData?.age}</p>
//                   <p><span className="font-semibold">Height:</span> {previewData?.height} cm</p>
//                   <p><span className="font-semibold">Weight:</span> {previewData?.weight} kg</p>
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-medium text-green-700">Insurance Details</h3>
//                   <p className="mt-2"><span className="font-semibold">Type:</span> {previewData?.lifeInsuranceType}</p>
//                   <p><span className="font-semibold">Category:</span> {previewData?.categoryName}</p>
//                   <p><span className="font-semibold">Sub Category:</span> {previewData?.subCategoryName}</p>
//                   <p className="text-xl font-bold text-green-900 mt-4">
//                     Price: ${previewData?.lifePrice}
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
//                 <p className="text-sm text-yellow-800">{previewData?.message}</p>
//                 <p className="text-xs text-yellow-600 mt-2">Application ID: {previewData?.applicationId}</p>
//               </div>
//             </div>

//             <div className="flex justify-between">
//               <button
//                 type="button"
//                 onClick={handleBack}
//                 className="px-6 py-3 rounded-2xl border border-green-200 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors"
//               >
//                 Back to Edit
//               </button>
//               <button
//                 type="button"
//                 onClick={handleConfirm}
//                 className="px-6 py-3 rounded-2xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors"
//                 disabled={submitting}
//               >
//                 {submitting ? "Confirming..." : "Confirm Application"}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Loading Overlay */}
//       {submitting && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
//             <p className="text-green-800 font-semibold">
//               {showPreview ? "Confirming application..." : "Getting preview..."}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LifeInfoStep;
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import StepProgress from "../../../../reusable/UI/StepProgress";
import { useInsuranceApplication } from "../../../../context/InsuranceApplicationContext";
import { useLifeInsurance, type LifeInfo } from "../../../../context/LifeInsuranceContext";

// Example dropdown options
const smokerOptions = ["No", "Yes"];
const relationOptions = [
  "Spouse",
  "Child",
  "Parent",
  "Sibling",
  "Other"
];
const lifeInsuranceTypeOptions = ["FullLife", "HalfLife"];

// Static category IDs based on your API calls
const LIFE_CATEGORY_ID = "bd189b1b-47a0-4d06-a118-2c0b0bac45ce";
const LIFE_SUBCATEGORY_ID = "5e3e5ee6-3266-4c4d-a3dc-0c1a098d9c8e";

const LifeInfoStep: React.FC = () => {
  const navigate = useNavigate();
  const { personalInfo } = useInsuranceApplication();
  const { lifeInfo: contextLifeInfo, setLifeInfo } = useLifeInsurance();

  // if personal info not filled, bounce back
  if (!personalInfo) {
    return <Navigate to="/insurance/apply/personal" replace />;
  }

  // Initialize form with context data or defaults
  const [form, setForm] = useState<LifeInfo>(() => ({
    age: contextLifeInfo?.age ?? 0,
    height: contextLifeInfo?.height ?? 0,
    weight: contextLifeInfo?.weight ?? 0,
    coverageAmount: contextLifeInfo?.coverageAmount ?? 0,
    beneficiaryName: contextLifeInfo?.beneficiaryName ?? "",
    beneficiaryRelation: contextLifeInfo?.beneficiaryRelation ?? "",
    policyTermYears: contextLifeInfo?.policyTermYears ?? 0,
    smokerStatus: contextLifeInfo?.smokerStatus ?? "",
    lifeInsuranceType: contextLifeInfo?.lifeInsuranceType ?? "FullLife",
    categoryId: LIFE_CATEGORY_ID,
    subCategoryId: LIFE_SUBCATEGORY_ID,
    message: ""
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof LifeInfo, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "age" ||
          field === "height" ||
          field === "weight" ||
          field === "coverageAmount" ||
          field === "policyTermYears"
          ? Number(value)
          : value
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const requiredFields: Array<keyof LifeInfo> = [
      "age",
      "height",
      "weight",
      "lifeInsuranceType"
    ];

    const newErrors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      const value = form[field];
      if (
        value === "" ||
        value === undefined ||
        value === null ||
        (typeof value === "number" && value <= 0)
      ) {
        newErrors[field] = "This field is required";
      }
    });

    // Additional validation for age
    if (form.age < 18) {
      newErrors.age = "Minimum age is 18";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Save life info to context
      setLifeInfo(form);

      // Navigate to calculation step
      navigate("/apply/insurance-calculation");
    } catch (error) {
      console.error("Failed to save life information:", error);
      alert("Failed to save information. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-green-100 p-6 md:p-10">
        <StepProgress currentStep={2} insuranceType="life" />

        <header className="mb-8">
          <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">
            Step 2 of 3
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 mt-2">
            Life Insurance Details
          </h1>
          <p className="text-green-700 mt-2">
            Provide your life insurance details to proceed.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Age",
                field: "age",
                type: "number",
                min: 18
              },
              {
                label: "Height (cm)",
                field: "height",
                type: "number"
              },
              {
                label: "Weight (kg)",
                field: "weight",
                type: "number"
              }
            ].map(({ label, field, type, min }) => (
              <div key={field}>
                <label className="text-sm font-medium text-green-900 mb-1 block">
                  {label} *
                </label>
                <input
                  type={type}
                  value={form[field as keyof LifeInfo] as string | number}
                  onChange={(e) => handleChange(field as keyof LifeInfo, e.target.value)}
                  min={min}
                  className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-300"
                />
                {errors[field] && (
                  <p className="text-xs text-red-600 mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
          </section>

          {/* Life Insurance Type */}
          <section>
            <label className="text-sm font-medium text-green-900 mb-1 block">
              Life Insurance Type *
            </label>
            <div className="flex space-x-4">
              {lifeInsuranceTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange("lifeInsuranceType", type)}
                  className={`px-6 py-3 rounded-2xl border font-semibold text-sm transition-colors ${form.lifeInsuranceType === type
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-green-700 border-green-200 hover:bg-green-50"
                    }`}
                >
                  {type === "FullLife" ? "Full Life" : "Half Life"}
                </button>
              ))}
            </div>
            {errors.lifeInsuranceType && (
              <p className="text-xs text-red-600 mt-1">{errors.lifeInsuranceType}</p>
            )}
          </section>

          {/* Optional Fields */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: "Coverage amount (USD)",
                field: "coverageAmount",
                type: "number"
              },
              {
                label: "Policy term (years)",
                field: "policyTermYears",
                type: "number"
              },
              {
                label: "Beneficiary name",
                field: "beneficiaryName"
              }
            ].map(({ label, field, type }) => (
              <div key={field}>
                <label className="text-sm font-medium text-green-900 mb-1 block">
                  {label}
                </label>
                <input
                  type={type ?? "text"}
                  value={form[field as keyof LifeInfo] as string | number}
                  onChange={(e) => handleChange(field as keyof LifeInfo, e.target.value)}
                  className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-300"
                />
              </div>
            ))}
          </section>

          {/* Dropdowns */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-green-900 mb-1 block">
                Beneficiary relation
              </label>
              <select
                value={form.beneficiaryRelation}
                onChange={(e) => handleChange("beneficiaryRelation", e.target.value)}
                className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-300"
              >
                <option value="">Select relation</option>
                {relationOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-green-900 mb-1 block">
                Smoker status
              </label>
              <select
                value={form.smokerStatus}
                onChange={(e) => handleChange("smokerStatus", e.target.value)}
                className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-300"
              >
                <option value="">Select option</option>
                {smokerOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-green-900 mb-1 block">
              Additional Message (Optional)
            </label>
            <textarea
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              rows={3}
              className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-300"
              placeholder="Any additional information..."
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/insurance/apply/personal")}
              className="px-6 py-3 rounded-2xl border border-green-200 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors"
            >
              Back to Personal Info
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Continue to Calculation"}
            </button>
          </div>
        </form>
      </div>

      {/* Loading Overlay */}
      {submitting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
            <p className="text-green-800 font-semibold">Saving information...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LifeInfoStep;