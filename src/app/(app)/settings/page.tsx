'use client';
import React, { useState, useRef } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveComplete, setSaveComplete] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'info' | 'danger'>('success');

  // Profile state
  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Developer');
  const [avatarInitials, setAvatarInitials] = useState('AD');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preferences state
  const [darkMode, setDarkMode] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  // Workspace state
  const [workspaceName, setWorkspaceName] = useState('OutreachPro');
  const [timezone, setTimezone] = useState('UTC-5');
  const [language, setLanguage] = useState('en');

  // Billing state
  const [currentPlan] = useState('Pro');

  // Team state
  const [teamMembers, setTeamMembers] = useState([
    { name: 'Alex Developer', email: 'alex@outreachpro.com', role: 'Owner' },
    { name: 'Sarah Chen', email: 'sarah@outreachpro.com', role: 'Admin' },
    { name: 'Mike Johnson', email: 'mike@outreachpro.com', role: 'Member' },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');

  // Notifications state
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [campaignAlerts, setCampaignAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [bounceAlerts, setBounceAlerts] = useState(true);

  const showToast = (msg: string, type: 'success' | 'info' | 'danger' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setAvatarInitials((firstName?.[0] || 'A') + (lastName?.[0] || 'D'));
    setTimeout(() => {
      setIsSaving(false);
      setSaveComplete(true);
      showToast('Settings saved successfully!', 'success');
      setTimeout(() => setSaveComplete(false), 2000);
    }, 1000);
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      showToast('Avatar uploaded successfully!', 'success');
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarInitials((firstName?.[0] || 'A') + (lastName?.[0] || 'D'));
    showToast('Avatar removed.', 'info');
  };

  const handleInviteMember = () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'danger');
      return;
    }
    setTeamMembers(prev => [...prev, { name: inviteEmail.split('@')[0], email: inviteEmail, role: 'Member' }]);
    setInviteEmail('');
    showToast(`Invitation sent to ${inviteEmail}!`, 'success');
  };

  const handleRemoveMember = (email: string) => {
    setTeamMembers(prev => prev.filter(m => m.email !== email));
    showToast(`${email} has been removed from the team.`, 'info');
  };

  const toastColors = {
    success: { bg: 'bg-[#22C55E]/10', border: 'border-[#22C55E]/20', text: 'text-[#22C55E]', icon: 'M5 13l4 4L19 7' },
    info: { bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/20', text: 'text-[#3B82F6]', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    danger: { bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/20', text: 'text-[#EF4444]', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  };

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <div onClick={onToggle} className={`relative inline-block w-12 h-6 rounded-full transition-colors border border-[#1E293B] cursor-pointer ${value ? 'bg-[#3B82F6]' : 'bg-[#111827]'}`}>
      <span className={`absolute top-1 bottom-1 w-4 h-4 rounded-full shadow transition-all ${value ? 'bg-white left-[26px]' : 'bg-[#94A3B8] left-1'}`}></span>
    </div>
  );

  return (
    <div className="font-sans max-w-5xl mx-auto pb-12 relative">
      
      {/* Hidden file input for avatar */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="px-6 py-4 rounded-xl shadow-2xl bg-[#151E30] border border-[#1E293B] flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${toastColors[toastType].bg} ${toastColors[toastType].border} ${toastColors[toastType].text}`}>
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={toastColors[toastType].icon} /></svg>
          </div>
          <span className="font-medium text-sm text-[#F8FAFC]">{toastMessage}</span>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC]">Settings</h1>
        <p className="mt-2 text-[#94A3B8]">Manage your account, billing, and workspace preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 animate-fade-in-up delay-1">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            {[
              { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              { id: 'workspace', label: 'Workspace', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
              { id: 'billing', label: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
              { id: 'team', label: 'Team', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
              { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                  activeTab === tab.id 
                    ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20' 
                    : 'text-[#94A3B8] hover:bg-[#151E30] hover:text-[#F8FAFC] border border-transparent'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl shadow-xl overflow-hidden relative">
            
            <div className="p-8 space-y-8">

              {/* ===== PROFILE TAB ===== */}
              {activeTab === 'profile' && (
                <div className="animate-fade-in-up">
                  <h2 className="text-xl font-bold text-[#F8FAFC] mb-1">Profile Details</h2>
                  <p className="text-[#94A3B8] text-sm mb-6">Update your personal information.</p>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-2xl font-bold text-white shadow-lg border-2 border-[#1E293B]">
                      {avatarInitials}
                    </div>
                    <div className="space-x-3">
                      <button onClick={handleAvatarUpload} className="px-4 py-2 bg-[#151E30] border border-[#1E293B] hover:border-[#3B82F6]/50 text-[#F8FAFC] text-sm font-medium rounded-xl transition-all shadow-md btn-press">
                        Change Avatar
                      </button>
                      <button onClick={handleRemoveAvatar} className="px-4 py-2 text-[#EF4444] text-sm font-medium hover:bg-[#EF4444]/10 rounded-xl transition-colors btn-press">
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#94A3B8] mb-2">First Name</label>
                      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-[#0D1424] border border-[#1E293B] text-[#F8FAFC] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all shadow-inner" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#94A3B8] mb-2">Last Name</label>
                      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-[#0D1424] border border-[#1E293B] text-[#F8FAFC] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all shadow-inner" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#94A3B8] mb-2">Email Address</label>
                      <input type="email" defaultValue="alex@outreachpro.com" className="w-full bg-[#0D1424] border border-[#1E293B] text-[#F8FAFC] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all shadow-inner opacity-70 cursor-not-allowed" disabled />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-[#1E293B] mt-8">
                    <h2 className="text-xl font-bold text-[#F8FAFC] mb-1">Preferences</h2>
                    <p className="text-[#94A3B8] text-sm mb-6">Manage your app experience.</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-[#1E293B] bg-[#151E30]/50 hover:bg-[#151E30] transition-colors cursor-pointer" onClick={() => { setDarkMode(!darkMode); showToast(darkMode ? 'Dark mode disabled.' : 'Dark mode enabled.', 'info'); }}>
                        <div>
                          <h4 className="font-semibold text-[#F8FAFC] text-sm">Dark Mode</h4>
                          <p className="text-xs text-[#94A3B8]">Experience the premium dark interface.</p>
                        </div>
                        <Toggle value={darkMode} onToggle={() => {}} />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl border border-[#1E293B] bg-[#151E30]/50 hover:bg-[#151E30] transition-colors cursor-pointer" onClick={() => { setReducedMotion(!reducedMotion); showToast(reducedMotion ? 'Animations enabled.' : 'Animations disabled.', 'info'); }}>
                        <div>
                          <h4 className="font-semibold text-[#F8FAFC] text-sm">Reduced Motion</h4>
                          <p className="text-xs text-[#94A3B8]">Disable background animations and transitions.</p>
                        </div>
                        <Toggle value={reducedMotion} onToggle={() => {}} />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl border border-[#1E293B] bg-[#151E30]/50 hover:bg-[#151E30] transition-colors cursor-pointer" onClick={() => { setCompactMode(!compactMode); showToast(compactMode ? 'Compact mode disabled.' : 'Compact mode enabled.', 'info'); }}>
                        <div>
                          <h4 className="font-semibold text-[#F8FAFC] text-sm">Compact Mode</h4>
                          <p className="text-xs text-[#94A3B8]">Reduce spacing for a denser layout.</p>
                        </div>
                        <Toggle value={compactMode} onToggle={() => {}} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== WORKSPACE TAB ===== */}
              {activeTab === 'workspace' && (
                <div className="animate-fade-in-up">
                  <h2 className="text-xl font-bold text-[#F8FAFC] mb-1">Workspace Settings</h2>
                  <p className="text-[#94A3B8] text-sm mb-6">Configure your workspace details.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#94A3B8] mb-2">Workspace Name</label>
                      <input type="text" value={workspaceName} onChange={e => setWorkspaceName(e.target.value)} className="w-full bg-[#0D1424] border border-[#1E293B] text-[#F8FAFC] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all shadow-inner" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#94A3B8] mb-2">Timezone</label>
                      <select value={timezone} onChange={e => { setTimezone(e.target.value); showToast(`Timezone set to ${e.target.value}`, 'info'); }} className="w-full bg-[#0D1424] border border-[#1E293B] text-[#F8FAFC] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all">
                        <option value="UTC-8">Pacific (UTC-8)</option>
                        <option value="UTC-5">Eastern (UTC-5)</option>
                        <option value="UTC+0">GMT (UTC+0)</option>
                        <option value="UTC+1">CET (UTC+1)</option>
                        <option value="UTC+5:30">IST (UTC+5:30)</option>
                        <option value="UTC+8">SGT (UTC+8)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#94A3B8] mb-2">Language</label>
                      <select value={language} onChange={e => { setLanguage(e.target.value); showToast('Language updated.', 'info'); }} className="w-full bg-[#0D1424] border border-[#1E293B] text-[#F8FAFC] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all">
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ur">اردو</option>
                      </select>
                    </div>

                    <div className="pt-6 border-t border-[#1E293B]">
                      <h3 className="text-lg font-bold text-[#F8FAFC] mb-1">Danger Zone</h3>
                      <p className="text-[#94A3B8] text-sm mb-4">Irreversible and destructive actions.</p>
                      <button onClick={() => showToast('Export started. You will receive a download link via email.', 'info')} className="px-4 py-2 bg-[#151E30] border border-[#1E293B] hover:border-[#3B82F6]/50 text-[#F8FAFC] text-sm font-medium rounded-xl transition-all mr-3 btn-press">
                        Export All Data
                      </button>
                      <button onClick={() => { if (confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) { showToast('Workspace deletion requested.', 'danger'); } }} className="px-4 py-2 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm font-medium rounded-xl hover:bg-[#EF4444]/20 transition-all btn-press">
                        Delete Workspace
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== BILLING TAB ===== */}
              {activeTab === 'billing' && (
                <div className="animate-fade-in-up">
                  <h2 className="text-xl font-bold text-[#F8FAFC] mb-1">Billing & Subscription</h2>
                  <p className="text-[#94A3B8] text-sm mb-6">Manage your plan and payment methods.</p>
                  
                  {/* Current Plan Card */}
                  <div className="p-6 rounded-xl border border-[#3B82F6]/20 bg-gradient-to-r from-[#3B82F6]/5 to-[#8B5CF6]/5 mb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold mb-1">Current Plan</p>
                        <h3 className="text-2xl font-bold text-[#F8FAFC] flex items-center gap-2">{currentPlan} <span className="text-xs bg-[#3B82F6]/10 text-[#3B82F6] px-2 py-0.5 rounded-full border border-[#3B82F6]/20">Active</span></h3>
                        <p className="text-sm text-[#94A3B8] mt-1">$49/month • Renews on Sep 1, 2026</p>
                      </div>
                      <button onClick={() => showToast('Redirecting to plan selection...', 'info')} className="px-5 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] btn-press">
                        Upgrade Plan
                      </button>
                    </div>
                  </div>

                  {/* Usage */}
                  <div className="space-y-4 mb-6">
                    <h3 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider">Usage This Period</h3>
                    {[
                      { label: 'Emails Sent', used: 8500, limit: 15000, color: 'bg-[#3B82F6]' },
                      { label: 'Leads Stored', used: 2300, limit: 5000, color: 'bg-[#8B5CF6]' },
                      { label: 'Campaigns', used: 4, limit: 10, color: 'bg-[#06B6D4]' },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-[#1E293B] bg-[#151E30]/50">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[#94A3B8] font-medium">{item.label}</span>
                          <span className="text-[#F8FAFC] font-bold">{item.used.toLocaleString()} / {item.limit.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-[#0D1424] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${item.color} transition-all duration-1000`} style={{ width: `${(item.used / item.limit) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Method */}
                  <div className="pt-6 border-t border-[#1E293B]">
                    <h3 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider mb-4">Payment Method</h3>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-[#1E293B] bg-[#151E30]/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 rounded bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">VISA</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#F8FAFC]">•••• •••• •••• 4242</p>
                          <p className="text-xs text-[#94A3B8]">Expires 12/2028</p>
                        </div>
                      </div>
                      <button onClick={() => showToast('Payment method update form opening...', 'info')} className="text-sm text-[#3B82F6] font-medium hover:text-[#2563EB] transition-colors btn-press">
                        Update
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#1E293B] mt-6 flex gap-3">
                    <button onClick={() => { showToast('Downloading invoice...', 'info'); setTimeout(() => { const a = document.createElement('a'); a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('OutreachPro Invoice\nPlan: Pro\nAmount: $49.00\nDate: Aug 2026'); a.download = 'invoice_aug_2026.txt'; document.body.appendChild(a); a.click(); document.body.removeChild(a); showToast('Invoice downloaded!', 'success'); }, 1000); }} className="px-4 py-2 bg-[#151E30] border border-[#1E293B] hover:border-[#3B82F6]/50 text-[#F8FAFC] text-sm font-medium rounded-xl transition-all btn-press">
                      Download Invoice
                    </button>
                    <button onClick={() => { if (confirm('Are you sure you want to cancel your subscription?')) { showToast('Subscription cancellation scheduled for end of billing period.', 'danger'); } }} className="px-4 py-2 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm font-medium rounded-xl hover:bg-[#EF4444]/20 transition-all btn-press">
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              )}

              {/* ===== TEAM TAB ===== */}
              {activeTab === 'team' && (
                <div className="animate-fade-in-up">
                  <h2 className="text-xl font-bold text-[#F8FAFC] mb-1">Team Management</h2>
                  <p className="text-[#94A3B8] text-sm mb-6">Invite collaborators and manage roles.</p>
                  
                  {/* Invite */}
                  <div className="flex gap-3 mb-8">
                    <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@company.com" className="flex-1 bg-[#0D1424] border border-[#1E293B] text-[#F8FAFC] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all placeholder-[#475569]" onKeyDown={e => e.key === 'Enter' && handleInviteMember()} />
                    <button onClick={handleInviteMember} className="px-5 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] btn-press shrink-0">
                      Send Invite
                    </button>
                  </div>

                  {/* Members List */}
                  <div className="space-y-3">
                    {teamMembers.map((member, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-[#1E293B] bg-[#151E30]/50 hover:bg-[#151E30] transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-sm font-bold text-white shrink-0">
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#F8FAFC]">{member.name}</p>
                            <p className="text-xs text-[#94A3B8]">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <select defaultValue={member.role} onChange={() => showToast('Role updated.', 'success')} className="bg-[#0D1424] border border-[#1E293B] text-[#F8FAFC] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#3B82F6]">
                            <option>Owner</option>
                            <option>Admin</option>
                            <option>Member</option>
                            <option>Viewer</option>
                          </select>
                          {member.role !== 'Owner' && (
                            <button onClick={() => handleRemoveMember(member.email)} className="opacity-0 group-hover:opacity-100 text-[#EF4444] hover:bg-[#EF4444]/10 p-1.5 rounded-lg transition-all btn-press">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== NOTIFICATIONS TAB ===== */}
              {activeTab === 'notifications' && (
                <div className="animate-fade-in-up">
                  <h2 className="text-xl font-bold text-[#F8FAFC] mb-1">Notification Preferences</h2>
                  <p className="text-[#94A3B8] text-sm mb-6">Choose what you want to be notified about.</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-[#1E293B] bg-[#151E30]/50 hover:bg-[#151E30] transition-colors cursor-pointer" onClick={() => { setEmailNotifs(!emailNotifs); showToast(emailNotifs ? 'Email notifications disabled.' : 'Email notifications enabled.', 'info'); }}>
                      <div>
                        <h4 className="font-semibold text-[#F8FAFC] text-sm">Email Notifications</h4>
                        <p className="text-xs text-[#94A3B8]">Receive updates about replies and opens via email.</p>
                      </div>
                      <Toggle value={emailNotifs} onToggle={() => {}} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-[#1E293B] bg-[#151E30]/50 hover:bg-[#151E30] transition-colors cursor-pointer" onClick={() => { setCampaignAlerts(!campaignAlerts); showToast(campaignAlerts ? 'Campaign alerts disabled.' : 'Campaign alerts enabled.', 'info'); }}>
                      <div>
                        <h4 className="font-semibold text-[#F8FAFC] text-sm">Campaign Alerts</h4>
                        <p className="text-xs text-[#94A3B8]">Get alerted when campaigns finish or encounter errors.</p>
                      </div>
                      <Toggle value={campaignAlerts} onToggle={() => {}} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-[#1E293B] bg-[#151E30]/50 hover:bg-[#151E30] transition-colors cursor-pointer" onClick={() => { setWeeklyReport(!weeklyReport); showToast(weeklyReport ? 'Weekly report disabled.' : 'Weekly report enabled.', 'info'); }}>
                      <div>
                        <h4 className="font-semibold text-[#F8FAFC] text-sm">Weekly Digest Report</h4>
                        <p className="text-xs text-[#94A3B8]">Receive a summary of your outreach performance every Monday.</p>
                      </div>
                      <Toggle value={weeklyReport} onToggle={() => {}} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-[#1E293B] bg-[#151E30]/50 hover:bg-[#151E30] transition-colors cursor-pointer" onClick={() => { setBounceAlerts(!bounceAlerts); showToast(bounceAlerts ? 'Bounce alerts disabled.' : 'Bounce alerts enabled.', 'info'); }}>
                      <div>
                        <h4 className="font-semibold text-[#F8FAFC] text-sm">Bounce &amp; Error Alerts</h4>
                        <p className="text-xs text-[#94A3B8]">Be notified immediately when an email hard bounces.</p>
                      </div>
                      <Toggle value={bounceAlerts} onToggle={() => {}} />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Save Button Footer */}
            <div className="bg-[#151E30]/80 px-8 py-4 border-t border-[#1E293B] flex justify-end">
               <button onClick={handleSave} className="px-6 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2 btn-press min-w-[120px] justify-center">
                  {isSaving ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> 
                  : saveComplete ? <><svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Saved</>
                  : 'Save Changes'}
               </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
