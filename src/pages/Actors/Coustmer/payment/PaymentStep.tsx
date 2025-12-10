// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useInsuranceApplication } from "../../../../context/InsuranceApplicationContext";
// import { useAuth } from "../../../../context/AuthContext";
// import { jwtDecode } from "jwt-decode";
// import { getClientMotorApplications } from "../../../../api/Coustomer/applications/Viewmotorinsurace";
// import { initiatePayment, verifyPayment } from "../../../../api/payment/InitiatePayment"
// import { getClients } from "../../../../api/Admin/userManagementTableApi";
// import { CreditCard } from "lucide-react";

// const PaymentStep: React.FC = () => {
//   const navigate = useNavigate();
//   const { calculationTotals, financeDecision, personalInfo } = useInsuranceApplication();
//   const { user, token } = useAuth();

//   // Build multiple mock payment items. Approved items can be paid; pending/rejected are view-only.
//   const initialPayments = useMemo(() => ([
//     { id: 'mock-1', title: 'Auto Insurance - Sample', status: 'pending' as const, totals: calculationTotals || { basePrice: 0, optionalTotal: 0, total: 0 } }
//   ]), [calculationTotals]);

//   const [payments, setPayments] = useState(initialPayments);
//   const [paidIds, setPaidIds] = useState<string[]>([]);
//   const [redirectingId, setRedirectingId] = useState<string | null>(null);
//   const [verifyingId, setVerifyingId] = useState<string | null>(null);
//   const [verifyStatuses, setVerifyStatuses] = useState<Record<string, string>>({});
//   const [paymentRefs, setPaymentRefs] = useState<Record<string, string>>(() => {
//     try {
//       const raw = localStorage.getItem("paymentReferences") || "{}";
//       return JSON.parse(raw);
//     } catch {
//       return {};
//     }
//   });

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("paidApplications") || "[]";
//       const arr = JSON.parse(raw);
//       if (Array.isArray(arr)) setPaidIds(arr);
//     } catch {}
//   }, []);

//   const resolveClientId = (): string | null => {
//     if (personalInfo?.clientId) return personalInfo.clientId;
//     if (user?.id) return user.id;
//     const storedToken = localStorage.getItem("authToken") ?? "";
//     if (storedToken) {
//       try {
//         const decoded: any = jwtDecode(storedToken);
//         return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
//       } catch {}
//     }
//     return null;
//   };

//   useEffect(() => {
//     const loadApplications = async () => {
//       try {
//         const clientId = resolveClientId();
//         console.log("PaymentStep: resolved clientId:", clientId);
        
//         // Get auth token
//         const authToken = token || localStorage.getItem("authToken") || localStorage.getItem("token");
        
//         if (!authToken) {
//           console.warn("No auth token available; skipping fetch.");
//           return;
//         }
        
//         // Fetch applications using the token (client ID is extracted from token)
//         const apps = await getClientMotorApplications(authToken);
//         console.log("PaymentStep: fetched applications count:", apps.length, apps);
        
//         const mapped = apps.map(app => ({
//           id: app.id,
//           title: `Motor Insurance - ${app.model} (${app.plateNumber})`,
//           status: (() => {
//             const s = (app.status || "Pending").toLowerCase();
//             if (s === "approved" || s === "awaitingpayment") return "approved" as const;
//             if (s === "pending") return "pending" as const;
//             return "rejected" as const;
//           })(),
//           totals: {
//             basePrice: app.calculatedPremium || 0,
//             optionalTotal: 0,
//             total: app.calculatedPremium || 0,
//           },
//           originalApp: app, // Keep original data if needed
//         }));
        
//         setPayments(mapped);
//       } catch (e) {
//         console.error("Failed to load applications for payment:", e);
//       }
//     };
    
//     loadApplications();
//   }, [personalInfo?.clientId, user?.id, token]);

//   const handlePay = async (id: string) => {
//     if (redirectingId) return;
//     setRedirectingId(id);
//     try {
//       const res = await initiatePayment(id, token);
//       const rawUrl = (res && (res.checkoutUrl || res.redirectUrl || res.url)) || (typeof res === "string" ? res : null);
//       const url = typeof rawUrl === "string" ? rawUrl.replace(/`/g, "").trim() : null;
//       const reference = res?.reference || res?.tx_ref;
//       if (reference) {
//         const next = { ...paymentRefs, [id]: reference };
//         setPaymentRefs(next);
//         try { localStorage.setItem("paymentReferences", JSON.stringify(next)); } catch {}
//       }
//       if (url) {
//         window.location.href = url;
//         return;
//       }
//     } catch (e) {
//       console.error("Payment initiation failed:", e);
//     } finally {
//       setRedirectingId(null);
//     }
//   };

