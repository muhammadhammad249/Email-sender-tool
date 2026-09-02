import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-16 pt-8 pb-4 border-t border-[#1E293B] text-sm flex flex-col md:flex-row justify-between items-center gap-4 text-[#94A3B8]">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[#F8FAFC]">OutreachPro</span>
        <span>&copy; {new Date().getFullYear()}</span>
      </div>
      
      <div className="flex items-center gap-6">
        <Link href="#" className="hover:text-[#F8FAFC] transition-colors">Documentation</Link>
        <Link href="#" className="hover:text-[#F8FAFC] transition-colors">API</Link>
        <Link href="#" className="hover:text-[#F8FAFC] transition-colors">Privacy</Link>
        <Link href="#" className="hover:text-[#F8FAFC] transition-colors">Terms</Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-[#111827] border border-[#1E293B] rounded-full text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-badge-pulse" />
          <span className="font-medium">All systems operational</span>
        </div>
      </div>
    </footer>
  );
}
