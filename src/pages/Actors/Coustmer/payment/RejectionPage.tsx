import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useInsuranceApplication } from "../../../../context/InsuranceApplicationContext";
import { AlertTriangle, RotateCcw, PhoneCall } from "lucide-react";

const RejectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { personalInfo, financeDecision, resetApplication } = useInsuranceApplication();

  // Keep accessible always; we will show a list with mock items

  const handleResubmit = () => {
    resetApplication();
    navigate("/insurance/apply/personal");
  };

  const handleContact = () => {
    window.location.href = "mailto:support@beesure.com";
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-[#FFE082] p-6 md:p-10">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-16 h-16 mx-auto text-[#D32F2F]" />
          <h1 className="text-3xl font-bold text-[#000000]">Application Not Approved</h1>
          <p className="text-[#5D4037] max-w-2xl mx-auto">
            Unfortunately, your insurance application could not be approved at this time. Review the details, make the
            necessary updates, or reach out to our support bees for guidance.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-[#000000] mb-3">Recent Decisions</h2>
          <div className="space-y-3">
            {[
              { id: 'r-1', title: 'Auto Insurance - Corolla 2022', status: 'rejected', reason: 'Missing document: registration copy' },
              { id: 'a-1', title: 'Auto Insurance - Civic 2021', status: 'approved', reason: 'All details verified' },
              { id: 'r-2', title: 'Auto Insurance - Hilux 2020', status: 'rejected', reason: 'Inconsistent VIN' }
            ].map(item => (
              <div key={item.id} className={`border rounded-2xl p-4 flex items-start justify-between ${item.status==='approved' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${item.status==='approved' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <p className="font-semibold text-[#000000]">{item.title}</p>
                  </div>
                  <p className="text-sm text-[#5D4037] mt-1">{item.status==='approved' ? 'Approved' : 'Rejected'} - {item.reason}</p>
                </div>
                {item.status==='approved' ? (
                  <button onClick={()=>navigate('/insurance/apply/payment')} className="px-3 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold">
                    Proceed to Payment
                  </button>
                ) : (
                  <button onClick={()=>navigate('/insurance/apply/personal')} className="px-3 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold">
                    Edit & Resubmit
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <button
            onClick={handleResubmit}
            className="flex-1 py-3 rounded-2xl bg-[#FFC107] text-black font-semibold text-sm hover:bg-[#FFB300] transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Resubmit Application
          </button>
          <button
            onClick={handleContact}
            className="flex-1 py-3 rounded-2xl border border-[#FFC107] text-[#000000] font-semibold text-sm hover:bg-white transition-colors flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-5 h-5" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionPage;