//   const handleVerify = async (id: string) => {
//     const reference = paymentRefs[id];
//     if (!reference || verifyingId) return;
//     setVerifyingId(id);
//     try {
//       const res = await verifyPayment(reference, token);
//       let display = "unknown";
//       let providerStatus = "";
//       try {
//         const raw = res?.data ?? res;
//         const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
//         const inner = parsed?.data ?? {};
//         const innerStatus = inner?.status;
//         if (typeof innerStatus === "string") {
//           providerStatus = innerStatus.toLowerCase();
//           display = innerStatus;
//         } else if (typeof parsed?.status === "string") {
//           // fall back only for display; do NOT use to mark paid
//           display = parsed.status;
//         } else if (typeof res?.message === "string") {
//           display = res.message;
//         }
//       } catch {
//         display = typeof res === "string" ? res : (res?.message || "unknown");
//       }
//       setVerifyStatuses(prev => ({ ...prev, [id]: display }));
//       if (providerStatus === "success") {
//         setPaidIds(prev => {
//           const next = Array.from(new Set([...prev, id]));
//           try { localStorage.setItem("paidApplications", JSON.stringify(next)); } catch {}
//           return next;
//         });
//       }
//     } catch (e) {
//       setVerifyStatuses(prev => ({ ...prev, [id]: "failed" }));
//     } finally {
//       setVerifyingId(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#FFF8E1] py-10 px-4 md:px-8">
//       <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-[#FFE082] p-6 md:p-10">
//         <header className="mb-8 text-center">
//           <p className="text-sm text-[#FFC107] font-semibold uppercase tracking-wide">Payment</p>
//           <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mt-2">Complete Payments</h1>
//           <p className="text-[#5D4037] mt-2">List of applications and their status. You can pay approved items.</p>
//         </header>

//         <div className="space-y-6">
          
//           {payments.length === 0 && (
//             <div className="bg-[#FFF8E1] border border-[#FFC107] rounded-2xl p-6 text-[#4E342E] text-center">
//               No applications found for payment.
//             </div>
//           )}
          
//           {payments.map(item => (
//             <div key={item.id} className="bg-[#FFF8E1] border border-[#FFC107] rounded-2xl p-6 text-[#4E342E]">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <CreditCard className="w-6 h-6 text-[#FFC107]" />
//                   <h2 className="text-lg font-semibold text-[#000000]">{item.title}</h2>
//                 </div>
//                 <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
//                   item.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-300'
//                     : item.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-300'
//                     : 'bg-amber-100 text-amber-800 border border-amber-300'
//                 }`}>
//                   <span className={`w-2.5 h-2.5 rounded-full ${
//                     item.status === 'approved' ? 'bg-green-500' : item.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
//                   }`} />
//                   {item.status === 'approved' ? 'Approved' : item.status === 'rejected' ? 'Rejected' : 'Pending'}
//                 </div>
//               </div>

//               <div className="mt-4 space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span>Base Premium</span>
//                   <span>${item.totals.basePrice.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Optional Coverages</span>
//                   <span>${item.totals.optionalTotal.toLocaleString()}</span>
//                 </div>
//                 <div className="h-px bg-[#FFD54F]" />
//                 <div className="flex justify-between text-lg font-bold text-[#000000]">
//                   <span>Total Due</span>
//                   <span>${item.totals.total.toLocaleString()}</span>
//                 </div>
//               </div>

