import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Bell, PlusCircle, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-blue-500/30 transition-colors duration-300">
      <Head>
        <title>Notice Board</title>
        <meta name="description" content="A modern, production-ready Notice Board" />
      </Head>

      {/* Premium Navbar with Glassmorphism */}
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo area */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-2.5 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-purple-500/20">
                <Bell size={22} className="group-hover:animate-swing" />
              </div>
              <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight transition-colors duration-300">
                NoticeBoard
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              )}

              <Link
                href="/notice/form"
                className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <PlusCircle size={18} />
                <span className="hidden sm:inline">New Notice</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
        
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-10 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 text-center text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">
        <p>© {new Date().getFullYear()} NoticeBoard. Built with Next.js, Prisma & Tailwind v4.</p>
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
