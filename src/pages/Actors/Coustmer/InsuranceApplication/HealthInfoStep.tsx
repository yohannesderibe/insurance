import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import StepProgress from "../../../../reusable/UI/StepProgress";
import {
  useInsuranceApplication,
  type HealthInfo
} from "../../../../context/InsuranceApplicationContext";

// Example dropdown options — adjust to your plan offerings
const planOptions = ["Basic", "Standard", "Premium"];
const conditionOptions = [
  "None",
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Other"
];

const HealthInfoStep: React.FC = () => {
  const navigate = useNavigate();
  const { healthInfo, setHealthInfo, personalInfo } =
    useInsuranceApplication();

  if (!personalInfo) {
    return <Navigate to="/insurance/apply/personal" replace />;
  }

  const [form, setForm] = useState<HealthInfo>({
    coveragePlan: healthInfo?.coveragePlan ?? "",
    monthlyPremium: healthInfo?.monthlyPremium ?? 0,
    preExistingCondition: healthInfo?.preExistingCondition ?? "",
    // add more fields here if your HealthInfo type expands
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    field: keyof HealthInfo,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "monthlyPremium"
          ? Number(value)
          : value
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const requiredFields: Array<keyof HealthInfo> = [
      "coveragePlan",
      "monthlyPremium",
      "preExistingCondition"
    ];
    const newErrors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      const value = form[field];
      if (
        value === "" ||
        value === undefined ||
        value === null ||
        (field === "monthlyPremium" &&
          Number(form.monthlyPremium) <= 0)
      ) {
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
      setHealthInfo(form);
      setSubmitting(false);
      navigate("/insurance/apply/calculation");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-purple-100 p-6 md:p-10">
        <StepProgress currentStep={2} />

        <header className="mb-8">
          <p className="text-sm text-purple-600 font-semibold uppercase tracking-wide">
            Step 2 of 3
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mt-2">
            Health insurance details
          </h1>
          <p className="text-purple-700 mt-2">
            Select your plan and share basic health info so we can tailor the quote.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* dropdown + numeric */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-purple-900 mb-1 block">
                Coverage plan *
              </label>
              <select
                value={form.coveragePlan}
                onChange={(e) =>
                  handleChange("coveragePlan", e.target.value)
                }
                className="w-full border border-purple-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-300"
              >
                <option value="">Select plan</option>
                {planOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.coveragePlan && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.coveragePlan}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-purple-900 mb-1 block">
                Monthly premium (USD) *
              </label>
              <input
                type="number"
                value={form.monthlyPremium}
                onChange={(e) =>
                  handleChange("monthlyPremium", e.target.value)
                }
                className="w-full border border-purple-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-300"
              />
              {errors.monthlyPremium && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.monthlyPremium}
                </p>
              )}
            </div>
          </section>

          {/* another dropdown */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-purple-900 mb-1 block">
                Pre-existing condition *
              </label>
              <select
                value={form.preExistingCondition}
                onChange={(e) =>
                  handleChange(
                    "preExistingCondition",
                    e.target.value
                  )
                }
                className="w-full border border-purple-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-300"
              >
                <option value="">Select condition</option>
                {conditionOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.preExistingCondition && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.preExistingCondition}
                </p>
              )}
            </div>
          </section>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/insurance/apply/personal")}
              className="px-6 py-3 rounded-2xl border border-purple-200 text-purple-700 font-semibold text-sm hover:bg-purple-50 transition-colors"
            >
              Back to Personal Info
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 transition-colors"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
            <p className="text-purple-800 font-semibold">
              Saving health insurance details...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthInfoStep;
