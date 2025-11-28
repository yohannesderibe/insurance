import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { getCustomerCategories } from "../../../../api/Coustomer/Catagory/customerCategoryApi";
// import { getSubcategoriesByCategory } from "../../../../api/Coustomer/Catagory/customerSubcategoryApi";

import { getCustomerCategories, getSubcategoriesByCategory } from "../../../../api/Coustomer/BeforeFinanceORWillchange/customerGetCategoryAndSub";

import StepProgress from "../../../../reusable/UI/StepProgress";
import { useInsuranceApplication, type PersonalInfo } from "../../../../context/InsuranceApplicationContext";

type RemoteCategory = { id?: string | number; name?: string; categoryName?: string };
type RemoteSubCategory = { id?: string | number; name?: string };

interface CategoryOption {
  id: string;
  name: string;
}

const genders = ["Male", "Female", "Other"];
const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"];

const PersonalInfoStep: React.FC = () => {
  const navigate = useNavigate();
  const { setPersonalInfo, personalInfo } = useInsuranceApplication();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryOption[]>([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [documents, setDocuments] = useState<File[]>(personalInfo?.documents ?? []);

  const [form, setForm] = useState<PersonalInfo>(() => ({
    fullName: personalInfo?.fullName ?? "",
    fathersName: personalInfo?.fathersName ?? "",
    grandfathersName: personalInfo?.grandfathersName ?? "",
    dateOfBirth: personalInfo?.dateOfBirth ?? "",
    gender: personalInfo?.gender ?? "",
    phoneNumber: personalInfo?.phoneNumber ?? "",
    email: personalInfo?.email ?? "",
    address: personalInfo?.address ?? "",
    nationalId: personalInfo?.nationalId ?? "",
    maritalStatus: personalInfo?.maritalStatus ?? "",
    occupation: personalInfo?.occupation ?? "",
    categoryId: personalInfo?.categoryId ?? "",
    categoryName: personalInfo?.categoryName,
    subCategoryId: personalInfo?.subCategoryId ?? "",
    subCategoryName: personalInfo?.subCategoryName,
    documents: personalInfo?.documents ?? []
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const data = await getCustomerCategories();
      setCategories(
        data.map((cat: RemoteCategory) => ({
          id: cat.id ?? String(cat.id),
          name: cat.name ?? cat.categoryName ?? "Unnamed Category"
        }))
      );
    })();
  }, []);

  useEffect(() => {
    if (!form.categoryId) {
      setSubCategories([]);
      return;
    }

    (async () => {
      setLoadingSubCategories(true);
      const data = await getSubcategoriesByCategory(form.categoryId);
      setSubCategories(
        data.map((sub: RemoteSubCategory) => ({
          id: sub.id ?? String(sub.id),
          name: sub.name ?? "Unnamed Subcategory"
        }))
      );
      setLoadingSubCategories(false);
    })();
  }, [form.categoryId]);

  const requiredFields: Array<keyof PersonalInfo> = [
    "fullName",
    "fathersName",
    "grandfathersName",
    "dateOfBirth",
    "gender",
    "phoneNumber",
    "email",
    "address",
    "nationalId",
    "maritalStatus",
    "occupation",
    // "categoryId",
    // "subCategoryId"
  ];

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    setDocuments(files);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      if (!form[field] || String(form[field]).trim() === "") {
        newErrors[field] = "This field is required";
      }
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (form.phoneNumber && form.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Phone number must be at least 10 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setTimeout(() => {
      setPersonalInfo({
        ...form,
        categoryName: categories.find((c) => c.id === form.categoryId)?.name,
        subCategoryName: subCategories.find((s) => s.id === form.subCategoryId)?.name,
        documents
      });
      setSubmitting(false);
      navigate("/insurance/apply/car");
    }, 1200);
  };

  const documentPreview = useMemo(() => {
    if (documents.length === 0) return "No files chosen.";
    return `${documents.length} file(s) selected.`;
  }, [documents]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-amber-100 p-6 md:p-10">
        <StepProgress currentStep={1} />

        <header className="mb-8">
          <p className="text-sm text-amber-600 font-semibold uppercase tracking-wide">Step 1 of 3</p>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mt-2">Personal Information</h1>
          <p className="text-amber-700 mt-2">
            Select a category & subcategory, then provide personal details to begin your insurance application.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-amber-800 mb-1 block">Category *</label>
              <select
                value={form.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value)}
                className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-red-600 mt-1">{errors.categoryId}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-amber-800 mb-1 block">Subcategory *</label>
              <select
                value={form.subCategoryId}
                onChange={(e) => handleChange("subCategoryId", e.target.value)}
                disabled={!form.categoryId || loadingSubCategories}
                className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300 disabled:bg-amber-50 disabled:text-amber-400"
              >
                <option value="">{loadingSubCategories ? "Loading..." : "Select subcategory"}</option>
                {subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              {errors.subCategoryId && <p className="text-xs text-red-600 mt-1">{errors.subCategoryId}</p>}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Full Name", field: "fullName" },
              { label: "Father's Name", field: "fathersName" },
              { label: "Grandfather's Name", field: "grandfathersName" },
              { label: "Date of Birth", field: "dateOfBirth", type: "date" },
              { label: "Phone Number", field: "phoneNumber" },
              { label: "Email", field: "email", type: "email" },
              { label: "Address", field: "address" },
              { label: "National ID / Passport Number", field: "nationalId" },
              { label: "Occupation", field: "occupation" }
            ].map(({ label, field, type }) => (
              <div key={field}>
                <label className="text-sm font-medium text-amber-800 mb-1 block">{label} *</label>
                <input
                  type={type ?? "text"}
                  value={form[field as keyof PersonalInfo] as string}
                  onChange={(e) => handleChange(field as keyof PersonalInfo, e.target.value)}
                  className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300"
                />
                {errors[field] && <p className="text-xs text-red-600 mt-1">{errors[field]}</p>}
              </div>
            ))}

            <div>
              <label className="text-sm font-medium text-amber-800 mb-1 block">Gender *</label>
              <div className="flex flex-wrap gap-3">
                {genders.map((gender) => (
                  <button
                    type="button"
                    key={gender}
                    onClick={() => handleChange("gender", gender)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                      form.gender === gender
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-amber-200 text-amber-600"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
              {errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-amber-800 mb-1 block">Marital Status *</label>
              <select
                value={form.maritalStatus}
                onChange={(e) => handleChange("maritalStatus", e.target.value)}
                className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300"
              >
                <option value="">Select status</option>
                {maritalStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.maritalStatus && <p className="text-xs text-red-600 mt-1">{errors.maritalStatus}</p>}
            </div>
          </section>

          <section className="space-y-3">
            <label className="text-sm font-medium text-amber-800 block">Supporting Documents</label>
            <p className="text-sm text-amber-600">
              Upload identification documents, driving license, car ownership papers, etc.
            </p>
            <label className="border-2 border-dashed border-amber-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400 transition-colors">
              <span className="text-amber-800 font-semibold mb-1">Click or drag files to upload</span>
              <span className="text-sm text-amber-600">{documentPreview}</span>
              <input type="file" multiple className="hidden" onChange={handleFileChange} />
            </label>
            {documents.length > 0 && (
              <ul className="text-sm text-amber-800 space-y-1">
                {documents.map((file) => (
                  <li key={file.name}>• {file.name}</li>
                ))}
              </ul>
            )}
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-colors"
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Continue to Car Information"}
            </button>
          </div>
        </form>
      </div>

      {submitting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
            <p className="text-amber-800 font-semibold">Saving information...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoStep;

