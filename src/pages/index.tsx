import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import { AlertCircle, Calendar, Edit2, Trash2, Loader2, Info } from 'lucide-react';
import { Notice } from '@prisma/client';

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/notices');
      if (res.ok) {
        const data = await res.json();
        setNotices(data);
      }
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/notices/${deleteId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setNotices((prev) => prev.filter((n) => n.id !== deleteId));
      } else {
        alert('Failed to delete notice.');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('An error occurred while deleting.');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Exam': return 'bg-purple-100/80 text-purple-700 border-purple-200/50 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20';
      case 'Event': return 'bg-emerald-100/80 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'Meeting': return 'bg-teal-100/80 text-teal-700 border-teal-200/50 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20';
      case 'Maintenance': return 'bg-amber-100/80 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case 'Holiday': return 'bg-pink-100/80 text-pink-700 border-pink-200/50 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20';
      case 'Alert': return 'bg-orange-100/80 text-orange-700 border-orange-200/50 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20';
      case 'News': return 'bg-indigo-100/80 text-indigo-700 border-indigo-200/50 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20';
      default: return 'bg-blue-100/80 text-blue-700 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
    }
  };

  const isHighPriority = (priority: string) => {
    return ['High', 'Urgent', 'Critical'].includes(priority);
  };

  return (
    <>
      <Head>
        <title>Notices | Notice Board</title>
      </Head>

      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
              All Notices
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Stay updated with the latest announcements across the board.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 dark:text-slate-500 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
            <p className="font-medium animate-pulse text-lg">Loading notices...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-24 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Info className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No notices found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8 max-w-sm mx-auto">
              It looks like the board is currently empty. Be the first to share an update.
            </p>
            <Link 
              href="/notice/form" 
              className="inline-flex items-center justify-center px-6 py-3 font-semibold rounded-full text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              Create the first notice
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
              <div 
                key={notice.id} 
                className={`relative flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 group overflow-hidden ${
                  isHighPriority(notice.priority) 
                    ? 'border-red-200/60 dark:border-red-500/30 hover:shadow-red-500/10' 
                    : 'border-slate-200/60 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Dynamic Glowing Background Effect for High Priority */}
                {isHighPriority(notice.priority) && (
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent dark:from-red-500/10 dark:to-transparent pointer-events-none" />
                )}

                {/* Priority Banner */}
                {isHighPriority(notice.priority) && (
                  <div className={`text-white text-xs font-bold uppercase tracking-[0.2em] py-2 px-4 flex items-center justify-center gap-2 shadow-sm ${
                    notice.priority === 'Critical' ? 'bg-gradient-to-r from-red-600 to-rose-600' :
                    notice.priority === 'Urgent' ? 'bg-gradient-to-r from-red-500 to-orange-500' : 
                    'bg-gradient-to-r from-orange-500 to-amber-500'
                  }`}>
                    <AlertCircle size={14} className="animate-pulse" />
                    {notice.priority} Notice
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col relative z-10">
                  {/* Meta Information */}
                  <div className="flex items-center gap-3 mb-4 text-[13px] font-semibold">
                    <span className={`px-3 py-1.5 rounded-lg border ${getCategoryColor(notice.category)}`}>
                      {notice.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Calendar size={14} />
                      {format(new Date(notice.publishDate), 'MMM d, yyyy')}
                    </span>
                  </div>

                  {/* Content Area */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {notice.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {notice.body}
                  </p>

                  {/* Hover Actions */}
                  <div className="pt-5 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between mt-auto">
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      ID: {notice.id.substring(0, 8)}...
                    </span>
                    <div className="flex gap-2">
                      <Link 
                        href={`/notice/form?id=${notice.id}`}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 rounded-xl transition-all"
                        title="Edit Notice"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => setDeleteId(notice.id)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 rounded-xl transition-all"
                        title="Delete Notice"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal (Glassmorphism design) */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isDeleting && setDeleteId(null)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm p-8 transform transition-all scale-100 opacity-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-5 border border-red-200 dark:border-red-500/20">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete this notice?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
              Are you sure you want to permanently remove this notice? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 rounded-xl hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all flex items-center justify-center gap-2 min-w-[110px] disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Deleting
                  </>
                ) : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
