import React, { useState } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export const NewsletterForm: React.FC = () => {
  const { language, subscribeNewsletter } = useApp();
  const isRtl = language === 'ar';

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatus('error');
      setErrorMsg(isRtl ? 'يرجى إدخال بريد إلكتروني صالح.' : 'Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      await subscribeNewsletter(email.trim(), name.trim());
      setStatus('success');
      setEmail('');
      setName('');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err?.message || (isRtl ? 'حدث خطأ. حاول مرة أخرى.' : 'Something went wrong. Please try again.'));
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-none">
        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
        <p className="text-xs text-emerald-500 font-medium">
          {isRtl ? 'تم الاشتراك بنجاح! شكراً لانضمامك إلينا.' : 'Subscribed successfully! Thank you for joining us.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={isRtl ? 'بريدك الإلكتروني' : 'Your email address'}
          required
          className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none px-4 py-3 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-accent"
        />
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={isRtl ? 'الاسم (اختياري)' : 'Name (optional)'}
          className="sm:w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none px-4 py-3 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 bg-accent text-black font-semibold text-xs uppercase tracking-widest rounded-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Mail className="w-4 h-4" />
          {status === 'loading'
            ? (isRtl ? 'جارٍ...' : '...')
            : (isRtl ? 'اشترك' : 'Subscribe')}
        </button>
      </div>
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </form>
  );
};
