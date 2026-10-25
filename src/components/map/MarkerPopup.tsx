// src/components/map/MarkerPopup.tsx [M3]
'use client';

import React, { useState } from 'react';
import { Popup } from 'react-leaflet';
import { SosRequest } from '@/lib/types';

interface MarkerPopupProps {
  request: SosRequest;
  onMarkRescued: (id: string) => Promise<void>;
}

// Relative time helper
function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now / এইমাত্র';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago / ${diffInMinutes} মিনিট আগে`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago / ${diffInHours} ঘণ্টা আগে`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago / ${diffInDays} দিন আগে`;
}

export const MarkerPopup: React.FC<MarkerPopupProps> = ({ request, onMarkRescued }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleRescue = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      await onMarkRescued(request.id);
    } catch (err: unknown) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setIsUpdating(false);
    }
  };

  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${request.lat},${request.lng}`;

  return (
    <Popup className="sos-marker-popup" minWidth={220}>
      <div className="p-1 space-y-2 font-sans text-slate-800">
        <div className="flex items-center justify-between border-b pb-1.5 gap-2">
          <span className="font-bold text-base truncate">{request.name || 'Unknown'}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded font-extrabold text-white ${
              request.urgency === 'High' ? 'bg-red-600' : 'bg-amber-500'
            }`}
          >
            {request.urgency}
          </span>
        </div>

        <div className="text-xs space-y-1 text-slate-600">
          <div className="flex items-center justify-between font-semibold">
            <span>Stranded People:</span>
            <span className="text-slate-900 font-extrabold text-sm">{request.people_count} জন ({request.people_count} people)</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Reported:</span>
            <span className="text-slate-700">{formatTimeAgo(request.timestamp)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Coordinates:</span>
            <span className="font-mono text-[11px] text-slate-500">{request.lat.toFixed(4)}, {request.lng.toFixed(4)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Status:</span>
            {request.status === 'rescued' ? (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                ✓ Rescued / উদ্ধার সম্পন্ন
              </span>
            ) : (
              <span className="text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                ● Pending / অপেক্ষমান
              </span>
            )}
          </div>
        </div>

        <div className="pt-2 border-t flex flex-col gap-1.5">
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors shadow-sm block"
          >
            🧭 Directions (Google Maps)
          </a>

          {request.status === 'pending' && (
            <button
              type="button"
              onClick={handleRescue}
              disabled={isUpdating}
              className="w-full text-center py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              {isUpdating ? 'Updating... / আপডেট হচ্ছে...' : '✓ Mark Rescued / উদ্ধার সম্পন্ন'}
            </button>
          )}

          {updateError && (
            <p className="text-[11px] text-red-600 text-center">{updateError}</p>
          )}
        </div>
      </div>
    </Popup>
  );
};

