import React, { useState, useEffect } from "react";
import { getClaims } from "../../../api/OperatingOfficer/operatingOfficerApi";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Clock, Inbox } from "lucide-react";
// import Sidebar from "../../../components/Bars/SideBars/Operating"; // Adjust the path if needed

const OpDash: React.FC = () => {
 

 

  const [stats, setStats] = useState<{ total: number; approved: number; rejected: number; inReview: number } | null>(null);
  const navigate = useNavigate();

  const fetchStats = async () => {
    const claims = await getClaims();
    const approved = claims.filter(c => c.status === "Approved").length;
    const rejected = claims.filter(c => c.status === "Rejected").length;
    const inReview = claims.filter(c => c.status === "In Review").length;
    setStats({ total: claims.length, approved, rejected, inReview });
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <>
      {/* Embedded CSS to match soft gradient background */}
      <style>{`
        .custom-dashboard-bg {
          background: linear-gradient(135deg, #fffaf3 0%, #fff4e5 100%);
        }
      `}</style>

      {/* Page Wrapper with Custom Background */}
      <div className="min-h-screen flex custom-dashboard-bg">
        {/* Sidebar */}
      

        {/* Main Content */}
        <main className={`
          flex-1 transition-all duration-300 min-h-screen
        `}>
          {/* Mobile Header with Menu Button */}
          <div className="md:hidden bg-gradient-to-br from-honey-light via-honey-cream to-honey-gold/10 p-4 border-b border-yellow-400">
            {/* <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-amber-700 text-white hover:bg-amber-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button> */}
          </div>

          <div className="min-h-screen bg-gradient-to-br from-honey-light via-honey-cream to-honey-gold/10 p-6 rounded-xl shadow-md">
            <header className="mb-4 border-b pb-2 border-yellow-400">
              <h1 className="text-3xl font-bold text-amber-900">
                Operating Officer Dashboard
              </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200 cursor-pointer" onClick={() => navigate("/operating-claims")}> 
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-600 font-medium">Total Claims</p>
                    <p className="text-2xl font-bold text-amber-900 mt-1">{stats?.total ?? 0}</p>
                  </div>
                  <Inbox className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200"> 
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Approved</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">{stats?.approved ?? 0}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-red-200"> 
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 font-medium">Rejected</p>
                    <p className="text-2xl font-bold text-red-900 mt-1">{stats?.rejected ?? 0}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-200"> 
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">In Review</p>
                    <p className="text-2xl font-bold text-yellow-900 mt-1">{stats?.inReview ?? 0}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button onClick={() => navigate("/operating-claims")} className="bg-white text-amber-700 px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors">
                Go to Claims
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default OpDash;
