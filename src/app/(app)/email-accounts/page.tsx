'use client';
import React, { useState, useEffect } from 'react';
import { PageSearchBar } from '@/components/shared/PageSearchBar';

// Use Next.js /api proxy (proxied to backend in next.config.ts)
const API_URL = '/api';

type Account = {
  id: string;
  fromName: string;
  fromEmail: string;
  smtpHost: string;
  smtpPort: number;
  isActive: boolean;
};

const emptyForm = {
  fromName: '',
  fromEmail: '',
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUser: '',
  smtpPassword: '',
  replyTo: '',
};

export default function EmailAccountsPage() {
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Send Email from this account
  const [sendModal, setSendModal] = useState<{ account: Account } | null>(null);
  const [sendForm, setSendForm] = useState({ to: '', subject: '', body: '' });
  const [isSending, setIsSending] = useState(false);

  const handleSendFromAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendModal) return;
    setIsSending(true);
    try {
      const res = await fetch(`${API_URL}/emails/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailAccountId: sendModal.account.id,
          to: sendForm.to,
          subject: sendForm.subject,
          html: `<p>${sendForm.body.replace(/\n/g, '<br/>')}</p>`,
        }),
      });
      const data = await res.json();
      if (data.status === 'SUCCESS') {
        setSendModal(null);
        setSendForm({ to: '', subject: '', body: '' });
        showToast(`✅ Email sent to ${sendForm.to}!`, 'success');
      } else {
        showToast(data.message || 'Failed to send email', 'error');
      }
    } catch {
      showToast('Network error. Is the backend running?', 'error');
    } finally {
      setIsSending(false);
    }
  };

  // Global Quick Send Email
  const [quickSendModal, setQuickSendModal] = useState(false);
  const [quickSendForm, setQuickSendForm] = useState({ to: '', subject: '', body: '' });
  const [isQuickSending, setIsQuickSending] = useState(false);

  const handleQuickSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsQuickSending(true);
    try {
      const res = await fetch(`${API_URL}/emails/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: quickSendForm.to,
          subject: quickSendForm.subject,
          html: `<p>${quickSendForm.body.replace(/\n/g, '<br/>')}</p>`,
        }),
      });
      const data = await res.json();
      if (data.status === 'SUCCESS') {
        setQuickSendModal(false);
        setQuickSendForm({ to: '', subject: '', body: '' });
        showToast(`✅ Email sent to ${quickSendForm.to}!`, 'success');
      } else {
        showToast(data.message || 'Failed to send email', 'error');
      }
    } catch {
      showToast('Network error. Is the backend running?', 'error');
    } finally {
      setIsQuickSending(false);
    }
  };

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/email-accounts`);
      const data = await res.json();
      if (data.status === 'SUCCESS') setAccounts(data.data);
    } catch {
      showToast('Could not load accounts. Is the backend running?', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const filteredAccounts = accounts.filter(a =>
    a.fromEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.fromName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAccountForm, setNewAccountForm] = useState(emptyForm);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/email-accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAccountForm, smtpSecure: false }),
      });
      const data = await res.json();
      if (data.status === 'SUCCESS') {
        setAccounts(prev => [data.data, ...prev]);
        setIsAddModalOpen(false);
        setNewAccountForm(emptyForm);
        showToast(`Account ${data.data.fromEmail} added successfully.`, 'success');
      } else {
        showToast(data.message || 'Failed to add account', 'error');
      }
    } catch {
      showToast('Network error. Is the backend running?', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async (id: string, email: string) => {
    if (!confirm(`Remove ${email}?`)) return;
    try {
      await fetch(`${API_URL}/email-accounts/${id}`, { method: 'DELETE' });
      setAccounts(prev => prev.filter(a => a.id !== id));
      showToast(`Account ${email} removed.`, 'error');
    } catch {
      showToast('Failed to delete account', 'error');
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="font-sans relative max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="px-6 py-4 rounded-xl shadow-2xl bg-[#151E30] border border-[#1E293B] flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
            toastType === 'error'   ? 'bg-[#EF4444]/10 border-[#EF4444]/20 text-[#EF4444]' :
            toastType === 'success' ? 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]' :
            'bg-[#3B82F6]/10 border-[#3B82F6]/20 text-[#3B82F6]'
          }`}>
            {toastType === 'error' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            ) : toastType === 'success' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
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
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <PageSearchBar placeholder="Search email accounts..." onSearch={setSearchQuery} />
          <button onClick={() => setQuickSendModal(true)} className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:from-[#7C3AED] hover:to-[#4F46E5] transition-all duration-200 btn-press whitespace-nowrap">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
             Quick Send
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center justify-center rounded-xl bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-[#2563EB] transition-all duration-200 btn-press whitespace-nowrap">
             + Add Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {isLoading ? (
          <div className="col-span-3 py-16 text-center">
            <div className="w-10 h-10 border-4 border-[#1E293B] border-t-[#3B82F6] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#94A3B8] text-sm">Loading accounts...</p>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="col-span-3 py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-[#151E30] flex items-center justify-center mb-4 mx-auto border border-[#1E293B]">
              <svg className="w-6 h-6 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-[#94A3B8] text-sm">{searchQuery ? 'No accounts match your search.' : 'No accounts yet. Add your first sending account.'}</p>
          </div>
        ) : (
          filteredAccounts.map((account, i) => (
            <div key={account.id} className="bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-6 shadow-xl card-hover animate-fade-in-up flex flex-col group" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex justify-between items-start mb-4 gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/20 border border-[#3B82F6]/30 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[#F8FAFC] truncate">{account.fromName}</h3>
                    <p className="text-xs text-[#94A3B8] truncate">{account.fromEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                    account.isActive ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${account.isActive ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'} animate-badge-pulse`} />
                    {account.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleDeleteAccount(account.id, account.fromEmail)}
                    title="Remove account"
                    className="p-1.5 rounded-lg text-[#475569] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#1E293B] space-y-1">
                <p className="text-xs text-[#94A3B8]">SMTP: <span className="text-[#F8FAFC]">{account.smtpHost}:{account.smtpPort}</span></p>
              </div>
              {/* Send Email Button */}
              <div className="mt-4">
                <button
                  onClick={() => { setSendModal({ account }); setSendForm({ to: '', subject: '', body: '' }); }}
                  className="w-full py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] hover:from-[#2563EB] hover:to-[#0891B2] rounded-xl text-sm font-semibold text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] flex items-center justify-center gap-2 btn-press"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  Send Email
                </button>
              </div>
            </div>
          ))
        )}

      </div>

      {/* Add Account Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#1E293B] flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[#F8FAFC]">Add Sending Account</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">For Gmail: use an App Password (not your login password)</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1 rounded-lg hover:bg-[#1E293B]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Sender Name</label>
                    <input type="text" required value={newAccountForm.fromName} onChange={(e) => setNewAccountForm({...newAccountForm, fromName: e.target.value})} className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-3 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">From Email</label>
                    <input type="email" required value={newAccountForm.fromEmail} onChange={(e) => setNewAccountForm({...newAccountForm, fromEmail: e.target.value})} className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-3 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors" placeholder="john@company.com" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">SMTP Host</label>
                    <input type="text" required value={newAccountForm.smtpHost} onChange={(e) => setNewAccountForm({...newAccountForm, smtpHost: e.target.value})} className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-3 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors" placeholder="smtp.gmail.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Port</label>
                    <input type="number" required value={newAccountForm.smtpPort} onChange={(e) => setNewAccountForm({...newAccountForm, smtpPort: parseInt(e.target.value) || 587})} className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-3 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">SMTP Username</label>
                  <input type="text" required value={newAccountForm.smtpUser} onChange={(e) => setNewAccountForm({...newAccountForm, smtpUser: e.target.value})} className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-3 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors" placeholder="your@gmail.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">SMTP Password / App Password</label>
                  <input type="password" required value={newAccountForm.smtpPassword} onChange={(e) => setNewAccountForm({...newAccountForm, smtpPassword: e.target.value})} className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-3 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors" placeholder="xxxx xxxx xxxx xxxx" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2 disabled:opacity-60">
                  {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  {isSaving ? 'Saving...' : 'Add Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Send Email Modal */}
      {sendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#1E293B] flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[#F8FAFC]">Compose Email</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">From: <span className="text-[#3B82F6]">{sendModal.account.fromName} &lt;{sendModal.account.fromEmail}&gt;</span></p>
              </div>
              <button onClick={() => setSendModal(null)} className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1 rounded-lg hover:bg-[#1E293B]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSendFromAccount} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">To (Recipient Email)</label>
                <input type="email" required value={sendForm.to} onChange={e => setSendForm({...sendForm, to: e.target.value})} className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-3 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30" placeholder="recipient@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Subject</label>
                <input type="text" required value={sendForm.subject} onChange={e => setSendForm({...sendForm, subject: e.target.value})} className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-3 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30" placeholder="Hello from OutreachPro" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Message</label>
                <textarea required rows={6} value={sendForm.body} onChange={e => setSendForm({...sendForm, body: e.target.value})} className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-3 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 resize-none" placeholder="Write your message here..." />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={() => setSendModal(null)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors">Cancel</button>
                <button type="submit" disabled={isSending} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] hover:from-[#2563EB] hover:to-[#0891B2] shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2 disabled:opacity-60">
                  {isSending ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                  {isSending ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Quick Send Modal */}
      {quickSendModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]"></div>
            <div className="p-6 border-b border-[#1E293B] flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[#F8FAFC]">Quick Send</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">Send a one-off email instantly to any address</p>
              </div>
              <button onClick={() => setQuickSendModal(false)} className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1 rounded-lg hover:bg-[#1E293B]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleQuickSend} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">To (Recipient Email)</label>
                <input type="email" required value={quickSendForm.to} onChange={e => setQuickSendForm({...quickSendForm, to: e.target.value})} className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-3 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30 transition-colors" placeholder="anyone@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Subject</label>
                <input type="text" required value={quickSendForm.subject} onChange={e => setQuickSendForm({...quickSendForm, subject: e.target.value})} className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-3 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30 transition-colors" placeholder="Quick Message" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">Message</label>
                <textarea required rows={6} value={quickSendForm.body} onChange={e => setQuickSendForm({...quickSendForm, body: e.target.value})} className="w-full bg-[#151E30] border border-[#1E293B] rounded-lg px-3 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30 resize-none transition-colors" placeholder="Write your message here..." />
              </div>
              <div className="flex justify-end gap-3 pt-2 mt-2">
                <button type="button" onClick={() => setQuickSendModal(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors">Cancel</button>
                <button type="submit" disabled={isQuickSending} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center gap-2 disabled:opacity-60">
                  {isQuickSending ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                  {isQuickSending ? 'Sending...' : 'Send Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
