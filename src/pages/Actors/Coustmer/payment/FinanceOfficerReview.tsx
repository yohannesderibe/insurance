import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInsuranceApplication } from "../../../../context/InsuranceApplicationContext";
import { CreditCard, CheckCircle2, XCircle } from "lucide-react";

const PaymentStep: React.FC = () => {
  const navigate = useNavigate();
  const { calculationTotals, financeDecision } = useInsuranceApplication();

  // Build multiple mock payment items. Approved items can be paid; pending/rejected are view-only.
  const initialPayments = useMemo(() => ([
    { id: 'p-1', title: 'Auto Insurance - Corolla 2022', status: 'approved' as const, totals: calculationTotals || { basePrice: 1000, optionalTotal: 200, total: 1200 } },
    { id: 'p-2', title: 'Auto Insurance - Civic 2021', status: 'pending' as const, totals: { basePrice: 900, optionalTotal: 100, total: 1000 } },
    { id: 'p-3', title: 'Auto Insurance - Hilux 2020', status: 'rejected' as const, totals: { basePrice: 1100, optionalTotal: 150, total: 1250 } }
  ]), [calculationTotals]);

  const [payments, setPayments] = useState(initialPayments);
  const [paidIds, setPaidIds] = useState<string[]>([]);

  // Modal/payment state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const openModal = (id: string) => {
    setActivePaymentId(id);
    setIsModalOpen(true);
    setCardName("");
    setCardNumber("");
    setExpiry("");
    setCvv("");
  };

  const closeModal = () => {
    if (processing) return;
    setIsModalOpen(false);
    setActivePaymentId(null);
  };

  const processPayment = (simulateSuccess: boolean) => {
    if (processing) return;
    // Simple validation
    if (!cardName || !cardNumber || !expiry || !cvv) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setIsModalOpen(false);
      if (simulateSuccess) {
        if (activePaymentId) setPaidIds(prev => [...prev, activePaymentId]);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1600);
      } else {
        setShowFailure(true);
        setTimeout(() => setShowFailure(false), 1600);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-transparent  rounded-3xl shadow-2xl border border-[#FFE082] p-6 md:p-8 mb-6">
          <header className="text-center">
            <p className="text-sm text-[#FFC107] font-semibold uppercase tracking-wide">Payment</p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mt-2">Complete Payments</h1>
            <p className="text-[#5D4037] mt-2">List of applications and their status. You can pay approved items.</p>
          </header>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {payments.map(item => (
            <div key={item.id} className="bg-transparent  rounded-2xl shadow-md border border-[#FFE082] p-6 text-[#4E342E]">
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
                  <button
                    onClick={() => openModal(item.id)}
                    disabled={paidIds.includes(item.id)}
                    className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-colors ${paidIds.includes(item.id) ? 'bg-green-200 text-green-800 cursor-not-allowed' : 'bg-[#FFC107] text-black hover:bg-[#FFB300]'}`}
                  >
                    {paidIds.includes(item.id) ? 'Payment Completed' : 'Pay Now'}
                  </button>
                ) : item.status === 'pending' ? (
                  <button disabled className="flex-1 py-3 rounded-2xl bg-amber-200 text-amber-800 font-semibold text-sm cursor-not-allowed">
                    Awaiting Finance Review
                  </button>
                ) : (
                  <button onClick={() => navigate('/insurance/apply/personal')} className="flex-1 py-3 rounded-2xl border border-red-400 text-red-700 font-semibold text-sm hover:bg-red-50">
                    Edit & Resubmit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#FFE082] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#000000]">Enter Payment Details</h3>
              <button onClick={closeModal} className="text-[#5D4037] hover:text-black">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-1">Name on Card</label>
                <input value={cardName} onChange={e=>setCardName(e.target.value)} className="w-full border border-[#FFE082] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FFC107]" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-1">Card Number</label>
                <input value={cardNumber} onChange={e=>setCardNumber(e.target.value)} className="w-full border border-[#FFE082] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FFC107]" placeholder="4111 1111 1111 1111" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#000000] mb-1">Expiry</label>
                  <input value={expiry} onChange={e=>setExpiry(e.target.value)} className="w-full border border-[#FFE082] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FFC107]" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#000000] mb-1">CVV</label>
                  <input value={cvv} onChange={e=>setCvv(e.target.value)} className="w-full border border-[#FFE082] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FFC107]" placeholder="123" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={()=>processPayment(true)} disabled={processing || !cardName || !cardNumber || !expiry || !cvv} className="flex-1 py-3 rounded-2xl bg-[#FFC107] text-black font-semibold text-sm hover:bg-[#FFB300] disabled:opacity-60 disabled:cursor-not-allowed">
                {processing ? 'Processing…' : 'Pay'}
              </button>
              <button onClick={()=>processPayment(false)} disabled={processing || !cardName || !cardNumber || !expiry || !cvv} className="flex-1 py-3 rounded-2xl border border-red-400 text-red-700 font-semibold text-sm hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed">
                {processing ? 'Processing…' : 'Simulate Failure'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Animation Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-green-500 flex items-center justify-center animate-bounce shadow-2xl">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
            <p className="mt-4 text-white font-semibold">Payment Successful</p>
          </div>
        </div>
      )}

      {/* Failure Animation Overlay */}
      {showFailure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-red-500 flex items-center justify-center animate-bounce shadow-2xl">
              <XCircle className="w-16 h-16 text-white" />
            </div>
            <p className="mt-4 text-white font-semibold">Payment Failed</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStep;

