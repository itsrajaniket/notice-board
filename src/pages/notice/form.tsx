import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="font-medium animate-pulse">Loading notice details...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{isEditing ? 'Edit Notice' : 'New Notice'} | Notice Board</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {isEditing ? 'Edit Notice' : 'Create a Notice'}
            </h1>
            <p className="text-slate-500 mt-1">
              {isEditing ? 'Update the details below.' : 'Publish a new announcement to the board.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-slate-900">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. End of Semester Examinations"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="body" className="block text-sm font-semibold text-slate-900">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              required
              rows={5}
              value={formData.body}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
              placeholder="Write the full notice details here..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-semibold text-slate-900">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
              >
                {Object.values(Category).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="block text-sm font-semibold text-slate-900">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
              >
                {Object.values(Priority).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="publishDate" className="block text-sm font-semibold text-slate-900">
                Publish Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="publishDate"
                name="publishDate"
                required
                value={formData.publishDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-semibold text-slate-900">
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/"
              className="px-6 py-2.5 font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Save size={18} />
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
