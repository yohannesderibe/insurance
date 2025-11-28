import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import StepProgress from "../../../../reusable/UI/StepProgress";
import { useInsuranceApplication } from "../../../../context/InsuranceApplicationContext";
import { DollarSign, ShieldCheck, Hexagon, CheckCircle2 } from "lucide-react";

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
    setCalculationTotals
  } = useInsuranceApplication();
  const [sendingToFinance, setSendingToFinance] = useState(false);

  if (!personalInfo) {
    return <Navigate to="/insurance/apply/personal" replace />;
  }

  if (!carInfo) {
    return <Navigate to="/insurance/apply/car" replace />;
  }

  const basePrice = Math.round((carInfo.marketPrice || 0) * 0.025);

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

  const handleContinue = () => {
    setSendingToFinance(true);
    setTimeout(() => {
      setCalculationTotals({
        basePrice,
        optionalTotal,
        total
      });
      setSendingToFinance(false);
      navigate("/insurance/apply/review");
    }, 1200);
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="border border-[#FFE082] rounded-2xl p-6 space-y-4 bg-white">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#FFC107]" />
                <h2 className="text-lg font-semibold text-[#000000]">Personal Summary</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#4E342E]">
                <div>
                  <p className="font-semibold">Applicant</p>
                  <p>{personalInfo.fullName}</p>
                </div>
                <div>
                  <p className="font-semibold">Contact</p>
                  <p>{personalInfo.phoneNumber}</p>
                  <p>{personalInfo.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Category</p>
                  <p>{personalInfo.categoryName ?? "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold">Subcategory</p>
                  <p>{personalInfo.subCategoryName ?? "N/A"}</p>
                </div>
              </div>
            </section>

            <section className="border border-[#FFE082] rounded-2xl p-6 space-y-4 bg-white">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#FFC107]" />
                <h2 className="text-lg font-semibold text-[#000000]">Car Summary</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#4E342E]">
                <div>
                  <p className="font-semibold">Car Model</p>
                  <p>
                    {carInfo.carName} – {carInfo.modelNumber}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Car Type & Fuel</p>
                  <p>
                    {carInfo.carType} / {carInfo.fuelType}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Registration</p>
                  <p>{carInfo.registrationNumber}</p>
                </div>
                <div>
                  <p className="font-semibold">Engine & Chassis</p>
                  <p>
                    {carInfo.engineNumber} / {carInfo.chassisNumber}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Market Price</p>
                  <p>${carInfo.marketPrice.toLocaleString()}</p>
                </div>
              </div>
            </section>

            <section className="border border-[#FFE082] rounded-2xl p-6 space-y-4 bg-white">
              <div className="flex items-center gap-3">
                <Hexagon className="w-5 h-5 text-[#FFC107]" />
                <h2 className="text-lg font-semibold text-[#000000]">Optional Coverages</h2>
              </div>
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

          <aside className="border border-[#FFC107] rounded-2xl p-6 space-y-5 bg-[#FFF8E1]">
            <div className="flex items-center gap-2 text-[#000000]">
              <DollarSign className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Insurance Calculation</h3>
            </div>
            <div className="space-y-3 text-sm text-[#4E342E]">
              <div className="flex justify-between">
                <span>Base Price (2.5% of market)</span>
                <strong>${basePrice.toLocaleString()}</strong>
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

