// src/app/sos/success/page.tsx [M1]
'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || 'N/A';
  const count = searchParams.get('count') || '1';

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center space-y-6 border border-emerald-100">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
          ✓
        </div>

        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">
            Help is on the way!
          </h1>
          <p className="text-lg font-bold text-emerald-700">
            সাহায্য দল রওনা দিচ্ছে!
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Request ID:</span>
            <span className="font-mono font-bold text-gray-800 text-xs truncate max-w-[200px]">{id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">People Reported:</span>
            <span className="font-bold text-gray-800">{count} জন</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className="inline-block bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-semibold">
              Pending Rescue / উদ্ধার প্রক্রিয়াধীন
            </span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left space-y-2">
          <h2 className="font-bold text-amber-900 text-sm">Critical Safety Instructions / জরুরি নির্দেশনা:</h2>
          <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
            <li>Stay on highest ground or roof / ছাদ বা উঁচু স্থানে অবস্থান করুন।</li>
            <li>Keep phone charged, turn on battery saver / ফোনের চার্জ বাঁচান।</li>
            <li>Wave a bright cloth or whistle when boat approaches / নৌকা কাছে এলে উজ্জ্বল কাপড় বা আলো দেখান।</li>
          </ul>
        </div>

        <div className="pt-2 space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 px-4 rounded-xl bg-gray-100 text-gray-800 font-bold hover:bg-gray-200 transition-colors"
          >
            Submit Another Request / নতুন অনুরোধ পাঠান
          </button>
          <div>
            <Link
              href="/rescuer"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Go to Rescuer Dashboard / উদ্ধারকারী ড্যাশবোর্ড দেখুন →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

