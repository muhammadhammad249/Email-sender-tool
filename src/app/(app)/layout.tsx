'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      {/* Main Application Shell */}
      <div className="flex h-screen overflow-hidden relative z-10">
        
        <Sidebar />
        <MobileNav />
        
        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 h-screen ml-0 md:ml-20 lg:ml-64 transition-all duration-300">
          
          <TopNavbar />
          
          <main className="flex-1 overflow-y-auto overflow-x-hidden focus:outline-none">
            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto min-h-full flex flex-col pb-20 md:pb-6">
              <div className="flex-1 animate-fade-in-up">
                {children}
              </div>
              <Footer />
            </div>
          </main>
          
        </div>
      </div>
    </ProtectedRoute>
  );
}
