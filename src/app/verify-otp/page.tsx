'use client';
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const RESEND_COOLDOWN = 59;

function VerifyOTPContent() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { verify } = useAuth();
  const router = useRouter();

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (!email) router.push('/register');
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError('');
    setIsLoading(true);
    try {
      await verify(email, otp);
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
      setIsLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (!email || !canResend || isResending) return;
    setIsResending(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/auth/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess('New code sent! Check your email.');
      setOtp('');
      setCountdown(RESEND_COOLDOWN);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || 'Failed to resend. Try again.');
    } finally {
      setIsResending(false);
    }
  }, [email, canResend, isResending]);

  if (!email) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timeDisplay = countdown > 0
    ? `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : null;

  return (
    <div className="w-full max-w-md relative z-10">
      {/* Logo & Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] shadow-[0_0_30px_rgba(59,130,246,0.4)] mb-4">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
          Verify Email
        </h1>
        <p className="mt-2 text-[#94A3B8] text-sm">
          We sent a 6-digit code to
        </p>
        <p className="text-[#F8FAFC] font-semibold text-sm mt-1">{email}</p>
      </div>

      {/* Card */}
      <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-8 shadow-2xl">

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-start gap-3">
            <svg className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[#EF4444] text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-start gap-3">
            <svg className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[#22C55E] text-sm font-medium">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3 text-center">
              Enter Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              required
              maxLength={6}
              autoFocus
              className="w-full bg-[#0D1424] border border-[#1E293B] text-[#F8FAFC] rounded-xl px-4 py-4 text-center text-3xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-[#3B82F6] placeholder-[#475569] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </>
            ) : 'Verify & Continue →'}
          </button>
        </form>

        {/* Resend Section */}
        <div className="mt-6 pt-5 border-t border-[#1E293B] text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#3B82F6] hover:text-[#60A5FA] transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isResending ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Resend Code
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm text-[#94A3B8]">
              <svg className="w-4 h-4 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Resend code in </span>
              <span className="font-mono font-bold text-[#F8FAFC] tabular-nums">{timeDisplay}</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-center mt-6 text-sm text-[#94A3B8]">
        Wrong email?{' '}
        <Link href="/register" className="text-[#3B82F6] font-semibold hover:text-[#60A5FA] transition-colors hover:underline">
          Register again
        </Link>
      </p>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen bg-[#080D1A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#3B82F6] opacity-[0.04] blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#8B5CF6] opacity-[0.04] blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <Suspense fallback={<div className="text-[#F8FAFC] text-sm">Loading...</div>}>
        <VerifyOTPContent />
      </Suspense>
    </div>
  );
}
