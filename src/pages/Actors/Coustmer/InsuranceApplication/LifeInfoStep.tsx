import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import StepProgress from "../../../../reusable/UI/StepProgress";
import {
  useInsuranceApplication,
  type LifeInfo
} from "../../../../context/InsuranceApplicationContext";

// Example dropdown options — adjust as needed
const smokerOptions = ["No", "Yes"];
const relationOptions = [
  "Spouse",
  "Child",
  "Parent",
  "Sibling",
  "Other"
];

const LifeInfoStep: React.FC = () => {
  const navigate = useNavigate();
  const { lifeInfo, setLifeInfo, personalInfo } = useInsuranceApplication();

  // if personal info not filled, bounce back
  if (!personalInfo) {
    return <Navigate to="/insurance/apply/personal" replace />;
  }

  const [form, setForm] = useState<LifeInfo>({
    coverageAmount: lifeInfo?.coverageAmount ?? 0,
    beneficiaryName: lifeInfo?.beneficiaryName ?? "",
    beneficiaryRelation: lifeInfo?.beneficiaryRelation ?? "",
    policyTermYears: lifeInfo?.policyTermYears ?? 0,
    smokerStatus: lifeInfo?.smokerStatus ?? "",
    // add more fields here if your LifeInfo type expands
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    field: keyof LifeInfo,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "coverageAmount" ||
        field === "policyTermYears"
          ? Number(value)
          : value
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const requiredFields: Array<keyof LifeInfo> = [
      "coverageAmount",
      "beneficiaryName",
      "beneficiaryRelation",
      "policyTermYears",
      "smokerStatus"
    ];
    const newErrors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      const value = form[field];
      if (
        value === "" ||
        value === undefined ||
        value === null ||
        (field === "coverageAmount" &&
          Number(form.coverageAmount) <= 0) ||
        (field === "policyTermYears" &&
          Number(form.policyTermYears) <= 0)
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
      setLifeInfo(form);
      setSubmitting(false);
      // proceed to next step — adjust route as your flow requires
      navigate("/insurance/apply/calculation");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-green-100 p-6 md:p-10">
        {/* assuming life uses also step 2 of 3; change if different */}
        <StepProgress currentStep={2} />

        <header className="mb-8">
          <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">
            Step 2 of 3
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 mt-2">
            Life insurance details
          </h1>
          <p className="text-green-700 mt-2">
            Tell us a bit about the coverage you want and your beneficiary.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* numeric + text fields */}
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
                  {label} *
                </label>
                <input
                  type={type ?? "text"}
                  value={
                    form[field as keyof LifeInfo] as string | number
                  }
                  onChange={(e) =>
                    handleChange(
                      field as keyof LifeInfo,
                      e.target.value
                    )
                  }
                  className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-300"
                />
                {errors[field] && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}
          </section>

          {/* dropdowns */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-green-900 mb-1 block">
                Beneficiary relation *
              </label>
              <select
                value={form.beneficiaryRelation}
                onChange={(e) =>
                  handleChange(
                    "beneficiaryRelation",
                    e.target.value
                  )
                }
                className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-300"
              >
                <option value="">Select relation</option>
                {relationOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.beneficiaryRelation && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.beneficiaryRelation}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-green-900 mb-1 block">
                Smoker status *
              </label>
              <select
                value={form.smokerStatus}
                onChange={(e) =>
                  handleChange("smokerStatus", e.target.value)
                }
                className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-300"
              >
                <option value="">Select option</option>
                {smokerOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.smokerStatus && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.smokerStatus}
                </p>
              )}
            </div>
          </section>

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
              {submitting ? "Processing..." : "Continue to Calculation"}
            </button>
          </div>
        </form>
      </div>

      {/* generic overlay reused from CarInfoStep */}
      {submitting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
            <p className="text-green-800 font-semibold">
              Saving life insurance details...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LifeInfoStep;