//               <div className="mt-4 flex gap-3">
//                 {item.status === 'approved' ? (
//                   <>
//                     <button
//                       onClick={() => handlePay(item.id)}
//                       disabled={paidIds.includes(item.id) || redirectingId === item.id}
//                       className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-colors ${paidIds.includes(item.id) ? 'bg-green-200 text-green-800 cursor-not-allowed' : redirectingId === item.id ? 'bg-amber-300 text-amber-900 cursor-wait' : 'bg-[#FFC107] text-black hover:bg-[#FFB300]'}`}
//                     >
//                       {paidIds.includes(item.id) ? 'Payment Completed' : redirectingId === item.id ? 'Redirecting…' : 'Pay Now'}
//                     </button>
//                     {paymentRefs[item.id] && (
//                       <button
//                         onClick={() => handleVerify(item.id)}
//                         disabled={verifyingId === item.id}
//                         className={`flex-1 py-3 rounded-2xl border border-[#FFC107] text-[#5D4037] font-semibold text-sm ${verifyingId === item.id ? 'cursor-wait opacity-70' : 'hover:bg-amber-50'}`}
//                       >
//                         {verifyingId === item.id ? 'Verifying…' : 'Verify Payment'}
//                       </button>
//                     )}
//                     {verifyStatuses[item.id] && (
//                       <div className="flex-1 text-sm text-[#5D4037]">
//                         Verification: {verifyStatuses[item.id]}
//                       </div>
//                     )}
//                   </>
//                 ) : item.status === 'pending' ? (
//                   <button disabled className="flex-1 py-3 rounded-2xl bg-amber-200 text-amber-800 font-semibold text-sm cursor-not-allowed">
//                     Awaiting Finance Review
//                   </button>
//                 ) : (
//                   <button onClick={() => navigate('/apply/personal-info')} className="flex-1 py-3 rounded-2xl border border-red-400 text-red-700 font-semibold text-sm hover:bg-red-50">
//                     Edit & Resubmit
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//     </div>
//   );
// };

// export default PaymentStep;
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInsuranceApplication } from "../../../../context/InsuranceApplicationContext";
import { useLifeInsurance } from "../../../../context/LifeInsuranceContext";
import { useAuth } from "../../../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { getClientMotorApplications } from "../../../../api/Coustomer/applications/Viewmotorinsurace";
import { lifeApiService } from "../../../../api/Coustomer/applications/lifeApi";
import { initiatePayment, verifyPayment } from "../../../../api/payment/InitiatePayment";
import { CreditCard, Heart, Car } from "lucide-react";

// Define types for payment items
interface PaymentItem {
  id: string;
  title: string;
  type: 'motor' | 'life';
  status: 'pending' | 'approved' | 'rejected';
  totals: {
    basePrice: number;
    optionalTotal: number;
    total: number;
  };
  originalApp: any; // Keep original data
  insuranceType?: string;
}

