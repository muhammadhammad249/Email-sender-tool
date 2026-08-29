'use client';
import React, { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

type Account = {
  email: string;
  provider: string;
  status: string;
  sentToday: number;
  limit: number;
};

export default function EmailAccountsPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAccountForm, setNewAccountForm] = useState({
    email: '',
    provider: 'Google Workspace',
    limit: 250
  });

  const handleAddAccountClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountForm.email) return;

    const newAccount: Account = {
      email: newAccountForm.email,
      provider: newAccountForm.provider,
      status: 'Healthy',
      sentToday: 0,
      limit: newAccountForm.limit
    };

    setAccounts([...accounts, newAccount]);
    setIsAddModalOpen(false);
    setNewAccountForm({ email: '', provider: 'Google Workspace', limit: 250 });
    showToast(`Account ${newAccount.email} added successfully.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="font-sans relative max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="px-6 py-4 rounded-xl shadow-2xl bg-[#151E30] border border-[#1E293B] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center border bg-[#3B82F6]/10 border-[#3B82F6]/20 text-[#3B82F6]">
             <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className="font-medium text-sm text-[#F8FAFC]">{toastMessage}</span>
        </div>
      </div>

      {/* Header */}
      <div className="sm:flex sm:items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC]">Email Accounts</h1>
          <p className="mt-2 text-[#94A3B8]">Manage your sending accounts and monitor daily limits.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button onClick={handleAddAccountClick} className="inline-flex items-center justify-center rounded-xl bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-[#2563EB] transition-all duration-200 btn-press">
             + Add Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Account Cards */}
        {accounts.map((account, i) => (
          <div key={i} className="bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-6 shadow-xl card-hover animate-fade-in-up flex flex-col" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex justify-between items-start mb-4 gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[#151E30] border border-[#1E293B] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#F8FAFC]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-[#F8FAFC] truncate" title={account.email}>{account.email}</h3>
                  <p className="text-xs text-[#94A3B8] truncate">{account.provider}</p>
                </div>
              </div>
              <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                account.status === 'Healthy' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
              }`}>
                 <span className={`w-1.5 h-1.5 rounded-full ${account.status === 'Healthy' ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'} animate-badge-pulse`} />
                 {account.status}
              </span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#1E293B]">
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-[#94A3B8]">Daily Limit</span>
                <span className="text-[#F8FAFC]">{account.sentToday} / {account.limit}</span>
              </div>
              {/* Animated Progress Bar */}
              <div className="h-2 w-full bg-[#151E30] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    (account.sentToday / account.limit) > 0.9 ? 'bg-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                    (account.sentToday / account.limit) > 0.7 ? 'bg-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                    'bg-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                  }`}
                  style={{ width: `${(account.sentToday / account.limit) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="mt-6">
               <button 
                 onClick={async () => {
                   showToast(`Starting warmup for ${account.email}...`);
                   try {
                     const res = await fetch(`${API_URL}/email-accounts/warmup`, {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify({ email: account.email })
                     });
                     const data = await res.json();
                     if (data.status === 'SUCCESS') {
                       showToast(data.message);
                     } else {
                       showToast('Failed to start warmup.');
                     }
                   } catch (err) {
                     showToast('Network error. Is backend running?');
                   }
                 }} 
                 className="w-full py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_0_15px_rgba(59,130,246,0.2)] rounded-lg text-sm font-semibold text-white transition-all btn-press flex items-center justify-center gap-2"
               >
                 Start Warmup <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
               </button>
            </div>
          </div>
        ))}

      </div>

      {/* Add Account Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#1E293B] flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#F8FAFC]">Add New Account</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={newAccountForm.email}
                    onChange={(e) => setNewAccountForm({...newAccountForm, email: e.target.value})}
                    className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-4 py-2.5 text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6] transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1">Provider</label>
                  <select 
                    value={newAccountForm.provider}
                    onChange={(e) => setNewAccountForm({...newAccountForm, provider: e.target.value})}
                    className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-4 py-2.5 text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none"
                  >
                    <option value="Google Workspace">Google Workspace</option>
                    <option value="Microsoft 365">Microsoft 365</option>
                    <option value="SMTP">Custom SMTP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1">Daily Limit</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={newAccountForm.limit}
                    onChange={(e) => setNewAccountForm({...newAccountForm, limit: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-4 py-2.5 text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all">
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
