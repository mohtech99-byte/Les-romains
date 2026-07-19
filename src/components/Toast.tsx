/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const VARIANT_STYLES: Record<ToastVariant, { icon: React.ReactNode; border: string; iconColor: string }> = {
  success: {
    icon: <CheckCircle2 className="w-4.5 h-4.5" />,
    border: 'border-l-4 rtl:border-l-0 rtl:border-r-4 border-emerald-500',
    iconColor: 'text-emerald-500',
  },
  error: {
    icon: <XCircle className="w-4.5 h-4.5" />,
    border: 'border-l-4 rtl:border-l-0 rtl:border-r-4 border-red-500',
    iconColor: 'text-red-500',
  },
  info: {
    icon: <Info className="w-4.5 h-4.5" />,
    border: 'border-l-4 rtl:border-l-0 rtl:border-r-4 border-accent',
    iconColor: 'text-accent',
  },
};

const AUTO_DISMISS_MS = 4000;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((message: string, variant: ToastVariant) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
  }, [dismiss]);

  const value: ToastContextValue = {
    success: (message: string) => push(message, 'success'),
    error: (message: string) => push(message, 'error'),
    info: (message: string) => push(message, 'info'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast stack */}
      <div className="fixed top-4 right-4 rtl:right-auto rtl:left-4 z-[9999] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const style = VARIANT_STYLES[t.variant];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`pointer-events-auto flex items-start gap-3 bg-white dark:bg-gray-900 ${style.border} border-t border-b border-r rtl:border-r-0 rtl:border-l border-gray-150 dark:border-gray-800 shadow-xl rounded-sm px-4 py-3 font-sans`}
              >
                <span className={`mt-0.5 shrink-0 ${style.iconColor}`}>{style.icon}</span>
                <p className="text-sm text-gray-800 dark:text-gray-100 leading-snug flex-1">{t.message}</p>
                <button
                  onClick={() => dismiss(t.id)}
                  className="shrink-0 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors mt-0.5"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};
