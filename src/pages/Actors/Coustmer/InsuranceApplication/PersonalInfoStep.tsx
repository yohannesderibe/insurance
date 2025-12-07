import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerCategories, getSubcategoriesByCategory } from "../../../../api/Coustomer/BeforeFinanceORWillchange/customerGetCategoryAndSub";
import { getClientProfile } from "../../../../api/Coustomer/GetInfo/clientApi";
import StepProgress from "../../../../reusable/UI/StepProgress";
import { useInsuranceApplication, type PersonalInfo } from "../../../../context/InsuranceApplicationContext";
import { useAuth } from "../../../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";

type RemoteCategory = { id?: string | number; name?: string; categoryName?: string };
type RemoteSubCategory = { id?: string | number; name?: string };

interface CategoryOption {
  id: string;
  name: string;
}

interface ClientProfile {
  id: string;
  firstName: string;
  fatherName: string;
  grandFatherName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  region: string;
  city: string;
  subCity: string;
  nationalIdOrPassport: string;
  createdAt: string;
}

const genders = ["Male", "Female"]; // Only Male/Female from backend

const PersonalInfoStep: React.FC = () => {
  const navigate = useNavigate();
  const { setPersonalInfo, personalInfo } = useInsuranceApplication();
  const { user } = useAuth();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryOption[]>([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [documents, setDocuments] = useState<File[]>(personalInfo?.documents ?? []);

  // Update PersonalInfo interface to match backend
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
    categoryId: personalInfo?.categoryId ?? "",
    categoryName: personalInfo?.categoryName,
    subCategoryId: personalInfo?.subCategoryId ?? "",
    subCategoryName: personalInfo?.subCategoryName,
    documents: personalInfo?.documents ?? []
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch client profile data
  useEffect(() => {
    const fetchClientProfile = async () => {
      setLoadingProfile(true);
      try {
        const profile = await getClientProfile();
        setClientProfile(profile);
        
        // Pre-fill form with profile data (exact field matching)
        setForm(prev => ({
          ...prev,
          fullName: profile.firstName,
          fathersName: profile.fatherName,
          grandfathersName: profile.grandFatherName,
          dateOfBirth: profile.dateOfBirth.split('T')[0], // Remove time part
          gender: profile.gender,
          phoneNumber: profile.phoneNumber,
          email: profile.email,
          address: `${profile.region}, ${profile.city}, ${profile.subCity}`,
          nationalId: profile.nationalIdOrPassport
        }));
      } catch (error) {
        console.error("Failed to fetch client profile:", error);
        // Continue without pre-filled data if API fails
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchClientProfile();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCustomerCategories();
      setCategories(
        data.map((cat: RemoteCategory) => ({
          id: cat.id?.toString() ?? "",
          name: cat.name ?? cat.categoryName ?? "Unnamed Category"
        }))
      );
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!form.categoryId) {
      setSubCategories([]);
      return;
    }

    const fetchSubcategories = async () => {
      setLoadingSubCategories(true);
      try {
        const data = await getSubcategoriesByCategory(form.categoryId);
        setSubCategories(
          data.map((sub: RemoteSubCategory) => ({
            id: sub.id?.toString() ?? "",
            name: sub.name ?? "Unnamed Subcategory"
          }))
        );
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      } finally {
        setLoadingSubCategories(false);
      }
    };

    fetchSubcategories();
  }, [form.categoryId]);

  // Only require fields that exist in backend
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
    "categoryId",
    "subCategoryId"
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
      const storedToken = localStorage.getItem("authToken") ?? "";
      let clientIdFallback: string | undefined = undefined;
      if (storedToken) {
        try {
          const decoded: any = jwtDecode(storedToken);
          clientIdFallback = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        } catch {}
      }
      const clientIdToUse = clientProfile?.id || user?.id || clientIdFallback;
      
      console.log("Continuing with clientId:", clientIdToUse);
      setPersonalInfo({
        ...form,
        clientId: clientIdToUse,
        categoryName: categories.find((c) => c.id === form.categoryId)?.name,
        subCategoryName: subCategories.find((s) => s.id === form.subCategoryId)?.name,
        documents
      });
      setSubmitting(false);
      navigate("/apply/car-info");
    }, 1200);
  };

  const documentPreview = useMemo(() => {
    if (documents.length === 0) return "No files chosen.";
    return `${documents.length} file(s) selected.`;
  }, [documents]);

  // Show loading state while fetching profile
  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-20 px-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl border border-amber-100 p-10 flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-amber-800 mb-2">Loading Your Information</h2>
          <p className="text-amber-600 text-center max-w-md">
            We're fetching your profile information to pre-fill the form. This will save you time!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-amber-100 p-6 md:p-10">
        <StepProgress currentStep={1} />

        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-semibold uppercase tracking-wide">Step 1 of 3</p>
              <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mt-2">Personal Information</h1>
              <p className="text-amber-700 mt-2">
                {clientProfile 
                  ? "Your profile information has been pre-filled. Review and edit if needed."
                  : "Select a category & subcategory, then provide personal details to begin your insurance application."
                }
              </p>
            </div>
            
            {clientProfile && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-green-700 text-sm font-medium">
                  ✓ Information loaded from your profile
                </p>
              </div>
            )}
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Category Selection Section */}
          <section className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <h2 className="text-lg font-semibold text-amber-900 mb-4">Insurance Selection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-amber-800 mb-1 block">Category *</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                  className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300 bg-white"
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
                  className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300 bg-white disabled:bg-amber-50 disabled:text-amber-400"
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
            </div>
          </section>

          {/* Personal Information Section - Only fields from backend */}
          <section className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <h2 className="text-lg font-semibold text-amber-900 mb-4">
              {clientProfile ? "Review Your Information" : "Personal Details"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Only include fields that exist in backend response */}
              {[
                { label: "First Name", field: "fullName", type: "text" },
                { label: "Father's Name", field: "fathersName", type: "text" },
                { label: "Grandfather's Name", field: "grandfathersName", type: "text" },
                { label: "Date of Birth", field: "dateOfBirth", type: "date" },
                { label: "Phone Number", field: "phoneNumber", type: "tel" },
                { label: "Email", field: "email", type: "email" },
                { label: "Address", field: "address", type: "text" },
                { label: "National ID / Passport Number", field: "nationalId", type: "text" },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label className="text-sm font-medium text-amber-800 mb-1 block">
                    {label} *
                    {clientProfile && (
                      <span className="ml-2 text-xs text-green-600 font-normal">
                        (from profile)
                      </span>
                    )}
                  </label>
                  <input
                    type={type}
                    value={form[field as keyof PersonalInfo] as string}
                    onChange={(e) => handleChange(field as keyof PersonalInfo, e.target.value)}
                    className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300 bg-white"
                  />
                  {errors[field] && <p className="text-xs text-red-600 mt-1">{errors[field]}</p>}
                </div>
              ))}

              <div>
                <label className="text-sm font-medium text-amber-800 mb-1 block">
                  Gender *
                  {clientProfile && (
                    <span className="ml-2 text-xs text-green-600 font-normal">
                      (from profile)
                    </span>
                  )}
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300 bg-white"
                >
                  <option value="">Select gender</option>
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
                {errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
              </div>
            </div>
          </section>

          {/* Documents Section - This is frontend only for file upload */}
          <section className="space-y-3">
            <label className="text-sm font-medium text-amber-800 block">Supporting Documents</label>
            <p className="text-sm text-amber-600">
              Upload identification documents, driving license, car ownership papers, etc.
            </p>
            <label className="border-2 border-dashed border-amber-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400 transition-colors bg-white">
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
              className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-colors flex items-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue to Car Information"
              )}
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