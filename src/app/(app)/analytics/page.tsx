'use client';
import React, { useState, useEffect } from 'react';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="font-sans relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="sm:flex sm:items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC]">Analytics</h1>
            <p className="mt-2 text-[#94A3B8]">Deep dive into your outreach performance and conversion metrics.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
             <select className="bg-[#111827] border border-[#1E293B] text-[#F8FAFC] text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-colors shadow-lg">
               <option>Last 30 Days</option>
               <option>Last 90 Days</option>
               <option>Year to Date</option>
               <option>All Time</option>
             </select>
          </div>
        </div>

        {/* Top Funnel KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Sent', value: 45200, color: 'text-[#3B82F6]' },
            { label: 'Delivered', value: 44100, color: 'text-[#06B6D4]' },
            { label: 'Opened', value: 22500, color: 'text-[#8B5CF6]' },
            { label: 'Replied', value: 3100, color: 'text-[#22C55E]' },
          ].map((stat, i) => (
            <div key={i} className={`bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-6 shadow-xl card-hover animate-fade-in-up delay-${i}`}>
              <p className="text-[#94A3B8] text-sm font-medium mb-2">{stat.label}</p>
              <h3 className={`text-3xl font-bold tracking-tight ${stat.color}`}>
                {mounted ? <AnimatedNumber value={stat.value} duration={1500 + i * 200} /> : '0'}
              </h3>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Conversion Funnel (Bar Chart) */}
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-6 shadow-xl animate-fade-in-up delay-4">
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-6">Conversion Funnel</h3>
            <div className="h-64 flex items-end justify-around pb-2 relative bg-[#0D1424]/50 border-b border-[#1E293B] rounded-t-xl px-4 pt-4 mt-8">
               <div className="absolute inset-x-4 top-0 bottom-0 flex flex-col justify-between pointer-events-none opacity-20">
                 {[1,2,3,4,5].map(i => <div key={i} className="w-full border-b border-[#1E293B] border-dashed" />)}
               </div>
               {[
                 { label: 'Sent', height: 100, color: 'bg-[#3B82F6]' },
                 { label: 'Delivered', height: 98, color: 'bg-[#06B6D4]' },
                 { label: 'Opened', height: 50, color: 'bg-[#8B5CF6]' },
                 { label: 'Clicked', height: 25, color: 'bg-[#F59E0B]' },
                 { label: 'Replied', height: 8, color: 'bg-[#22C55E]' },
               ].map((bar, i) => (
                 <div key={i} className="w-full max-w-[60px] flex flex-col items-center gap-2 group relative z-10">
                   <div 
                     className={`w-full ${bar.color}/20 rounded-t-md group-hover:${bar.color}/40 transition-colors relative animate-bar-grow`} 
                     style={{ height: mounted ? `${bar.height}%` : '0%', animationDelay: `${i * 150}ms` }}
                   >
                     <div className={`absolute top-0 left-0 right-0 ${bar.color} rounded-t-md shadow-[0_0_15px_currentColor]`} style={{ height: '3px' }} />
                     <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#151E30] border border-[#1E293B] text-[#F8FAFC] text-xs font-bold px-2 py-1 rounded shadow-xl transition-all duration-200 whitespace-nowrap z-20">
                       {bar.height}%
                     </div>
                   </div>
                   <span className="absolute -bottom-8 text-xs text-[#94A3B8] font-medium whitespace-nowrap">{bar.label}</span>
                 </div>
               ))}
            </div>
            <div className="h-8" /> {/* Spacer for labels */}
          </div>

          {/* Email Quality (Donut/Progress) */}
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-6 shadow-xl animate-fade-in-up delay-5">
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-6">Deliverability Health</h3>
            
            <div className="flex items-center justify-center h-64 relative mt-8">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-[#151E30]" />
                <circle 
                  cx="96" cy="96" r="80" 
                  stroke="currentColor" 
                  strokeWidth="16" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 80}
                  strokeDashoffset={mounted ? (2 * Math.PI * 80) * (1 - 0.98) : 2 * Math.PI * 80}
                  className="text-[#22C55E] transition-all duration-[2000ms] ease-out shadow-[0_0_30px_rgba(34,197,94,0.3)] drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#F8FAFC] drop-shadow-md">
                  {mounted ? <AnimatedNumber value={98} duration={2000} /> : '0'}%
                </span>
                <span className="text-xs text-[#94A3B8] font-medium uppercase tracking-wider">Excellent</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
               <div className="p-3 bg-[#151E30] rounded-xl border border-[#1E293B]">
                 <p className="text-xs text-[#94A3B8] mb-1">Bounces</p>
                 <p className="text-lg font-bold text-[#EF4444]">1.2%</p>
               </div>
               <div className="p-3 bg-[#151E30] rounded-xl border border-[#1E293B]">
                 <p className="text-xs text-[#94A3B8] mb-1">Unsubscribes</p>
                 <p className="text-lg font-bold text-[#F59E0B]">0.8%</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
