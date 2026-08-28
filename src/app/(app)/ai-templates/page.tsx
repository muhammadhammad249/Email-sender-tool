'use client';
import React, { useState } from 'react';

export default function AiTemplatesPage() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleAccess = () => {
    setAccessGranted(true);
    setToastMessage('Early access request sent! Check your email.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="font-sans max-w-7xl mx-auto relative">
      
      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="px-6 py-4 rounded-xl shadow-2xl bg-[#151E30] border border-[#1E293B] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center border bg-[#8B5CF6]/10 border-[#8B5CF6]/20 text-[#8B5CF6]">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className="font-medium text-sm text-[#F8FAFC]">{toastMessage}</span>
        </div>
      </div>

      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC]">AI Templates</h1>
        <p className="mt-2 text-[#94A3B8]">Pre-built AI prompts and email templates for higher conversion.</p>
      </div>
      <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-12 text-center animate-fade-in-up delay-1">
        <div className="w-16 h-16 rounded-full bg-[#151E30] mx-auto flex items-center justify-center mb-4 border border-[#1E293B]">
          <svg className="w-8 h-8 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">Template Library Coming Soon</h3>
        <p className="text-[#94A3B8] mb-6">Our AI experts are curating the best-performing templates.</p>
        <button 
          onClick={handleAccess}
          disabled={accessGranted}
          className={`px-6 py-2 font-medium rounded-xl transition-all btn-press flex items-center justify-center gap-2 mx-auto ${
            accessGranted 
              ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 cursor-default' 
              : 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-[0_0_15px_rgba(139,92,246,0.3)]'
          }`}
        >
          {accessGranted ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Requested
            </>
          ) : (
            'Browse Early Access'
          )}
        </button>
      </div>
    </div>
  );
}
