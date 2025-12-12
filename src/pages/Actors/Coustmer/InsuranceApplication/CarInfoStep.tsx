import React, { useState, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import StepProgress from "../../../../reusable/UI/StepProgress";
import { useInsuranceApplication, type CarInfo } from "../../../../context/InsuranceApplicationContext";
import { useAuth } from "../../../../context/AuthContext";
import { previewMotorInsurance } from "../../../../api/Coustomer/applications/motorInsuranceApi";

// Correct insurance type values from backend API
const insuranceTypeOptions = [
  { value: "Full", label: "Full Insurance" },
  { value: "ThirdParty", label: "Third Party" },
];

const CarInfoStep: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    carInfo,
    setCarInfo,
    personalInfo,
    setBackendApplicationData
  } = useInsuranceApplication();
  const { user } = useAuth();

  // if (!personalInfo) {
  //   return <Navigate to="/apply/personal-info" replace />;
  // }
  const hasRequiredPersonalInfo = () => {
    if (!personalInfo) return false;

    // Check for the most critical fields
    const requiredFields = [
      'categoryId',
      'subCategoryId',
      'fullName',
      'email'
    ];

    return requiredFields.every(field =>
      personalInfo[field as keyof typeof personalInfo] &&
      String(personalInfo[field as keyof typeof personalInfo]).trim() !== ''
    );
  };

  // Redirect if no personal info
  if (!hasRequiredPersonalInfo()) {
    console.log("Redirecting: Missing personal info", personalInfo);
    return <Navigate to="/apply/personal-info" replace state={{ from: location.pathname }} />;
  }
  // Update form state to include all backend fields
  const [form, setForm] = useState({
    categoryId: personalInfo.categoryId || "",
    subCategoryId: personalInfo.subCategoryId || "",
    model: carInfo?.modelNumber ?? "",
    plateNumber: carInfo?.registrationNumber ?? "",
    yearOfManufacture: carInfo?.yearOfManufacture ?? "",
    engineNumber: carInfo?.engineNumber ?? "",
    chassisNumber: carInfo?.chassisNumber ?? "",
    insuranceType: carInfo?.insuranceType || ""
  });

  useEffect(() => {
    console.log("CarInfoStep mounted with personalInfo:", personalInfo);
    console.log("CarInfoStep mounted with carInfo:", carInfo);
  }, []);

  // Add state for file uploads
  const [carImage, setCarImage] = useState<File | null>(null);
  const [carLibreImage, setCarLibreImage] = useState<File | null>(null);
  const [previewCarImage, setPreviewCarImage] = useState<string>("");
  const [previewCarLibreImage, setPreviewCarLibreImage] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const requiredFields = [
      "model",
      "plateNumber",
      "yearOfManufacture",
      "engineNumber",
      "chassisNumber",
      "insuranceType"
    ];

    const newErrors: Record<string, string> = {};

    // Validate text fields
    requiredFields.forEach((field) => {
      if (!form[field as keyof typeof form] || String(form[field as keyof typeof form]).trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    // Validate file uploads
    if (!carImage) {
      newErrors.carImage = "Car image is required";
    }

    if (!carLibreImage) {
      newErrors.carLibreImage = "Car libre image is required";
    }

    // Validate year is a valid number
    if (form.yearOfManufacture && (Number(form.yearOfManufacture) < 1900 || Number(form.yearOfManufacture) > new Date().getFullYear() + 1)) {
      newErrors.yearOfManufacture = `Please enter a valid year between 1900 and ${new Date().getFullYear() + 1}`;
    }

    // Validate insurance type is one of the valid values
    if (form.insuranceType && !["Full", "ThirdParty"].includes(form.insuranceType)) {
      newErrors.insuranceType = "Please select a valid insurance type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);

      // Prepare FormData matching exactly the backend API
      const formData = new FormData();

      // Make sure category and subcategory IDs are valid UUIDs
      if (!personalInfo.categoryId || !personalInfo.subCategoryId) {
        alert("Please go back and select a valid category and subcategory.");
        return;
      }

      // Append all fields including files
      formData.append("CategoryId", personalInfo.categoryId);
      formData.append("SubCategoryId", personalInfo.subCategoryId);
      formData.append("Model", form.model.trim());
      formData.append("PlateNumber", form.plateNumber.trim());
      formData.append("YearOfManufacture", form.yearOfManufacture);
      formData.append("EngineNumber", form.engineNumber.trim());
      formData.append("ChassisNumber", form.chassisNumber.trim());
      formData.append("InsuranceType", form.insuranceType);

      // Append files - these field names must match the backend exactly
      if (carImage) {
        formData.append("CarImage", carImage);
      }
      if (carLibreImage) {
        formData.append("CarLibreImage", carLibreImage);
      }

      console.log("Submitting FormData to /apply/motor:");
      for (const pair of formData.entries()) {
        const key = pair[0];
        const value = pair[1];
        // Don't log file content, just file info
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      // Use the API function instead of fetch directly
      const backendData = await previewMotorInsurance(formData);
      console.log("Backend API Response:", backendData);

      // Save the backend response to context
      setBackendApplicationData(backendData);

      // Save car info in context
      setCarInfo({
        modelNumber: form.model,
        registrationNumber: form.plateNumber,
        yearOfManufacture: form.yearOfManufacture,
        engineNumber: form.engineNumber,
        chassisNumber: form.chassisNumber,
        // Add fields needed for backend
        categoryId: personalInfo.categoryId,
        subCategoryId: personalInfo.subCategoryId,
        model: form.model,
        plateNumber: form.plateNumber,
        insuranceType: form.insuranceType as "Full" | "ThirdParty" | "",
        // Add file URLs from response if available
        carImageUrl: backendData.carImageUrl,
        carLibreImageUrl: backendData.carLibreImageUrl
      });

      navigate("/apply/insurance-calculation");
    } catch (error: any) {
      // Error handling is already done in the API function
      console.error("Error in CarInfoStep:", error);
      // The error message from applyMotorInsurance is already user-friendly
      alert(error.message || "Failed to submit car information. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-blue-100 p-6 md:p-10">
        <StepProgress currentStep={2} insuranceType="motor" />

        <header className="mb-8">
          <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide">Step 2 of 3</p>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mt-2">Car Information</h1>
          <p className="text-blue-700 mt-2">
            Provide vehicle details to proceed with your insurance application.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text fields */}
            {[
              {
                label: "Model",
                field: "model",
                type: "text",
                placeholder: "e.g., Camry, Corolla, bz4x",
                description: "Vehicle model name (exact model name)"
              },
              {
                label: "Plate Number",
                field: "plateNumber",
                type: "text",
                placeholder: "e.g., AA123BB",
                description: "Vehicle registration plate"
              },
              {
                label: "Year of Manufacture",
                field: "yearOfManufacture",
                type: "number",
                placeholder: "e.g., 2020",
                description: "Year the vehicle was made",
                min: 1900,
                max: new Date().getFullYear() + 1
              },
              {
                label: "Engine Number",
                field: "engineNumber",
                type: "text",
                placeholder: "Engine identification number"
              },
              {
                label: "Chassis Number",
                field: "chassisNumber",
                type: "text",
                placeholder: "Chassis identification number"
              },
            ].map(({ label, field, type, placeholder, description, min, max }) => (
              <div key={field}>
                <label className="text-sm font-medium text-blue-900 mb-1 block">
                  {label} *
                  {description && <span className="text-xs text-blue-500 ml-2">({description})</span>}
                </label>
                <input
                  type={type}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-300"
                  placeholder={placeholder}
                  min={min}
                  max={max}
                />
                {errors[field] && <p className="text-xs text-red-600 mt-1">{errors[field]}</p>}
              </div>
            ))}

            {/* Insurance Type Select */}
            <div>
              <label className="text-sm font-medium text-blue-900 mb-1 block">
                Insurance Type *
                <span className="text-xs text-blue-500 ml-2">(Type of coverage)</span>
              </label>
              <select
                value={form.insuranceType}
                onChange={(e) => handleChange("insuranceType", e.target.value)}
                className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Select insurance type</option>
                {insuranceTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.insuranceType && <p className="text-xs text-red-600 mt-1">{errors.insuranceType}</p>}
            </div>
          </section>

          {/* File Upload Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-blue-900 border-b border-blue-200 pb-2">
              Vehicle Images
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Car Image Upload */}
              <div>
                <label className="text-sm font-medium text-blue-900 mb-1 block">
                  Car Image *
                  <span className="text-xs text-blue-500 ml-2">(Clear photo of the vehicle)</span>
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    name="carImage"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setCarImage, setPreviewCarImage)}
                    className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {previewCarImage && (
                    <div className="mt-2">
                      <p className="text-xs text-blue-600 mb-1">Preview:</p>
                      <img
                        src={previewCarImage}
                        alt="Car preview"
                        className="w-full h-48 object-cover rounded-lg border border-blue-200"
                      />
                    </div>
                  )}
                  {errors.carImage && <p className="text-xs text-red-600 mt-1">{errors.carImage}</p>}
                </div>
              </div>

              {/* Car Libre Image Upload */}
              <div>
                <label className="text-sm font-medium text-blue-900 mb-1 block">
                  Car Libre Image *
                  <span className="text-xs text-blue-500 ml-2">(Vehicle registration document)</span>
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    name="carLibreImage"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setCarLibreImage, setPreviewCarLibreImage)}
                    className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {previewCarLibreImage && (
                    <div className="mt-2">
                      <p className="text-xs text-blue-600 mb-1">Preview:</p>
                      <img
                        src={previewCarLibreImage}
                        alt="Car libre preview"
                        className="w-full h-48 object-cover rounded-lg border border-blue-200"
                      />
                    </div>
                  )}
                  {errors.carLibreImage && <p className="text-xs text-red-600 mt-1">{errors.carLibreImage}</p>}
                </div>
              </div>
            </div>

            {/* File upload instructions */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">📸 Image Requirements:</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• <strong>Car Image:</strong> A clear, well-lit photo showing the entire vehicle</li>
                <li>• <strong>Car Libre Image:</strong> Photo of your vehicle registration document</li>
                <li>• Supported formats: JPG, JPEG, PNG</li>
                <li>• Maximum file size: 5MB per image</li>
                <li className="text-green-600 font-medium">Both images are required for insurance processing</li>
              </ul>
            </div>
          </section>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/apply/personal-info")}
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