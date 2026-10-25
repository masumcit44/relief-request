// src/components/map/Legend.tsx [M3]
import React from 'react';

export const Legend: React.FC = () => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 p-3 text-xs space-y-1.5 pointer-events-auto z-[1000]">
      <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
        Triage Legend / ক্যাটাগরি
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3.5 h-3.5 rounded-full bg-red-600 border border-white shadow-sm flex-shrink-0"></span>
        <span className="text-slate-700 font-medium">High Urgency / জরুরি (Pending)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white shadow-sm flex-shrink-0"></span>
        <span className="text-slate-700 font-medium">Medium Urgency / মাঝারি (Pending)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-white shadow-sm flex-shrink-0"></span>
        <span className="text-slate-700 font-medium">Rescued / উদ্ধার সম্পন্ন</span>
      </div>
      <div className="pt-1 text-[10px] text-slate-500 border-t border-slate-100">
        Circle size indicates number of stranded people
      </div>
    </div>
  );
};

