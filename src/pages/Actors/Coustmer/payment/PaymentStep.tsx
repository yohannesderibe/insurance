import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInsuranceApplication } from "../../../../context/InsuranceApplicationContext";
import { useAuth } from "../../../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { getClientMotorApplications } from "../../../../api/Coustomer/applications/Viewmotorinsurace";
import { initiatePayment, verifyPayment } from "../../../../api/payment/InitiatePayment"
import { getClients } from "../../../../api/Admin/userManagementTableApi";
import { CreditCard } from "lucide-react";

const PaymentStep: React.FC = () => {
  const navigate = useNavigate();
  const { calculationTotals, financeDecision, personalInfo } = useInsuranceApplication();
  const { user, token } = useAuth();

  // Build multiple mock payment items. Approved items can be paid; pending/rejected are view-only.
  const initialPayments = useMemo(() => ([
    { id: 'mock-1', title: 'Auto Insurance - Sample', status: 'pending' as const, totals: calculationTotals || { basePrice: 0, optionalTotal: 0, total: 0 } }
  ]), [calculationTotals]);

  const [payments, setPayments] = useState(initialPayments);
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
      try {
        const clientId = resolveClientId();
        console.log("PaymentStep: resolved clientId:", clientId);
        
        // Get auth token
        const authToken = token || localStorage.getItem("authToken") || localStorage.getItem("token");
        
        if (!authToken) {
          console.warn("No auth token available; skipping fetch.");
          return;
        }
        
        // Fetch applications using the token (client ID is extracted from token)
        const apps = await getClientMotorApplications(authToken);
        console.log("PaymentStep: fetched applications count:", apps.length, apps);
        
        const mapped = apps.map(app => ({
          id: app.id,
          title: `Motor Insurance - ${app.model} (${app.plateNumber})`,
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
          originalApp: app, // Keep original data if needed
        }));
        
        setPayments(mapped);
      } catch (e) {
        console.error("Failed to load applications for payment:", e);
      }
    };
    
    loadApplications();
  }, [personalInfo?.clientId, user?.id, token]);

  const handlePay = async (id: string) => {
    if (redirectingId) return;
    setRedirectingId(id);
    try {
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
    } catch (e) {
      console.error("Payment initiation failed:", e);
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
          // fall back only for display; do NOT use to mark paid
          display = parsed.status;
        } else if (typeof res?.message === "string") {
          display = res.message;
        }
      } catch {
        display = typeof res === "string" ? res : (res?.message || "unknown");
      }
      setVerifyStatuses(prev => ({ ...prev, [id]: display }));
      if (providerStatus === "success") {
        setPaidIds(prev => {
          const next = Array.from(new Set([...prev, id]));
          try { localStorage.setItem("paidApplications", JSON.stringify(next)); } catch {}
          return next;
        });
      }
    } catch (e) {
      setVerifyStatuses(prev => ({ ...prev, [id]: "failed" }));
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-[#FFE082] p-6 md:p-10">
        <header className="mb-8 text-center">
          <p className="text-sm text-[#FFC107] font-semibold uppercase tracking-wide">Payment</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mt-2">Complete Payments</h1>
          <p className="text-[#5D4037] mt-2">List of applications and their status. You can pay approved items.</p>
        </header>

        <div className="space-y-6">
          
          {payments.length === 0 && (
            <div className="bg-[#FFF8E1] border border-[#FFC107] rounded-2xl p-6 text-[#4E342E] text-center">
              No applications found for payment.
            </div>
          )}
          
          {payments.map(item => (
            <div key={item.id} className="bg-[#FFF8E1] border border-[#FFC107] rounded-2xl p-6 text-[#4E342E]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-[#FFC107]" />
                  <h2 className="text-lg font-semibold text-[#000000]">{item.title}</h2>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  item.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-300'
                    : item.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    item.status === 'approved' ? 'bg-green-500' : item.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                  {item.status === 'approved' ? 'Approved' : item.status === 'rejected' ? 'Rejected' : 'Pending'}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Premium</span>
                  <span>${item.totals.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Optional Coverages</span>
                  <span>${item.totals.optionalTotal.toLocaleString()}</span>
                </div>
                <div className="h-px bg-[#FFD54F]" />
                <div className="flex justify-between text-lg font-bold text-[#000000]">
                  <span>Total Due</span>
                  <span>${item.totals.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                {item.status === 'approved' ? (
                  <>
                    <button
                      onClick={() => handlePay(item.id)}
                      disabled={paidIds.includes(item.id) || redirectingId === item.id}
                      className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-colors ${paidIds.includes(item.id) ? 'bg-green-200 text-green-800 cursor-not-allowed' : redirectingId === item.id ? 'bg-amber-300 text-amber-900 cursor-wait' : 'bg-[#FFC107] text-black hover:bg-[#FFB300]'}`}
                    >
                      {paidIds.includes(item.id) ? 'Payment Completed' : redirectingId === item.id ? 'Redirecting…' : 'Pay Now'}
                    </button>
                    {paymentRefs[item.id] && (
                      <button
                        onClick={() => handleVerify(item.id)}
                        disabled={verifyingId === item.id}
                        className={`flex-1 py-3 rounded-2xl border border-[#FFC107] text-[#5D4037] font-semibold text-sm ${verifyingId === item.id ? 'cursor-wait opacity-70' : 'hover:bg-amber-50'}`}
                      >
                        {verifyingId === item.id ? 'Verifying…' : 'Verify Payment'}
                      </button>
                    )}
                    {verifyStatuses[item.id] && (
                      <div className="flex-1 text-sm text-[#5D4037]">
                        Verification: {verifyStatuses[item.id]}
                      </div>
                    )}
                  </>
                ) : item.status === 'pending' ? (
                  <button disabled className="flex-1 py-3 rounded-2xl bg-amber-200 text-amber-800 font-semibold text-sm cursor-not-allowed">
                    Awaiting Finance Review
                  </button>
                ) : (
                  <button onClick={() => navigate('/apply/personal-info')} className="flex-1 py-3 rounded-2xl border border-red-400 text-red-700 font-semibold text-sm hover:bg-red-50">
                    Edit & Resubmit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PaymentStep;
