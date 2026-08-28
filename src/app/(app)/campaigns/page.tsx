'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';

const initialCampaigns = [
  { id: '1', name: 'Q3 Enterprise Outreach', status: 'RUNNING', sent: 1250, opened: 450, replied: 23, bounced: 12 },
  { id: '2', name: 'Startup Founders (YC)', status: 'DRAFT', sent: 0, opened: 0, replied: 0, bounced: 0 },
  { id: '3', name: 'SaaS CTOs Follow-up', status: 'COMPLETED', sent: 300, opened: 180, replied: 45, bounced: 3 },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim()) return;
    setIsCreating(true);
    await new Promise(r => setTimeout(r, 800));
    const newCampaign = { id: Math.random().toString(36).substr(2, 9), name: newCampaignName, status: 'DRAFT', sent: 0, opened: 0, replied: 0, bounced: 0 };
    setCampaigns([newCampaign, ...campaigns]);
    setIsCreating(false);
    setIsModalOpen(false);
    setNewCampaignName('');
  };

  return (
    <div className="font-sans relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="sm:flex sm:items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC]">Campaigns</h1>
            <p className="mt-2 text-[#94A3B8]">Manage your email outreach campaigns, track performance, and automate follow-ups.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex-shrink-0">
            <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center rounded-xl bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-[#2563EB] transition-all duration-200 btn-press">
              + Create Campaign
            </button>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign, i) => (
            <div 
              key={campaign.id} 
              className="group relative overflow-hidden rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] shadow-xl hover:border-[#3B82F6]/50 transition-all duration-300 flex flex-col card-hover animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="p-6 flex-1 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#F8FAFC] truncate pr-4" title={campaign.name}>{campaign.name}</h3>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${
                    campaign.status === 'RUNNING' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' : 
                    campaign.status === 'DRAFT' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' :
                    'bg-[#151E30] text-[#94A3B8] border-[#1E293B]'
                  }`}>
                    {campaign.status === 'RUNNING' && <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-badge-pulse mr-1.5" />}
                    {campaign.status}
                  </span>
                </div>
                
                <dl className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
                  <div>
                    <dt className="text-[#94A3B8] font-medium mb-1">Sent</dt>
                    <dd className="font-bold text-[#F8FAFC] text-xl"><AnimatedNumber value={campaign.sent} duration={1000}/></dd>
                  </div>
                  <div>
                    <dt className="text-[#94A3B8] font-medium mb-1">Opened</dt>
                    <dd className="font-bold text-[#06B6D4] text-xl"><AnimatedNumber value={campaign.opened} duration={1200}/></dd>
                  </div>
                  <div>
                    <dt className="text-[#94A3B8] font-medium mb-1">Replied</dt>
                    <dd className="font-bold text-[#8B5CF6] text-xl"><AnimatedNumber value={campaign.replied} duration={1400}/></dd>
                  </div>
                  <div>
                    <dt className="text-[#94A3B8] font-medium mb-1">Bounced</dt>
                    <dd className="font-bold text-[#EF4444] text-xl"><AnimatedNumber value={campaign.bounced} duration={1600}/></dd>
                  </div>
                </dl>
              </div>
              <div className="bg-[#151E30]/50 px-6 py-4 border-t border-[#1E293B] mt-auto group-hover:bg-[#3B82F6]/5 transition-colors">
                <Link href={`/campaigns/${campaign.id}`} className="text-sm font-semibold text-[#3B82F6] hover:text-[#60A5FA] flex items-center transition-colors">
                  View Configuration <span aria-hidden="true" className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080D1A]/80 backdrop-blur-md animate-scale-in">
          <div className="bg-[#111827] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[#1E293B] relative">
            <div className="px-6 py-4 border-b border-[#1E293B] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Create New Campaign</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors focus:outline-none">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleCreateCampaign} className="p-6 relative z-10">
              <div className="mb-6">
                <label htmlFor="campaignName" className="block text-sm font-medium text-[#94A3B8] mb-2">Campaign Name</label>
                <input 
                  type="text" 
                  id="campaignName" 
                  value={newCampaignName} 
                  onChange={(e) => setNewCampaignName(e.target.value)} 
                  placeholder="e.g. Q4 SaaS Founders" 
                  className="w-full bg-[#0D1424] border border-[#1E293B] text-[#F8FAFC] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] placeholder-[#475569] transition-all shadow-inner" 
                  autoFocus 
                  required 
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors btn-press">Cancel</button>
                <button type="submit" disabled={isCreating || !newCampaignName.trim()} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#3B82F6] rounded-xl hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all btn-press">
                  {isCreating ? <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : null}
                  Create Sequence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
