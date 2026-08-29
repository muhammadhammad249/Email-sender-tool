import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

const inter = Inter({ subsets: ['latin'] });

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://email-sender-tool-jet.vercel.app';

export const metadata: Metadata = {
  title: 'OutreachPro | Intelligent Sales Automation',
  description: 'AI-powered lead discovery and email outreach platform.',
  openGraph: {
    title: 'OutreachPro | Intelligent Sales Automation',
    description: 'AI-powered lead discovery and email outreach platform.',
    url: appUrl,
    siteName: 'OutreachPro',
    images: [
      {
        url: `${appUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full min-h-screen bg-[#080D1A] text-[#F8FAFC] overflow-x-hidden antialiased selection:bg-[#3B82F6]/30`}>
        
        <AuthProvider>
          {/* Animated Background Blobs */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#3B82F6] opacity-[0.03] blur-[120px] animate-blob-1" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#06B6D4] opacity-[0.02] blur-[100px] animate-blob-2 delay-2" />
            <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-[#8B5CF6] opacity-[0.02] blur-[100px] animate-blob-1 delay-4" />
          </div>

          {children}
        </AuthProvider>
        
      </body>
    </html>
  );
}
