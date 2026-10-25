// src/components/ui/Card.tsx [M1]
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-100 p-4 ${className}`}>
      {children}
    </div>
  );
};

