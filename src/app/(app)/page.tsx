'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);
  const formatPercent = (num: number) => `${(num / 10).toFixed(1)}%`;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDownloadReport = () => {
    showToast('Generating report...');
    setTimeout(() => {
      const a = document.createElement('a');
      a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Dashboard Report\nEmails Sent: 14,205\nAvg Open Rate: 42.8%\nReply Rate: 18.4%'));
      a.setAttribute('download', 'dashboard_report.txt');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Report downloaded successfully!');
    }, 1000);
  };

  return (
    <div className="font-sans relative">
      
      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="px-6 py-4 rounded-xl shadow-2xl bg-[#151E30] border border-[#1E293B] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center border bg-[#3B82F6]/10 border-[#3B82F6]/20 text-[#3B82F6]">
             <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className="font-medium text-sm text-[#F8FAFC]">{toastMessage}</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl flex items-center gap-3">
            Overview
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-badge-pulse" /> Live
            </span>
          </h1>
          <p className="mt-2 text-[#94A3B8]">Welcome back, Alex. Here's what's happening with your outreach today.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleDownloadReport} className="px-4 py-2 bg-[#111827] border border-[#1E293B] hover:border-[#3B82F6]/50 text-[#F8FAFC] text-sm font-medium rounded-xl transition-all shadow-lg btn-press">
            Download Report
          </button>
          <Link href="/campaigns" className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2 btn-press">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Campaign
          </Link>
        </div>
      </div>

      {/* Top KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Emails Sent', value: 14205, formatter: formatNumber, change: '+12.5%', isPositive: true, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10' },
          { label: 'Avg. Open Rate', value: 428, formatter: formatPercent, change: '+5.2%', isPositive: true, icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', color: 'text-[#06B6D4]', bg: 'bg-[#06B6D4]/10' },
          { label: 'Reply Rate', value: 184, formatter: formatPercent, change: '-1.1%', isPositive: false, icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6', color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10' },
          { label: 'Meetings Booked', value: 45, formatter: formatNumber, change: '+24.0%', isPositive: true, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
        ].map((stat, i) => (
          <div key={i} className={`bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-6 card-hover shadow-xl animate-fade-in-up delay-${i}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <svg className={`w-5 h-5 ${stat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                {stat.isPositive ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                )}
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-[#94A3B8] text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-[#F8FAFC] tracking-tight">
                {mounted ? <AnimatedNumber value={stat.value} format={stat.formatter} duration={2000 + i * 200} /> : '0'}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Chart Area */}
        <div className="xl:col-span-2 bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-6 shadow-xl flex flex-col animate-fade-in-up delay-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#F8FAFC]">Engagement Over Time</h3>
            <select className="bg-[#151E30] border border-[#1E293B] text-[#94A3B8] text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-colors">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Quarter</option>
            </select>
          </div>
          
          {/* Animated Bar Chart */}
          <div className="flex-1 min-h-[300px] w-full rounded-xl border border-[#1E293B] p-4 flex items-end justify-between gap-2 relative bg-[#0D1424]/50">
             <div className="absolute left-4 top-4 bottom-4 flex flex-col justify-between text-xs text-[#94A3B8] font-medium pb-6">
               <span>1k</span><span>750</span><span>500</span><span>250</span><span>0</span>
             </div>
             
             <div className="absolute inset-x-12 top-6 bottom-10 flex flex-col justify-between pointer-events-none">
               {[1,2,3,4].map((i) => <div key={i} className="w-full border-b border-[#1E293B] border-dashed opacity-50" />)}
             </div>

             <div className="flex-1 flex items-end justify-around pl-10 h-[260px] pb-2">
               {[40, 70, 45, 90, 60, 80, 100].map((height, i) => (
                 <div key={i} className="w-full max-w-[40px] flex flex-col items-center gap-2 group cursor-pointer relative z-10">
                   <div 
                     className="w-full bg-[#3B82F6]/20 rounded-t-md group-hover:bg-[#3B82F6]/40 transition-colors relative animate-bar-grow" 
                     style={{ height: mounted ? `${height}%` : '0%', animationDelay: `${i * 100}ms` }}
                   >
                     <div className="absolute top-0 left-0 right-0 bg-[#3B82F6] rounded-t-md shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{ height: '2px' }} />
                     
                     <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-[#151E30] border border-[#1E293B] text-[#F8FAFC] text-xs font-bold px-2 py-1 rounded shadow-xl transition-all duration-200 whitespace-nowrap z-20 translate-y-2 group-hover:translate-y-0">
                       {height * 10} emails
                     </div>
                   </div>
                   <span className="text-[10px] text-[#94A3B8] font-medium">Day {i+1}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8 animate-fade-in-up delay-5">
          
          {/* Email Queue Status */}
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-6 shadow-xl card-hover">
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-5">Email Queue</h3>
            <div className="space-y-4">
              {[
                { name: 'John Doe', status: 'Sending...', color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]', pulse: true },
                { name: 'Sarah Chen', status: 'Sent ✓', color: 'text-[#22C55E]', bg: 'bg-[#22C55E]', pulse: false },
                { name: 'Michael Smith', status: 'Queued', color: 'text-[#94A3B8]', bg: 'bg-[#94A3B8]', pulse: true },
                { name: 'David Lee', status: 'Sending...', color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]', pulse: true },
                { name: 'Robert King', status: 'Sent ✓', color: 'text-[#22C55E]', bg: 'bg-[#22C55E]', pulse: false },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-[#151E30] border border-[#1E293B] hover:border-[#3B82F6]/30 transition-colors">
                  <span className="text-sm font-medium text-[#F8FAFC]">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${item.color}`}>{item.status}</span>
                    <span className={`w-2 h-2 rounded-full ${item.bg} ${item.pulse ? 'animate-badge-pulse shadow-[0_0_8px_currentColor]' : ''}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-6 shadow-xl card-hover">
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-5">Live Activity</h3>
            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-[#1E293B]">
              {[
                { title: 'John replied', time: '2 mins ago', color: 'bg-[#8B5CF6]', border: 'border-[#8B5CF6]' },
                { title: 'Email delivered to Sarah', time: '5 mins ago', color: 'bg-[#22C55E]', border: 'border-[#22C55E]' },
                { title: 'Campaign started', time: '10 mins ago', color: 'bg-[#3B82F6]', border: 'border-[#3B82F6]' },
                { title: '25 leads verified', time: '15 mins ago', color: 'bg-[#06B6D4]', border: 'border-[#06B6D4]' },
              ].map((activity, i) => (
                <div key={i} className={`relative flex gap-4 animate-fade-in-up`} style={{ animationDelay: `${(i+6)*100}ms` }}>
                  <div className={`w-4 h-4 rounded-full ${activity.color} border-2 border-[#111827] z-10 shadow-[0_0_10px_currentColor]`} />
                  <div className="flex-1 -mt-1">
                    <p className="text-sm font-medium text-[#F8FAFC]">{activity.title}</p>
                    <p className="text-xs text-[#94A3B8]">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
