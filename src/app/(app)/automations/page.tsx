'use client';
import React, { useState } from 'react';

export default function AutomationsPage() {
  const [notified, setNotified] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleNotify = () => {
    setNotified(true);
    setToastMessage('You will be notified when Automations are live!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="font-sans max-w-7xl mx-auto relative">
      
      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="px-6 py-4 rounded-xl shadow-2xl bg-[#151E30] border border-[#1E293B] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center border bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <span className="font-medium text-sm text-[#F8FAFC]">{toastMessage}</span>
        </div>
      </div>

      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC]">Automations</h1>
        <p className="mt-2 text-[#94A3B8]">Set up triggers and actions to automate your workflow.</p>
      </div>
      <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-12 text-center animate-fade-in-up delay-1">
        <div className="w-16 h-16 rounded-full bg-[#151E30] mx-auto flex items-center justify-center mb-4 border border-[#1E293B]">
          <svg className="w-8 h-8 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">Automations Coming Soon</h3>
        <p className="text-[#94A3B8] mb-6">We are working hard to bring you powerful workflow automations.</p>
        <button 
          onClick={handleNotify}
          disabled={notified}
          className={`px-6 py-2 font-medium rounded-xl transition-all btn-press flex items-center justify-center gap-2 mx-auto ${
            notified 
              ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 cursor-default' 
              : 'bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-[0_0_15px_rgba(59,130,246,0.3)]'
          }`}
        >
          {notified ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Subscribed
            </>
          ) : (
            'Notify Me'
          )}
        </button>
      </div>
    </div>
  );
}
