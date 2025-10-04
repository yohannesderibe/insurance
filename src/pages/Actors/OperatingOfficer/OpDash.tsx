import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Bars/SideBars/Operating"; // Adjust the path if needed

const OpDash: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Handle sidebar collapse state
  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  // Close mobile sidebar when clicking outside (optional)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        <Sidebar 
          open={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          onCollapse={handleSidebarCollapse}
        />

        {/* Main Content */}
        <main className={`
          flex-1 transition-all duration-300 min-h-screen
          ${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}
          ${isSidebarOpen ? 'ml-0' : 'ml-0'}
        `}>
          {/* Mobile Header with Menu Button */}
          <div className="md:hidden bg-gradient-to-br from-honey-light via-honey-cream to-honey-gold/10 p-4 border-b border-yellow-400">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-amber-700 text-white hover:bg-amber-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="min-h-screen bg-gradient-to-br from-honey-light via-honey-cream to-honey-gold/10 p-6 rounded-xl shadow-md">
            <header className="mb-4 border-b pb-2 border-yellow-400">
              <h1 className="text-3xl font-bold text-amber-900">
                Operating Officer Dashboard
              </h1>
            </header>

            <p className="text-lg text-amber-900">
              Welcome to the Operating Officer dashboard!
            </p>

            {/* Add more content here */}
          </div>
        </main>
      </div>
    </>
  );
};

export default OpDash;