const PaymentStep: React.FC = () => {
  const navigate = useNavigate();
  const { calculationTotals, personalInfo } = useInsuranceApplication();
  const { backendLifeApplicationData } = useLifeInsurance();
  const { user, token } = useAuth();

  const initialPayments = useMemo(() => ([
    { 
      id: 'mock-1', 
      title: 'Auto Insurance - Sample', 
      type: 'motor' as const, 
      status: 'pending' as const, 
      totals: calculationTotals || { basePrice: 0, optionalTotal: 0, total: 0 } 
    }
  ]), [calculationTotals]);

  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [paidIds, setPaidIds] = useState<string[]>([]);
  const [redirectingId, setRedirectingId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifyStatuses, setVerifyStatuses] = useState<Record<string, string>>({});
  const [paymentRefs, setPaymentRefs] = useState<Record<string, string>>(() => {
    try {
      const raw = localStorage.getItem("paymentReferences") || "{}";
      return JSON.parse(raw);
    } catch {
      return {};
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("paidApplications") || "[]";
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) setPaidIds(arr);
    } catch {}
  }, []);

  const resolveClientId = (): string | null => {
    if (personalInfo?.clientId) return personalInfo.clientId;
    if (user?.id) return user.id;
    const storedToken = localStorage.getItem("authToken") ?? "";
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
      } catch {}
    }
    return null;
  };

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      try {
        const clientId = resolveClientId();
        console.log("PaymentStep: resolved clientId:", clientId);
        
        // Get auth token
        const authToken = token || localStorage.getItem("authToken") || localStorage.getItem("token");
        
        if (!authToken) {
          console.warn("No auth token available; skipping fetch.");
          setLoading(false);
          return;
        }
        
        // Fetch BOTH motor and life applications
        const [motorApps, lifeApps] = await Promise.all([
          getClientMotorApplications(authToken).catch(e => {
            console.error("Failed to fetch motor applications:", e);
            return [];
          }),
          lifeApiService.getUserLifeApplications().catch(e => {
            console.error("Failed to fetch life applications:", e);
            return [];
          })
        ]);
        
        console.log("PaymentStep: fetched motor apps:", motorApps.length);
        console.log("PaymentStep: fetched life apps:", lifeApps.length);
        
        // Map motor applications
        const mappedMotorApps: PaymentItem[] = motorApps.map(app => ({
          id: app.id || app.applicationId,
          title: `Motor Insurance - ${app.model || 'Vehicle'} (${app.plateNumber || 'No Plate'})`,
          type: 'motor' as const,
          status: (() => {
            const s = (app.status || "Pending").toLowerCase();
            if (s === "approved" || s === "awaitingpayment") return "approved" as const;
            if (s === "pending") return "pending" as const;
            return "rejected" as const;
          })(),
          totals: {
            basePrice: app.calculatedPremium || 0,
            optionalTotal: 0,
            total: app.calculatedPremium || 0,
          },
          originalApp: app,
          insuranceType: app.insuranceType,
        }));
        
        // Map life applications
        const mappedLifeApps: PaymentItem[] = lifeApps.map(app => ({
          id: app.applicationId || app.id,
          title: `Life Insurance - ${app.categoryName || 'Life Coverage'} (${app.lifeInsuranceType || 'FullLife'})`,
          type: 'life' as const,
          status: (() => {
            const s = (app.status || "Pending").toLowerCase();
            if (s === "approved" || s === "awaitingpayment") return "approved" as const;
            if (s === "pending") return "pending" as const;
            return "rejected" as const;
          })(),
          totals: {
            basePrice: app.lifePrice || 0,
            optionalTotal: 0,
            total: app.lifePrice || 0,
          },
          originalApp: app,
          insuranceType: app.lifeInsuranceType,
        }));
        
        // Combine both lists
        const allApplications = [...mappedMotorApps, ...mappedLifeApps];
        
        // If we have backend life data from context but it's not in the fetched list, add it
        if (backendLifeApplicationData && !allApplications.find(app => app.id === backendLifeApplicationData.applicationId)) {
          const lifeFromContext: PaymentItem = {
            id: backendLifeApplicationData.applicationId,
            title: `Life Insurance - ${backendLifeApplicationData.categoryName || 'Life Coverage'} (${backendLifeApplicationData.lifeInsuranceType || 'FullLife'})`,
            type: 'life' as const,
            status: (() => {
              const s = (backendLifeApplicationData.status || "Pending").toLowerCase();
              if (s === "approved" || s === "awaitingpayment") return "approved" as const;
              if (s === "pending") return "pending" as const;
              return "rejected" as const;
            })(),
            totals: {
              basePrice: backendLifeApplicationData.lifePrice || 0,
              optionalTotal: 0,
              total: backendLifeApplicationData.lifePrice || 0,
            },
            originalApp: backendLifeApplicationData,
            insuranceType: backendLifeApplicationData.lifeInsuranceType,
          };
          allApplications.push(lifeFromContext);
        }
        
        // Remove duplicates by ID
        const uniqueApplications = allApplications.filter((app, index, self) =>
          index === self.findIndex(a => a.id === app.id)
        );
        
        setPayments(uniqueApplications);
      } catch (e) {
        console.error("Failed to load applications for payment:", e);
      } finally {
        setLoading(false);
      }
    };
    
    loadApplications();
  }, [personalInfo?.clientId, user?.id, token, backendLifeApplicationData]);

  const handlePay = async (id: string, type: 'motor' | 'life') => {
    if (redirectingId) return;
    setRedirectingId(id);
    try {
      // The initiatePayment function should handle both motor and life
      const res = await initiatePayment(id, token);
      const rawUrl = (res && (res.checkoutUrl || res.redirectUrl || res.url)) || (typeof res === "string" ? res : null);
      const url = typeof rawUrl === "string" ? rawUrl.replace(/`/g, "").trim() : null;
      const reference = res?.reference || res?.tx_ref;
      
      if (reference) {
        const next = { ...paymentRefs, [id]: reference };
        setPaymentRefs(next);
        try { localStorage.setItem("paymentReferences", JSON.stringify(next)); } catch {}
      }
      
      if (url) {
        window.location.href = url;
        return;
      }
      
      // If no URL returned, show success message
      alert(`Payment initiated for ${type === 'motor' ? 'motor' : 'life'} insurance. Please check your email for payment instructions.`);
      
    } catch (e) {
      console.error("Payment initiation failed:", e);
      alert(`Failed to initiate payment. Please try again. Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setRedirectingId(null);
    }
  };

  const handleVerify = async (id: string) => {
    const reference = paymentRefs[id];
    if (!reference || verifyingId) return;
    setVerifyingId(id);
    try {
      const res = await verifyPayment(reference, token);
      let display = "unknown";
      let providerStatus = "";
      
      try {
        const raw = res?.data ?? res;
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        const inner = parsed?.data ?? {};
        const innerStatus = inner?.status;
        
        if (typeof innerStatus === "string") {
          providerStatus = innerStatus.toLowerCase();
          display = innerStatus;
        } else if (typeof parsed?.status === "string") {
          display = parsed.status;
        } else if (typeof res?.message === "string") {
          display = res.message;
        }
      } catch {
        display = typeof res === "string" ? res : (res?.message || "unknown");
      }
      
      setVerifyStatuses(prev => ({ ...prev, [id]: display }));
      
      if (providerStatus === "success" || display.toLowerCase().includes("success")) {
        setPaidIds(prev => {
          const next = Array.from(new Set([...prev, id]));
          try { localStorage.setItem("paidApplications", JSON.stringify(next)); } catch {}
          return next;
        });
        alert("Payment verified successfully!");
      }
      
    } catch (e) {
      setVerifyStatuses(prev => ({ ...prev, [id]: "failed" }));
      alert("Verification failed. Please try again.");
    } finally {
      setVerifyingId(null);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border border-red-300';
      default: return 'bg-amber-100 text-amber-800 border border-amber-300';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-amber-500';
    }
  };

  const getTypeIcon = (type: 'motor' | 'life') => {
    return type === 'motor' ? Car : Heart;
  };

  const getTypeColor = (type: 'motor' | 'life') => {
    return type === 'motor' ? 'text-blue-600' : 'text-red-600';
  };

  const getTypeLabel = (type: 'motor' | 'life') => {
    return type === 'motor' ? 'Motor Insurance' : 'Life Insurance';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] py-10 px-4 md:px-8 flex items-center justify-center">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-[#FFE082] p-6 md:p-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC107] mx-auto mb-4"></div>
          <p className="text-[#5D4037]">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E1] py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-[#FFE082] p-6 md:p-10">
        <header className="mb-8 text-center">
          <p className="text-sm text-[#FFC107] font-semibold uppercase tracking-wide">Payment</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mt-2">Complete Payments</h1>
          <p className="text-[#5D4037] mt-2">
            List of applications and their status. You can pay approved items.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-sm">Motor Insurance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-sm">Life Insurance</span>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          {payments.length === 0 ? (
            <div className="bg-[#FFF8E1] border border-[#FFC107] rounded-2xl p-8 text-[#4E342E] text-center">
              <CreditCard className="w-16 h-16 text-[#FFC107] mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Applications Found</h3>
              <p className="mb-4">You don't have any insurance applications ready for payment.</p>
              <button
                onClick={() => navigate('/apply/personal-info')}
                className="px-6 py-3 rounded-2xl bg-[#FFC107] text-black font-semibold text-sm hover:bg-[#FFB300] transition-colors"
              >
                Apply for Insurance
              </button>
            </div>
          ) : (
            payments.map(item => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <div key={item.id} className="bg-[#FFF8E1] border border-[#FFC107] rounded-2xl p-6 text-[#4E342E]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getTypeColor(item.type)} bg-opacity-20`}>
                        <TypeIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold text-[#000000]">{item.title}</h2>
                          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(item.type)} bg-opacity-20`}>
                            {getTypeLabel(item.type)}
                          </span>
                        </div>
                        {item.insuranceType && (
                          <p className="text-sm text-gray-600 mt-1">
                            Type: {item.insuranceType === 'FullLife' ? 'Full Life' : 
                                   item.insuranceType === 'HalfLife' ? 'Half Life' :
                                   item.insuranceType}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(item.status)}`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor(item.status)}`} />
                      {item.status === 'approved' ? 'Approved' : 
                       item.status === 'rejected' ? 'Rejected' : 
                       'Pending Review'}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Premium</span>
                      <span className="font-medium">${item.totals.basePrice.toLocaleString()}</span>
                    </div>
                    {item.totals.optionalTotal > 0 && (
                      <div className="flex justify-between">
                        <span>Optional Coverages</span>
                        <span>${item.totals.optionalTotal.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="h-px bg-[#FFD54F]" />
                    <div className="flex justify-between text-lg font-bold text-[#000000]">
                      <span>Total Due</span>
                      <span>${item.totals.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    {item.status === 'approved' ? (
                      <>
                        <button
                          onClick={() => handlePay(item.id, item.type)}
                          disabled={paidIds.includes(item.id) || redirectingId === item.id}
                          className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-colors ${
                            paidIds.includes(item.id) 
                              ? 'bg-green-200 text-green-800 cursor-not-allowed' 
                              : redirectingId === item.id 
                                ? 'bg-amber-300 text-amber-900 cursor-wait' 
                                : 'bg-[#FFC107] text-black hover:bg-[#FFB300]'
                          }`}
                        >
                          {paidIds.includes(item.id) 
                            ? 'Payment Completed' 
                            : redirectingId === item.id 
                              ? 'Redirecting…' 
                              : `Pay ${item.type === 'motor' ? 'Motor' : 'Life'} Insurance`}
                        </button>
                        
                        {paymentRefs[item.id] && (
                          <button
                            onClick={() => handleVerify(item.id)}
                            disabled={verifyingId === item.id || paidIds.includes(item.id)}
                            className={`flex-1 py-3 rounded-2xl border border-[#FFC107] text-[#5D4037] font-semibold text-sm ${
                              verifyingId === item.id || paidIds.includes(item.id)
                                ? 'cursor-not-allowed opacity-50'
                                : 'hover:bg-amber-50'
                            }`}
                          >
                            {verifyingId === item.id 
                              ? 'Verifying…' 
                              : paidIds.includes(item.id)
                                ? 'Verified'
                                : 'Verify Payment'}
                          </button>
                        )}
                        
                        {verifyStatuses[item.id] && !paidIds.includes(item.id) && (
                          <div className="flex-1 text-sm text-[#5D4037] flex items-center justify-center">
                            Verification: {verifyStatuses[item.id]}
                          </div>
                        )}
                      </>
                    ) : item.status === 'pending' ? (
                      <button 
                        disabled 
                        className="flex-1 py-3 rounded-2xl bg-amber-200 text-amber-800 font-semibold text-sm cursor-not-allowed"
                      >
                        Awaiting Finance Review
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate('/apply/personal-info')}
                        className="flex-1 py-3 rounded-2xl border border-red-400 text-red-700 font-semibold text-sm hover:bg-red-50"
                      >
                        Edit & Resubmit Application
                      </button>
                    )}
                  </div>
                  
                  {/* Additional info for life insurance */}
                  {item.type === 'life' && item.originalApp && (
                    <div className="mt-4 pt-4 border-t border-amber-200">
                      <p className="text-sm font-medium text-gray-700">Life Insurance Details:</p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        {item.originalApp.age && (
                          <div>Age: {item.originalApp.age} years</div>
                        )}
                        {item.originalApp.height && (
                          <div>Height: {item.originalApp.height} cm</div>
                        )}
                        {item.originalApp.weight && (
                          <div>Weight: {item.originalApp.weight} kg</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Additional info for motor insurance */}
                  {item.type === 'motor' && item.originalApp && (
                    <div className="mt-4 pt-4 border-t border-amber-200">
                      <p className="text-sm font-medium text-gray-700">Vehicle Details:</p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        {item.originalApp.model && (
                          <div>Model: {item.originalApp.model}</div>
                        )}
                        {item.originalApp.plateNumber && (
                          <div>Plate: {item.originalApp.plateNumber}</div>
                        )}
                        {item.originalApp.yearOfManufacture && (
                          <div>Year: {item.originalApp.yearOfManufacture}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/customerdash')}
            className="px-6 py-3 rounded-2xl border border-[#FFC107] text-[#5D4037] font-semibold text-sm hover:bg-amber-50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;