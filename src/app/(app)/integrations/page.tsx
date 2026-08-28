'use client';
import React, { useState } from 'react';

export default function IntegrationsPage() {
  const [joinedBeta, setJoinedBeta] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleJoinBeta = () => {
    setJoinedBeta(true);
    setToastMessage('You have been added to the beta waitlist!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="font-sans max-w-7xl mx-auto relative">
      
      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="px-6 py-4 rounded-xl shadow-2xl bg-[#151E30] border border-[#1E293B] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center border bg-[#06B6D4]/10 border-[#06B6D4]/20 text-[#06B6D4]">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <span className="font-medium text-sm text-[#F8FAFC]">{toastMessage}</span>
        </div>
      </div>

      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC]">Integrations</h1>
        <p className="mt-2 text-[#94A3B8]">Connect OutreachPro with your favorite CRM and sales tools.</p>
      </div>
      <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-12 text-center animate-fade-in-up delay-1">
        <div className="w-16 h-16 rounded-full bg-[#151E30] mx-auto flex items-center justify-center mb-4 border border-[#1E293B]">
          <svg className="w-8 h-8 text-[#06B6D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
        </div>
        <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">Integrations Hub Coming Soon</h3>
        <p className="text-[#94A3B8] mb-6">HubSpot, Salesforce, and Zapier integrations are currently in beta.</p>
        <button 
          onClick={handleJoinBeta}
          disabled={joinedBeta}
          className={`px-6 py-2 font-medium rounded-xl transition-all btn-press flex items-center justify-center gap-2 mx-auto ${
            joinedBeta 
              ? 'bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 cursor-default' 
              : 'bg-[#06B6D4] text-white hover:bg-[#0891B2] shadow-[0_0_15px_rgba(6,182,212,0.3)]'
          }`}
        >
          {joinedBeta ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Joined Beta
            </>
          ) : (
            'Join Beta'
          )}
        </button>
      </div>
    </div>
  );
}
