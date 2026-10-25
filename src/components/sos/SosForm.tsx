// src/components/sos/SosForm.tsx [M1]
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Urgency } from '@/lib/types';
import { createSos } from '@/lib/sosApi';
import { GeoPosition } from '@/lib/geolocation';
import { UrgencyToggle } from './UrgencyToggle';
import { GpsButton } from './GpsButton';
import { Spinner } from '@/components/ui/Spinner';

export const SosForm: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const [urgency, setUrgency] = useState<Urgency>('High');
  const [coords, setCoords] = useState<GeoPosition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coords) {
      setErrorMsg('Please tap "Send GPS Location" first / অনুগ্রহ করে আগে লোকেশন বোতামে চাপ দিন');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const row = await createSos({
        name: name.trim() || 'Unknown',
        people_count: peopleCount,
        urgency,
        lat: coords.lat,
        lng: coords.lng,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('lastSos', JSON.stringify(row));
      }

      router.push(`/sos/success?id=${row.id}&count=${row.people_count}`);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Input */}
      <div>
        <label htmlFor="name-input" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name / আপনার নাম (ঐচ্ছিক / Optional)
        </label>
        <input
          id="name-input"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Rahima Begum"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
        />
      </div>

      {/* People Count Stepper */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of People Stranded / আটকে পড়া মানুষের সংখ্যা
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setPeopleCount(prev => Math.max(1, prev - 1))}
            className="w-14 h-14 rounded-xl bg-gray-200 text-gray-800 text-2xl font-bold flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            -
          </button>
          <span className="text-3xl font-extrabold w-16 text-center text-gray-900">
            {peopleCount}
          </span>
          <button
            type="button"
            onClick={() => setPeopleCount(prev => Math.min(50, prev + 1))}
            className="w-14 h-14 rounded-xl bg-gray-200 text-gray-800 text-2xl font-bold flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Urgency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Urgency Level / জরুরি অবস্থা
        </label>
        <UrgencyToggle value={urgency} onChange={setUrgency} />
      </div>

      {/* GPS Button */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Step 1: Your GPS Location / আপনার লোকেশন
        </label>
        <GpsButton onLocationObtained={setCoords} />
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!coords || isSubmitting}
        className="w-full py-4 px-6 rounded-xl font-black text-xl text-white shadow-xl transition-all min-h-[56px] flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Spinner size="md" className="text-white" />
            <span>Sending SOS / পাঠানো হচ্ছে...</span>
          </>
        ) : (
          <span>🚨 Step 2: Send SOS / সাহায্য পাঠান</span>
        )}
      </button>
    </form>
  );
};

