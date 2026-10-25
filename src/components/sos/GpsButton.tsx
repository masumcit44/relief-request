// src/components/sos/GpsButton.tsx [M1]
'use client';

import React, { useState } from 'react';
import { getPosition, GeoPosition } from '@/lib/geolocation';
import { Spinner } from '@/components/ui/Spinner';

interface GpsButtonProps {
  onLocationObtained: (pos: GeoPosition) => void;
}

export const GpsButton: React.FC<GpsButtonProps> = ({ onLocationObtained }) => {
  const [status, setStatus] = useState<'idle' | 'locating' | 'ok' | 'error'>('idle');
  const [coords, setCoords] = useState<GeoPosition | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleGetLocation = async () => {
    setStatus('locating');
    setErrorMessage('');
    try {
      const pos = await getPosition();
      setCoords(pos);
      setStatus('ok');
      onLocationObtained(pos);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Could not fetch location.');
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleGetLocation}
        disabled={status === 'locating'}
        className={`w-full py-4 px-6 rounded-xl font-extrabold text-xl shadow-lg transition-all min-h-[64px] flex items-center justify-center gap-3 ${
          status === 'ok'
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
        }`}
      >
        {status === 'locating' ? (
          <>
            <Spinner size="md" className="text-white" />
            <span>Getting Location / লোকেশন নেওয়া হচ্ছে...</span>
          </>
        ) : status === 'ok' ? (
          <>
            <span>✓ GPS Location Locked / লোকেশন পাওয়া গেছে</span>
          </>
        ) : (
          <>
            <span>📍 Send GPS Location / লোকেশন পাঠান</span>
          </>
        )}
      </button>

      {status === 'ok' && coords && (
        <div className="text-sm bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-200">
          <p className="font-semibold">
            Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)} (±{Math.round(coords.accuracy)}m)
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="text-sm bg-red-50 text-red-800 p-3 rounded-lg border border-red-200 space-y-2">
          <p>{errorMessage}</p>
          <button
            type="button"
            onClick={handleGetLocation}
            className="text-xs bg-red-600 text-white px-3 py-1.5 rounded font-semibold hover:bg-red-700"
          >
            Retry / আবার চেষ্টা করুন
          </button>
        </div>
      )}
    </div>
  );
};

