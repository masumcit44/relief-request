// src/components/sos/UrgencyToggle.tsx [M1]
'use client';

import React from 'react';
import { Urgency } from '@/lib/types';

interface UrgencyToggleProps {
  value: Urgency;
  onChange: (val: Urgency) => void;
}

export const UrgencyToggle: React.FC<UrgencyToggleProps> = ({ value, onChange }) => {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onChange('High')}
        className={`flex-1 py-3 px-4 rounded-lg font-bold border-2 transition-all min-h-[56px] text-lg ${
          value === 'High'
            ? 'bg-red-600 border-red-700 text-white shadow-md'
            : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
        }`}
      >
        High / জরুরি
      </button>
      <button
        type="button"
        onClick={() => onChange('Medium')}
        className={`flex-1 py-3 px-4 rounded-lg font-bold border-2 transition-all min-h-[56px] text-lg ${
          value === 'Medium'
            ? 'bg-amber-500 border-amber-600 text-white shadow-md'
            : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
        }`}
      >
        Medium / মাঝারি
      </button>
    </div>
  );
};

