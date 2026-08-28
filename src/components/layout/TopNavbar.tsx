'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function TopNavbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'U';

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
  };

  return (
    <header className="h-16 bg-[#080D1A]/80 backdrop-blur-md border-b border-[#1E293B] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors">
      
      {/* Left: Search Bar */}
      <div className="flex-1 flex">
        <div className={`relative transition-all duration-300 ease-out ${isSearchFocused ? 'w-full max-w-md' : 'w-full max-w-xs'}`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className={`h-4 w-4 transition-colors duration-200 ${isSearchFocused ? 'text-[#3B82F6]' : 'text-[#94A3B8]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search leads, campaigns..."
            className="block w-full pl-10 pr-3 py-2 border border-[#1E293B] rounded-lg leading-5 bg-[#111827] text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] sm:text-sm transition-all shadow-inner"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <div className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none transition-opacity ${isSearchFocused ? 'opacity-0' : 'opacity-100'}`}>
            <span className="text-[#94A3B8] text-xs font-mono border border-[#1E293B] bg-[#151E30] rounded px-1.5 py-0.5">⌘K</span>
          </div>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="ml-4 flex items-center md:ml-6 gap-3">
        
        {/* Help Button */}
        <button 
          onClick={() => window.open('mailto:support@outreachpro.io', '_blank')}
          className="text-[#94A3B8] hover:text-[#F8FAFC] p-1.5 rounded-lg hover:bg-[#111827] border border-transparent hover:border-[#1E293B] transition-all focus:outline-none"
          title="Help & Support"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
            className="relative text-[#94A3B8] hover:text-[#F8FAFC] p-1.5 rounded-lg hover:bg-[#111827] border border-transparent hover:border-[#1E293B] transition-all focus:outline-none group"
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-[#EF4444] ring-2 ring-[#080D1A] animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-2xl bg-[#151E30] border border-[#1E293B] animate-scale-in z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1E293B] flex justify-between items-center">
                <p className="text-sm font-bold text-[#F8FAFC]">Notifications</p>
                <span className="text-xs text-[#3B82F6] font-medium cursor-pointer hover:underline" onClick={() => setIsNotifOpen(false)}>Mark all read</span>
              </div>
              <div className="divide-y divide-[#1E293B] max-h-72 overflow-y-auto">
                {[
                  { icon: '✓', color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10', title: 'Email delivered to Sarah Chen', time: '2 min ago' },
                  { icon: '↩', color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10', title: 'John Doe replied to your campaign', time: '5 min ago' },
                  { icon: '⚡', color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', title: 'Q3 Enterprise Outreach is running', time: '10 min ago' },
                  { icon: '✓', color: 'text-[#06B6D4]', bg: 'bg-[#06B6D4]/10', title: '25 new leads verified', time: '1 hour ago' },
                ].map((notif, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-[#111827] transition-colors cursor-pointer flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full ${notif.bg} flex items-center justify-center shrink-0 text-sm ${notif.color}`}>{notif.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F8FAFC] truncate">{notif.title}</p>
                      <p className="text-xs text-[#94A3B8]">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
            className="flex items-center gap-2 focus:outline-none rounded-full ring-2 ring-transparent hover:ring-[#3B82F6] transition-all"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-xs font-bold text-white shadow-lg">
              {initials}
            </div>
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-52 rounded-xl shadow-2xl py-1 bg-[#151E30] border border-[#1E293B] ring-1 ring-black ring-opacity-5 animate-scale-in z-50">
              <div className="px-4 py-3 border-b border-[#1E293B]">
                <p className="text-sm text-[#F8FAFC] font-semibold truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-[#94A3B8] truncate">{user?.email}</p>
                {user?.organizationName && (
                  <p className="text-xs text-[#3B82F6] font-medium mt-0.5 truncate">{user.organizationName}</p>
                )}
              </div>
              <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2.5 text-sm text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC] transition-colors">
                Account Settings
              </Link>
              <div className="border-t border-[#1E293B] mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
