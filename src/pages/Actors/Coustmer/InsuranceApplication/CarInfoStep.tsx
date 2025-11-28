import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import StepProgress from "../../../../reusable/UI/StepProgress";
import { useInsuranceApplication, type CarInfo } from "../../../../context/InsuranceApplicationContext";

const carTypes = ["SUV", "Sedan", "Hatchback", "Pickup", "Van", "Coupe", "Convertible"];
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];

const CarInfoStep: React.FC = () => {
  const navigate = useNavigate();
  const { carInfo, setCarInfo, personalInfo } = useInsuranceApplication();

  if (!personalInfo) {
    return <Navigate to="/insurance/apply/personal" replace />;
  }

  const [form, setForm] = useState<CarInfo>({
    carName: carInfo?.carName ?? "",
    modelNumber: carInfo?.modelNumber ?? "",
    carType: carInfo?.carType ?? "",
    fuelType: carInfo?.fuelType ?? "",
    yearOfManufacture: carInfo?.yearOfManufacture ?? "",
    registrationNumber: carInfo?.registrationNumber ?? "",
    engineNumber: carInfo?.engineNumber ?? "",
    chassisNumber: carInfo?.chassisNumber ?? "",
    marketPrice: carInfo?.marketPrice ?? 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof CarInfo, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "marketPrice" ? Number(value) : value
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const requiredFields: Array<keyof CarInfo> = [
      "carName",
      "modelNumber",
      "carType",
      "fuelType",
      "yearOfManufacture",
      "registrationNumber",
      "engineNumber",
      "chassisNumber",
      "marketPrice"
    ];
    const newErrors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      if (!form[field] || (field === "marketPrice" && Number(form.marketPrice) <= 0)) {
        newErrors[field] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!personalInfo) {
      alert("Please complete the personal information step first.");
      navigate("/insurance/apply/personal");
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    setTimeout(() => {
      setCarInfo(form);
      setSubmitting(false);
      navigate("/insurance/apply/calculation");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-blue-100 p-6 md:p-10">
        <StepProgress currentStep={2} />

        <header className="mb-8">
          <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide">Step 2 of 3</p>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mt-2">Car Information</h1>
          <p className="text-blue-700 mt-2">
            Provide vehicle details to help us calculate precise insurance coverage.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Car Name", field: "carName" },
              { label: "Model Number", field: "modelNumber" },
              { label: "Year of Manufacture", field: "yearOfManufacture", type: "number" },
              { label: "Registration Number", field: "registrationNumber" },
              { label: "Engine Number", field: "engineNumber" },
              { label: "Chassis Number", field: "chassisNumber" },
              { label: "Car Market Price (USD)", field: "marketPrice", type: "number" }
            ].map(({ label, field, type }) => (
              <div key={field}>
                <label className="text-sm font-medium text-blue-900 mb-1 block">{label} *</label>
                <input
                  type={type ?? "text"}
                  value={form[field as keyof CarInfo] as string | number}
                  onChange={(e) => handleChange(field as keyof CarInfo, e.target.value)}
                  className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-300"
                />
                {errors[field] && <p className="text-xs text-red-600 mt-1">{errors[field]}</p>}
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-blue-900 mb-1 block">Car Type *</label>
              <select
                value={form.carType}
                onChange={(e) => handleChange("carType", e.target.value)}
                className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Select car type</option>
                {carTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.carType && <p className="text-xs text-red-600 mt-1">{errors.carType}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-blue-900 mb-1 block">Fuel Type *</label>
              <select
                value={form.fuelType}
                onChange={(e) => handleChange("fuelType", e.target.value)}
                className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Select fuel type</option>
                {fuelTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.fuelType && <p className="text-xs text-red-600 mt-1">{errors.fuelType}</p>}
            </div>
          </section>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/insurance/apply/personal")}
              className="px-6 py-3 rounded-2xl border border-blue-200 text-blue-700 font-semibold text-sm hover:bg-blue-50 transition-colors"
            >
              Back to Personal Info
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Continue to Calculation"}
            </button>
          </div>
        </form>
      </div>

      {submitting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            <p className="text-blue-800 font-semibold">Saving car details...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarInfoStep;

