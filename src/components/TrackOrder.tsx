import React, { useEffect, useState } from 'react';
import { Search, CheckCircle2, Circle, PackageSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../store/AppContext.tsx';
import { TrackedQuote, QuoteStatus } from '../types';

const CLIENT_STEPS: { label: string; labelAr: string; matches: QuoteStatus[] }[] = [
  { label: 'Request Received', labelAr: 'تم استقبال الطلب', matches: ['created'] },
  { label: 'Under Review', labelAr: 'قيد المراجعة', matches: ['reviewed', 'approved'] },
  { label: 'Manufacturing', labelAr: 'قيد التصنيع', matches: ['production'] },
  { label: 'Ready', labelAr: 'جاهز', matches: ['installation'] },
  { label: 'Delivered', labelAr: 'تم التسليم', matches: ['completed'] },
];

const STATUS_ORDER: QuoteStatus[] = ['created', 'reviewed', 'approved', 'production', 'installation', 'completed'];

function currentStepIndex(status: QuoteStatus): number {
  const statusIdx = STATUS_ORDER.indexOf(status);
  for (let i = CLIENT_STEPS.length - 1; i >= 0; i--) {
    if (CLIENT_STEPS[i].matches.some(m => STATUS_ORDER.indexOf(m) <= statusIdx)) return i;
  }
  return 0;
}

function stepDate(step: typeof CLIENT_STEPS[number], history: { status: string; date: string }[]): string | null {
  const match = history.find(h => step.matches.includes(h.status as QuoteStatus));
  return match ? match.date : null;
}

export const TrackOrder: React.FC<{ initialId?: string }> = ({ initialId }) => {
  const { language, trackQuote } = useApp();
  const isRtl = language === 'ar';
  const [inputId, setInputId] = useState(initialId || '');
  const [result, setResult] = useState<TrackedQuote | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (idOverride?: string) => {
    const id = (idOverride ?? inputId).trim();
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    const data = await trackQuote(id);
    if (data) {
      setResult(data);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialId) handleTrack(initialId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  const activeIdx = result ? currentStepIndex(result.status) : -1;

  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold block">
            {isRtl ? 'تتبع طلبك' : 'TRACK YOUR QUOTATION'}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-gray-950 dark:text-white font-medium">
            {isRtl ? 'أين وصل طلبك؟' : 'Where Is Your Order?'}
          </h2>
          <div className="cut-line w-16 mx-auto" />
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            {isRtl
              ? 'أدخل رقم التتبع الذي حصلت عليه عند إرسال طلب عرض السعر (مثال: LR-2026-00125).'
              : 'Enter the tracking number you received when you submitted your quote request (e.g. LR-2026-00125).'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputId}
            onChange={e => setInputId(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleTrack()}
            placeholder="LR-2026-00125"
            className="flex-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-none px-4 py-3.5 text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:border-accent tracking-wider"
          />
          <button
            onClick={() => handleTrack()}
            disabled={loading}
            className="px-6 py-3.5 bg-accent hover:bg-accent-dark text-black font-semibold text-xs font-mono uppercase tracking-[0.15em] rounded-none transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Search className="w-4 h-4" />
            {loading ? (isRtl ? 'جارٍ البحث...' : 'Searching...') : (isRtl ? 'تتبع' : 'Track')}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {notFound && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="precision-frame bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-8 text-center space-y-3"
            >
              <PackageSearch className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-500">
                {isRtl ? 'لم يتم العثور على رقم تتبع مطابق. تحقق من الرقم وحاول مجدداً.' : 'No matching tracking number found. Please check the number and try again.'}
              </p>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="precision-frame bg-white dark:bg-[#0C0C0C]/50 border border-gray-150 dark:border-gray-900 p-6 md:p-10 space-y-8"
            >
              <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-900 pb-4">
                <div>
                  <span className="text-[9px] uppercase font-mono text-gray-400 block">{isRtl ? 'رقم التتبع' : 'Tracking No.'}</span>
                  <span className="text-sm font-mono font-bold text-accent">{result.id}</span>
                </div>
                <div className="text-right rtl:text-left">
                  <span className="text-[9px] uppercase font-mono text-gray-400 block">{isRtl ? 'نوع المشروع' : 'Project Type'}</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300">{result.projectType}</span>
                </div>
              </div>

              {/* 5-step timeline */}
              <div className="space-y-0">
                {CLIENT_STEPS.map((step, idx) => {
                  const done = idx <= activeIdx;
                  const isLast = idx === CLIENT_STEPS.length - 1;
                  const date = stepDate(step, result.statusHistory);
                  return (
                    <div key={step.label} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        {done ? (
                          <CheckCircle2 className="w-6 h-6 text-accent shrink-0" strokeWidth={2.2} />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-300 dark:text-gray-700 shrink-0" strokeWidth={2} />
                        )}
                        {!isLast && (
                          <div className={`w-[2px] flex-1 min-h-[28px] ${idx < activeIdx ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-800'}`} />
                        )}
                      </div>
                      <div className="pb-8">
                        <p className={`text-sm font-semibold ${done ? 'text-gray-950 dark:text-white' : 'text-gray-400'}`}>
                          {isRtl ? step.labelAr : step.label}
                        </p>
                        {date && (
                          <p className="text-[10px] font-mono text-gray-400 mt-0.5">
                            {new Date(date).toLocaleString(isRtl ? 'ar-DZ' : 'en-US')}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
