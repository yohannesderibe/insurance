import React from "react";
import { X, Sparkles } from "lucide-react";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any> | null;
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, title, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-900/15 to-yellow-900/10 backdrop-blur-lg"
        onClick={onClose}
      ></div>

      {/* Wider Modal Box */}
      <div className="relative bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-2xl max-w-2xl w-full border border-amber-300/50 animate-scaleIn">
        {/* Lighter Orange Header */}
        <div className="bg-gradient-to-r from-amber-300 to-amber-200 rounded-t-3xl p-6 relative overflow-hidden border-b border-amber-400/30">
          <div className="absolute top-2 right-2 opacity-20">
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>
          <div className="flex justify-between items-center relative z-10">
            <h2 className="text-2xl font-bold text-amber-900 drop-shadow-sm">{title}</h2>
            <button
              onClick={onClose}
              className="text-amber-700 hover:text-amber-900 transition-all duration-300 hover:scale-110 bg-white/50 p-2 rounded-full border border-amber-300/50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 max-h-96 overflow-y-auto custom-scrollbar">
          {data ? (
            <div className="space-y-4">
              {Object.entries(data).map(([key, value]) => (
                <div
                  key={key}
                  className="group flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-200/50 hover:border-amber-300 hover:shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"></div>
                    <span className="text-amber-800 font-semibold capitalize text-base">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                  </div>
                  <span className="text-amber-900 font-medium bg-white/60 px-4 py-2 rounded-lg text-base border border-amber-200/50 min-w-[150px] text-right">
                    {String(value) || "—"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-amber-200 to-amber-300 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-amber-700" />
              </div>
              <p className="text-amber-700 italic font-medium text-lg">No data available</p>
            </div>
          )}
        </div>

        {/* Lighter Bottom Border */}
        <div className="h-2 bg-gradient-to-r from-amber-300 to-amber-400 rounded-b-3xl"></div>
      </div>
    </div>
  );
};

export default DetailModal;