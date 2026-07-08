import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import { AlertCircle, Calendar, Edit2, Trash2, Tag, Loader2 } from 'lucide-react';
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
      case 'Exam': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Event': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <>
      <Head>
        <title>Notices | Notice Board</title>
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">All Notices</h1>
            <p className="text-slate-500 mt-1">Stay updated with the latest announcements.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="font-medium animate-pulse">Loading notices...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No notices found</h3>
            <p className="text-slate-500 mt-1 mb-6">It looks like the board is empty.</p>
            <Link 
              href="/notice/form" 
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              Create the first notice
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
              <div 
                key={notice.id} 
                className={`relative flex flex-col bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group overflow-hidden ${
                  notice.priority === 'Urgent' ? 'border-red-200 ring-1 ring-red-100 shadow-sm shadow-red-100/50' : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Urgent Banner */}
                {notice.priority === 'Urgent' && (
                  <div className="bg-red-500 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 flex items-center justify-center gap-1.5 shadow-sm">
                    <AlertCircle size={14} />
                    Urgent Notice
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col">
                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-3 text-xs font-medium">
                    <span className={`px-2.5 py-1 rounded-md border ${getCategoryColor(notice.category)}`}>
                      {notice.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Calendar size={14} />
                      {format(new Date(notice.publishDate), 'MMM d, yyyy')}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">
                    {notice.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">
                    {notice.body}
                  </p>

                  {/* Actions (visible on hover or always on mobile) */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 mt-auto">
                    <Link 
                      href={`/notice/form?id=${notice.id}`}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Notice"
                    >
                      <Edit2 size={18} />
                    </Link>
                    <button 
                      onClick={() => setDeleteId(notice.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Notice"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => !isDeleting && setDeleteId(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100 opacity-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete this notice?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to delete this notice? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors flex items-center justify-center gap-2 min-w-[100px] disabled:opacity-50"
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
