// src/app/page.tsx [M1]
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SosForm } from '@/components/sos/SosForm';

export default function VictimPage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center p-3 sm:p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {!isOnline && (
          <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-bold animate-pulse">
            ⚠️ You are currently offline. SOS will retry when connected. / আপনি অফলাইনে আছেন।
          </div>
        )}

        <div className="bg-red-700 text-white p-5 sm:p-6 text-center">
          <span className="inline-block bg-red-800 text-red-200 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold mb-2">
            Emergency Flood Relief / বন্যা জরুরি সেবা
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            ReliefRequest — বন্যা SOS
          </h1>
          <p className="text-red-100 text-sm mt-1">
            Tap 2 buttons to send your GPS coordinates to rescue teams.
            <br />
            ২ টি ক্লিকে আপনার অবস্থান রেসকিউ টিমকে জানান।
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <SosForm />

          <div className="mt-8 pt-4 border-t border-gray-100 text-center">
            <Link
              href="/rescuer"
              className="text-xs font-semibold text-gray-500 hover:text-red-700 underline"
            >
              Are you a rescuer or volunteer? Open Rescuer Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
