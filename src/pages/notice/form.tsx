import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { Loader2, ArrowLeft, Save, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import { Category, Priority } from '@prisma/client';

export default function NoticeForm() {
  const router = useRouter();
  const { id } = router.query;
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: Category.General,
    priority: Priority.Normal,
    publishDate: format(new Date(), 'yyyy-MM-dd'),
    image: '',
  });

  useEffect(() => {
    if (isEditing && id) {
      fetchNotice(id as string);
    }
  }, [id, isEditing]);

  const fetchNotice = async (noticeId: string) => {
    try {
      const res = await fetch(`/api/notices/${noticeId}`);
      if (!res.ok) {
        throw new Error('Notice not found');
      }
      const data = await res.json();
      setFormData({
        title: data.title,
        body: data.body,
        category: data.category,
        priority: data.priority,
        publishDate: format(new Date(data.publishDate), 'yyyy-MM-dd'),
        image: data.image || '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load notice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const url = isEditing ? `/api/notices/${id}` : '/api/notices';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save notice');
      }

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 dark:text-slate-500 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
        <p className="font-medium animate-pulse text-lg">Loading notice details...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{isEditing ? 'Edit Notice' : 'New Notice'} | Notice Board</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link 
            href="/"
            className="p-3 -ml-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isEditing ? 'Edit Notice' : 'Create a Notice'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              {isEditing ? 'Update the details below.' : 'Publish a new announcement to the board.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8 relative overflow-hidden">
          
          {/* Subtle background flair */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {error && (
            <div className="p-5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-2xl text-sm font-semibold flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" /> {error}
            </div>
          )}

          <div className="space-y-3 relative z-10">
            <label htmlFor="title" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Title <span className="text-indigo-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-inner"
              placeholder="e.g. End of Semester Examinations"
            />
          </div>

          <div className="space-y-3 relative z-10">
            <label htmlFor="body" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Content <span className="text-indigo-500">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              required
              rows={6}
              value={formData.body}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y shadow-inner"
              placeholder="Write the full notice details here..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-3">
              <label htmlFor="category" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none shadow-inner"
                >
                  {Object.values(Category).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <LayoutTemplate size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <label htmlFor="priority" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Priority
              </label>
              <div className="relative">
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none shadow-inner"
                >
                  {Object.values(Priority).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-3">
              <label htmlFor="publishDate" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Publish Date <span className="text-indigo-500">*</span>
              </label>
              <input
                type="date"
                id="publishDate"
                name="publishDate"
                required
                value={formData.publishDate}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-inner"
              />
            </div>
            
            <div className="space-y-3">
              <label htmlFor="image" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Image URL <span className="font-normal text-slate-400">(Optional)</span>
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-inner"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="pt-10 mt-10 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-4 relative z-10">
            <Link
              href="/"
              className="px-6 py-3 font-semibold text-slate-700 dark:text-slate-300 bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 min-w-[140px]"
            >
              {isSaving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Save size={20} />
                  {isEditing ? 'Save Changes' : 'Publish Notice'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
