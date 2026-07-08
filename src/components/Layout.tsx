import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Bell, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/router';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <Head>
        <title>Notice Board</title>
        <meta name="description" content="A modern, production-ready Notice Board" />
      </Head>

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition-colors shadow-sm">
                <Bell size={20} className="group-hover:animate-swing" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">
                Notice Board
              </span>
            </Link>

            <Link
              href="/notice/form"
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">New Notice</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>

      <footer className="mt-auto py-8 border-t border-slate-200 bg-white text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Notice Board App. Built with Next.js & Prisma.</p>
      </footer>
      
      <style jsx global>{`
        @keyframes swing {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-10deg); }
          60% { transform: rotate(5deg); }
          80% { transform: rotate(-5deg); }
        }
        .animate-swing {
          animation: swing 1s ease-in-out;
        }
      `}</style>
    </div>
  );
}
