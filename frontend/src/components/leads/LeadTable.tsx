'use client';
import React, { useState, useEffect } from 'react';

export interface Lead {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  jobTitle?: string;
  verificationStatus: string;
  leadScore: number;
}

interface LeadTableProps {
  leads: Lead[];
}

export function LeadTable({ leads }: LeadTableProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#1E293B]">
        <thead className="bg-[#0D1424]">
          <tr>
            <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded bg-[#151E30] border-[#1E293B] text-[#3B82F6] focus:ring-[#3B82F6] transition-colors" />
                Name
              </div>
            </th>
            <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Email</th>
            <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Company</th>
            <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Status</th>
            <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Score</th>
            <th scope="col" className="relative py-4 pl-3 pr-6"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1E293B] bg-[#111827]">
          {leads.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-sm text-[#94A3B8]">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#151E30] flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  No leads found. Start discovering leads to populate this table.
                </div>
              </td>
            </tr>
          ) : (
            leads.map((lead, i) => (
              <tr 
                key={lead.id} 
                className="hover:bg-[#151E30] transition-colors duration-200 group animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-[#F8FAFC]">
                  <div className="flex items-center gap-3">
                     <input type="checkbox" className="rounded bg-[#080D1A] border-[#1E293B] text-[#3B82F6] focus:ring-[#3B82F6] transition-colors opacity-0 group-hover:opacity-100 data-[state=checked]:opacity-100 cursor-pointer" />
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-xs font-bold text-white shadow-lg">
                       {lead.firstName ? lead.firstName[0] : lead.email[0].toUpperCase()}
                     </div>
                     <span className="group-hover:text-[#3B82F6] transition-colors cursor-pointer">{lead.firstName} {lead.lastName}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-[#94A3B8]">{lead.email}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-[#94A3B8]">{lead.companyName || '-'}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${
                    lead.verificationStatus === 'VALID' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' : 
                    lead.verificationStatus === 'INVALID' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' :
                    'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
                  }`}>
                    {lead.verificationStatus}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    {/* Animated Circular Progress for Lead Score */}
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <svg className="w-8 h-8 transform -rotate-90">
                        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-[#1E293B]" />
                        <circle 
                          cx="16" cy="16" r="14" 
                          stroke="currentColor" 
                          strokeWidth="3" 
                          fill="transparent" 
                          strokeDasharray={2 * Math.PI * 14}
                          strokeDashoffset={mounted ? (2 * Math.PI * 14) * (1 - lead.leadScore / 100) : 2 * Math.PI * 14}
                          className={`transition-all duration-1000 ease-out ${
                            lead.leadScore >= 75 ? 'text-[#22C55E]' : 
                            lead.leadScore >= 40 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                          }`}
                        />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-[#F8FAFC]">{lead.leadScore}</span>
                    </div>
                  </div>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                  <button className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors p-1.5 rounded-lg hover:bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
