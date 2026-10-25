// src/app/rescuer/page.tsx [M3]
'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { useSosFeed } from '@/hooks/useSosFeed';
import { sortForTriage, markerColor } from '@/lib/markerColor';
import { StatsBar } from '@/components/map/StatsBar';
import { SosRequest } from '@/lib/types';
import { Spinner } from '@/components/ui/Spinner';

// Dynamically import Leaflet Map with SSR disabled
const RescueMap = dynamic(() => import('@/components/map/RescueMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-120px)] rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-500 gap-3 border border-slate-200">
      <Spinner size="lg" className="text-blue-600" />
      <span className="font-semibold text-sm">Initializing Rescuer Map... / ম্যাপ লোড হচ্ছে...</span>
    </div>
  ),
});

function formatRelativeTime(timestamp: string): string {
  const diffInMinutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  return `${diffInHours}h ago`;
}

export default function RescuerPage() {
  const { rows, freshIds, loading, error, markRescued } = useSosFeed();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'rescued'>('pending');

  // Sorted list for triage (pending first, High before Medium, oldest first)
  const sortedRows = useMemo(() => {
    return sortForTriage(rows);
  }, [rows]);

  const filteredRows = useMemo(() => {
    if (filter === 'all') return sortedRows;
    return sortedRows.filter(r => r.status === filter);
  }, [sortedRows, filter]);

  const handleSelectItem = (req: SosRequest) => {
    setSelectedId(req.id);
    setFlyTarget({ lat: req.lat, lng: req.lng });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Stats Bar */}
      <StatsBar rows={rows} />

      {/* Main Body: Responsive Map + Triage List */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 flex flex-col lg:flex-row gap-4">
        {/* Left: Map Container (calc height) */}
        <div className="w-full lg:w-8/12 xl:w-3/4 flex flex-col">
          {error && (
            <div className="mb-2 p-2 bg-amber-50 border border-amber-300 text-amber-800 text-xs rounded-lg flex items-center justify-between">
              <span>Notice: {error}</span>
            </div>
          )}
          <RescueMap
            rows={rows}
            freshIds={freshIds}
            selectedId={selectedId}
            onMarkRescued={markRescued}
            centerTarget={flyTarget}
          />
        </div>

        {/* Right: Triage Queue Sidebar */}
        <div className="w-full lg:w-4/12 xl:w-1/4 flex flex-col h-[500px] lg:h-[calc(100vh-120px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header & Filter Controls */}
          <div className="p-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <span>Priority Triage Queue</span>
                <span className="text-xs font-normal text-slate-500">
                  ({filteredRows.length})
                </span>
              </h2>
              <Link
                href="/"
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                + Victim SOS
              </Link>
            </div>

            {/* Filter tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilter('pending')}
                className={`py-1 rounded-md transition-all ${
                  filter === 'pending'
                    ? 'bg-white text-red-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setFilter('rescued')}
                className={`py-1 rounded-md transition-all ${
                  filter === 'rescued'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rescued
              </button>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`py-1 rounded-md transition-all ${
                  filter === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 divide-y divide-slate-100">
            {loading && rows.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                <Spinner size="md" className="text-slate-400" />
                <span>Loading SOS requests...</span>
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No {filter} requests found.
              </div>
            ) : (
              filteredRows.map(req => {
                const isSelected = selectedId === req.id;
                const isFresh = freshIds.has(req.id);
                const color = markerColor(req);

                return (
                  <div
                    key={req.id}
                    onClick={() => handleSelectItem(req)}
                    className={`pt-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                    } ${isFresh ? 'animate-pulse ring-2 ring-red-400' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="truncate">{req.name}</span>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded text-white flex-shrink-0 ${
                          req.urgency === 'High' ? 'bg-red-600' : 'bg-amber-500'
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-800">
                        {req.people_count} জন ({req.people_count} people)
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatRelativeTime(req.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-mono text-slate-500 truncate text-[10px]">
                        {req.lat.toFixed(4)}, {req.lng.toFixed(4)}
                      </span>
                      {req.status === 'pending' ? (
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            markRescued(req.id);
                          }}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm text-[10px] transition-colors"
                        >
                          Mark Rescued
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-extrabold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                          ✓ Rescued
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

