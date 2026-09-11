'use client';
import React, { useState, useEffect } from 'react';
import { LeadTable, Lead } from '@/components/leads/LeadTable';
import { PageSearchBar } from '@/components/shared/PageSearchBar';

const API_URL = '/api';

const initialLeads: Lead[] = [
  { id: '1', email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe', companyName: 'Acme Corp', verificationStatus: 'VALID', leadScore: 85 },
  { id: '2', email: 'jane.smith@example.com', firstName: 'Jane', lastName: 'Smith', companyName: 'TechFlow', verificationStatus: 'UNVERIFIED', leadScore: 40 },
  { id: '3', email: 'alex@startup.io', firstName: 'Alex', lastName: 'Founder', companyName: 'Startup IO', verificationStatus: 'INVALID', leadScore: 12 },
  { id: '4', email: 'sarah@techflow.io', firstName: 'Sarah', lastName: 'Chen', companyName: 'TechFlow', verificationStatus: 'VALID', leadScore: 92 },
  { id: '5', email: 'mike@bigcorp.com', firstName: 'Mike', lastName: 'Johnson', companyName: 'BigCorp Inc', verificationStatus: 'VALID', leadScore: 78 },
];

const emptyLeadForm = {
  email: '',
  firstName: '',
  lastName: '',
  companyName: '',
  jobTitle: '',
  verificationStatus: 'UNVERIFIED',
  leadScore: 50,
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState(emptyLeadForm);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');
  const [discoveryState, setDiscoveryState] = useState<'IDLE' | 'SEARCHING' | 'DISCOVERING' | 'VERIFYING' | 'SCORING' | 'DONE'>('IDLE');
  const [showFilters, setShowFilters] = useState(false);

  // Send Email state
  const [sendEmailLead, setSendEmailLead] = useState<Lead | null>(null);
  const [emailAccounts, setEmailAccounts] = useState<{id: string; fromName: string; fromEmail: string}[]>([]);
  const [sendForm, setSendForm] = useState({ emailAccountId: '', subject: '', body: '' });
  const [isSending, setIsSending] = useState(false);

  // Load email accounts whenever send email modal opens
  useEffect(() => {
    if (sendEmailLead) {
      fetch(`${API_URL}/email-accounts`)
        .then(r => r.json())
        .then(d => {
          if (d.status === 'SUCCESS') {
            setEmailAccounts(d.data);
            if (d.data.length > 0) setSendForm(f => ({ ...f, emailAccountId: d.data[0].id }));
          }
        })
        .catch(() => showToast('Could not load email accounts', 'error'));
    }
  }, [sendEmailLead]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendEmailLead || !sendForm.emailAccountId) return;
    setIsSending(true);
    try {
      const res = await fetch(`${API_URL}/emails/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailAccountId: sendForm.emailAccountId,
          to: sendEmailLead.email,
          subject: sendForm.subject,
          html: `<p>${sendForm.body.replace(/\n/g, '<br/>')}</p>`,
        }),
      });
      const data = await res.json();
      if (data.status === 'SUCCESS') {
        setSendEmailLead(null);
        setSendForm({ emailAccountId: '', subject: '', body: '' });
        showToast(`Email sent to ${sendEmailLead.email}!`, 'success');
      } else {
        showToast(data.message || 'Failed to send email', 'error');
      }
    } catch {
      showToast('Network error. Is the backend running?', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const filteredLeads = leads.filter(l =>
    (l.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (l.firstName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (l.lastName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (l.companyName?.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleDiscoverLeads = () => {
    setIsModalOpen(true);
    setDiscoveryState('SEARCHING');
    setTimeout(() => setDiscoveryState('DISCOVERING'), 1500);
    setTimeout(() => setDiscoveryState('VERIFYING'), 3000);
    setTimeout(() => setDiscoveryState('SCORING'), 4500);
    setTimeout(() => setDiscoveryState('DONE'), 6000);
  };

  const finishDiscovery = () => {
    setIsModalOpen(false);
    setDiscoveryState('IDLE');
    showToast('247 New leads added to your workspace.', 'success');
  };

  const handleExportCSV = () => {
    showToast('Preparing CSV for export...', 'info');
    setTimeout(() => {
      const csvRows = [
        ['ID', 'Email', 'First Name', 'Last Name', 'Company', 'Status', 'Score'],
        ...leads.map(l => [l.id, l.email, l.firstName || '', l.lastName || '', l.companyName || '', l.verificationStatus, l.leadScore.toString()])
      ];
      const csvString = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'leads_export.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Export successful!', 'success');
    }, 1500);
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.email) return;
    const newLead: Lead = {
      id: Date.now().toString(),
      email: leadForm.email,
      firstName: leadForm.firstName,
      lastName: leadForm.lastName,
      companyName: leadForm.companyName,
      jobTitle: leadForm.jobTitle,
      verificationStatus: leadForm.verificationStatus,
      leadScore: leadForm.leadScore,
    };
    setLeads(prev => [newLead, ...prev]);
    setIsAddLeadModalOpen(false);
    setLeadForm(emptyLeadForm);
    showToast(`Lead "${newLead.firstName || newLead.email}" added successfully!`, 'success');
  };

  const handleDeleteLead = (id: string) => {
    const lead = leads.find(l => l.id === id);
    setLeads(prev => prev.filter(l => l.id !== id));
    showToast(`Lead "${lead?.firstName || lead?.email}" deleted.`, 'error');
  };

  return (
    <div className="font-sans relative">
      
      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="px-6 py-4 rounded-xl shadow-2xl bg-[#151E30] border border-[#1E293B] flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
            toastType === 'success' ? 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]' : 
            toastType === 'error'   ? 'bg-[#EF4444]/10 border-[#EF4444]/20 text-[#EF4444]' :
            'bg-[#3B82F6]/10 border-[#3B82F6]/20 text-[#3B82F6]'
          }`}>
             {toastType === 'success' ? (
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
             ) : toastType === 'error' ? (
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             ) : (
               <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             )}
          </div>
          <span className="font-medium text-sm text-[#F8FAFC]">{toastMessage}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="sm:flex sm:items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC]">Leads Database</h1>
            <p className="mt-2 text-[#94A3B8]">Manage, filter, and verify your prospects before launching outreach campaigns.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button onClick={handleExportCSV} className="px-4 py-2 bg-[#111827] border border-[#1E293B] hover:border-[#3B82F6]/50 text-[#F8FAFC] text-sm font-medium rounded-xl transition-all shadow-lg btn-press">
              Export CSV
            </button>
            <button
              onClick={() => setIsAddLeadModalOpen(true)}
              className="px-4 py-2 bg-[#22C55E] hover:bg-[#16A34A] shadow-[0_0_20px_rgba(34,197,94,0.3)] text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2 btn-press"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Lead
            </button>
            <button onClick={handleDiscoverLeads} className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2 btn-press">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Discover Leads
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border-x border-t border-[#1E293B] rounded-t-2xl p-4 animate-fade-in-up delay-1 relative">
           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="w-full sm:w-96">
               <PageSearchBar placeholder="Search leads by name, email, or company..." onSearch={setSearchQuery} />
             </div>
             <div className="flex items-center gap-3 w-full sm:w-auto">
               <select onChange={() => showToast('Filters applied.', 'info')} className="px-3 py-2 bg-[#0D1424] text-[#F8FAFC] border border-[#1E293B] rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#3B82F6]">
                 <option>All Statuses</option>
                 <option>Verified</option>
                 <option>Invalid</option>
               </select>
               <button onClick={() => setShowFilters(!showFilters)} className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${showFilters ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20' : 'bg-[#151E30] text-[#94A3B8] hover:text-[#F8FAFC] border-[#1E293B]'}`}>
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                 More Filters
               </button>
             </div>
           </div>
           
           {/* Advanced Filters Panel */}
           {showFilters && (
             <div className="mt-4 pt-4 border-t border-[#1E293B] grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in-up">
               <div>
                 <label className="block text-xs font-medium text-[#94A3B8] mb-1">Company Size</label>
                 <select className="w-full bg-[#0D1424] border border-[#1E293B] text-[#F8FAFC] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] text-sm">
                   <option>Any Size</option>
                   <option>1-10 employees</option>
                   <option>11-50 employees</option>
                   <option>51-200 employees</option>
                   <option>201-500 employees</option>
                   <option>501+ employees</option>
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-medium text-[#94A3B8] mb-1">Industry</label>
                 <select className="w-full bg-[#0D1424] border border-[#1E293B] text-[#F8FAFC] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] text-sm">
                   <option>Any Industry</option>
                   <option>Software</option>
                   <option>Healthcare</option>
                   <option>Finance</option>
                   <option>E-commerce</option>
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-medium text-[#94A3B8] mb-1">Min Lead Score</label>
                 <input type="number" placeholder="0" className="w-full bg-[#0D1424] border border-[#1E293B] text-[#F8FAFC] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] text-sm" />
               </div>
               <div className="flex items-end">
                 <button onClick={() => { setShowFilters(false); showToast('Filters applied.', 'success'); }} className="w-full px-3 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium rounded-lg transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)] btn-press">
                   Apply Filters
                 </button>
               </div>
             </div>
           )}
        </div>

         <div className="relative z-10 rounded-b-2xl overflow-x-auto overflow-y-hidden border border-[#1E293B] shadow-2xl animate-fade-in-up delay-2">
           <div className="min-w-[800px]">
             <LeadTable leads={filteredLeads} onDelete={handleDeleteLead} onSendEmail={(lead) => setSendEmailLead(lead)} />
           </div>
         </div>
      </div>

      {/* Send Email Modal */}
      {sendEmailLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#1E293B] flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[#F8FAFC]">Send Email</h2>
                <p className="text-sm text-[#94A3B8] mt-0.5">To: <span className="text-[#3B82F6]">{sendEmailLead.email}</span></p>
              </div>
              <button onClick={() => setSendEmailLead(null)} className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1 rounded-lg hover:bg-[#1E293B]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">From Account</label>
                {emailAccounts.length === 0 ? (
                  <p className="text-sm text-[#EF4444]">No email accounts found. <a href="/email-accounts" className="underline text-[#3B82F6]">Add one first.</a></p>
                ) : (
                  <select value={sendForm.emailAccountId} onChange={e => setSendForm({...sendForm, emailAccountId: e.target.value})} className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-3 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30">
                    {emailAccounts.map(a => <option key={a.id} value={a.id}>{a.fromName} &lt;{a.fromEmail}&gt;</option>)}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Subject</label>
                <input type="text" required value={sendForm.subject} onChange={e => setSendForm({...sendForm, subject: e.target.value})} className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-3 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30" placeholder="Quick question" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Message</label>
                <textarea required rows={6} value={sendForm.body} onChange={e => setSendForm({...sendForm, body: e.target.value})} className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-3 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 resize-none" placeholder={`Hi ${sendEmailLead.firstName || 'there'},\n\n`} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setSendEmailLead(null)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors">Cancel</button>
                <button type="submit" disabled={isSending || emailAccounts.length === 0} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2 disabled:opacity-60">
                  {isSending ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                  {isSending ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#1E293B] flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[#F8FAFC]">Add New Lead</h2>
                <p className="text-sm text-[#94A3B8] mt-0.5">Manually add a prospect to your database.</p>
              </div>
              <button onClick={() => { setIsAddLeadModalOpen(false); setLeadForm(emptyLeadForm); }} className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1.5 rounded-lg hover:bg-[#1E293B]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddLead} className="p-6">
              <div className="space-y-4">
                {/* Email — required */}
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1">Email Address <span className="text-[#EF4444]">*</span></label>
                  <input
                    type="email"
                    required
                    value={leadForm.email}
                    onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                    placeholder="prospect@company.com"
                    className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-4 py-2.5 text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors text-sm"
                  />
                </div>

                {/* First / Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-1">First Name</label>
                    <input
                      type="text"
                      value={leadForm.firstName}
                      onChange={e => setLeadForm({ ...leadForm, firstName: e.target.value })}
                      placeholder="John"
                      className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-4 py-2.5 text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-1">Last Name</label>
                    <input
                      type="text"
                      value={leadForm.lastName}
                      onChange={e => setLeadForm({ ...leadForm, lastName: e.target.value })}
                      placeholder="Doe"
                      className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-4 py-2.5 text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Company / Job Title */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-1">Company</label>
                    <input
                      type="text"
                      value={leadForm.companyName}
                      onChange={e => setLeadForm({ ...leadForm, companyName: e.target.value })}
                      placeholder="Acme Corp"
                      className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-4 py-2.5 text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-1">Job Title</label>
                    <input
                      type="text"
                      value={leadForm.jobTitle}
                      onChange={e => setLeadForm({ ...leadForm, jobTitle: e.target.value })}
                      placeholder="CEO"
                      className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-4 py-2.5 text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Status / Score */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-1">Verification Status</label>
                    <select
                      value={leadForm.verificationStatus}
                      onChange={e => setLeadForm({ ...leadForm, verificationStatus: e.target.value })}
                      className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-4 py-2.5 text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors text-sm appearance-none"
                    >
                      <option value="UNVERIFIED">Unverified</option>
                      <option value="VALID">Valid</option>
                      <option value="INVALID">Invalid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-1">Lead Score (0–100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={leadForm.leadScore}
                      onChange={e => setLeadForm({ ...leadForm, leadScore: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                      className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-4 py-2.5 text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsAddLeadModalOpen(false); setLeadForm(emptyLeadForm); }}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#22C55E] hover:bg-[#16A34A] shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discover Leads Animated Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080D1A]/80 backdrop-blur-md animate-scale-in">
          <div className="bg-[#111827] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[#1E293B] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 to-[#8B5CF6]/10 opacity-50" />
            <div className="relative z-10 p-8 text-center">
              {discoveryState !== 'DONE' ? (
                <>
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-[#1E293B] rounded-full" />
                    <div className="absolute inset-0 border-4 border-[#3B82F6] rounded-full border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#3B82F6] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">
                    {discoveryState === 'SEARCHING' && 'Searching Database...'}
                    {discoveryState === 'DISCOVERING' && 'Discovering Companies...'}
                    {discoveryState === 'VERIFYING' && 'Verifying Email Addresses...'}
                    {discoveryState === 'SCORING' && 'Scoring Leads with AI...'}
                  </h3>
                  <p className="text-[#94A3B8] text-sm">Our AI is finding the best prospects for your criteria.</p>
                  <div className="mt-8 space-y-3 text-left">
                    {['SEARCHING', 'DISCOVERING', 'VERIFYING', 'SCORING'].map((step, i) => {
                      const states = ['SEARCHING', 'DISCOVERING', 'VERIFYING', 'SCORING'];
                      const currentIndex = states.indexOf(discoveryState);
                      const isComplete = i < currentIndex;
                      const isActive = i === currentIndex;
                      
                      return (
                        <div key={step} className={`flex items-center gap-3 transition-opacity duration-300 ${isActive || isComplete ? 'opacity-100' : 'opacity-30'}`}>
                          {isComplete ? (
                            <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          ) : isActive ? (
                            <span className="w-5 h-5 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-[#1E293B]" />
                          )}
                          <span className={`text-sm font-medium ${isComplete ? 'text-[#F8FAFC]' : isActive ? 'text-[#3B82F6]' : 'text-[#94A3B8]'}`}>
                            {step === 'SEARCHING' && 'Querying criteria'}
                            {step === 'DISCOVERING' && 'Extracting company data'}
                            {step === 'VERIFYING' && 'SMTP verification'}
                            {step === 'SCORING' && 'Intent scoring'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="animate-fade-in-up">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#22C55E]/10 flex items-center justify-center border-2 border-[#22C55E]/20 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <svg className="w-10 h-10 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#F8FAFC] mb-4">Discovery Complete</h3>
                  <div className="space-y-2 mb-8 bg-[#151E30] p-4 rounded-xl border border-[#1E293B]">
                    <p className="text-sm font-medium text-[#F8FAFC] flex justify-between"><span>Total Found:</span> <span className="text-[#3B82F6]">247</span></p>
                    <p className="text-sm font-medium text-[#F8FAFC] flex justify-between"><span>Verified:</span> <span className="text-[#22C55E]">219</span></p>
                    <p className="text-sm font-medium text-[#F8FAFC] flex justify-between"><span>High Quality:</span> <span className="text-[#8B5CF6]">183</span></p>
                  </div>
                  <button onClick={finishDiscovery} className="w-full px-5 py-3 text-sm font-bold text-white bg-[#3B82F6] rounded-xl hover:bg-[#2563EB] transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)] btn-press">
                    View Leads
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
