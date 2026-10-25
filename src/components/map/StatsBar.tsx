// src/components/map/StatsBar.tsx [M3]
import React from 'react';
import { SosRequest } from '@/lib/types';

interface StatsBarProps {
  rows: SosRequest[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ rows }) => {
  const pendingRequests = rows.filter(r => r.status === 'pending');
  const rescuedRequests = rows.filter(r => r.status === 'rescued');

  const pendingCount = pendingRequests.length;
  const highPendingCount = pendingRequests.filter(r => r.urgency === 'High').length;
  const peopleWaiting = pendingRequests.reduce((acc, curr) => acc + (curr.people_count || 1), 0);
  const rescuedCount = rescuedRequests.length;
  const rescuedPeople = rescuedRequests.reduce((acc, curr) => acc + (curr.people_count || 1), 0);

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
            SOS
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              ReliefRequest Rescuer Dashboard
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Feni • Noakhali • Cumilla Flood Response Control
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          {/* Pending Requests */}
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 text-center min-w-[90px]">
            <div className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Pending
            </div>
            <div className="text-lg font-black text-red-700 leading-none mt-0.5">
              {pendingCount}
              {highPendingCount > 0 && (
                <span className="text-[11px] font-normal text-red-600 ml-1">
                  ({highPendingCount} High)
                </span>
              )}
            </div>
          </div>

          {/* People Waiting */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-center min-w-[95px]">
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              People Waiting
            </div>
            <div className="text-lg font-black text-amber-800 leading-none mt-0.5">
              {peopleWaiting} <span className="text-xs font-semibold">জন</span>
            </div>
          </div>

          {/* Rescued */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 text-center min-w-[90px]">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Rescued
            </div>
            <div className="text-lg font-black text-emerald-800 leading-none mt-0.5">
              {rescuedCount} <span className="text-xs font-semibold">({rescuedPeople} জন)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

