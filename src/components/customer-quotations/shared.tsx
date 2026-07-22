import React from 'react';
import { CustomerQuotationStatus } from '../../types';

export const inputClasses = 'w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent';
export const labelClasses = 'block text-[10px] text-gray-400 uppercase font-mono mb-1.5 tracking-wider';

export const STATUS_META: Record<CustomerQuotationStatus, { label: string; labelAr: string; classes: string }> = {
  draft: { label: 'Draft', labelAr: 'مسودة', classes: 'bg-gray-500/10 text-gray-400 border-gray-500/25' },
  sent: { label: 'Sent', labelAr: 'مُرسل', classes: 'bg-blue-500/10 text-blue-400 border-blue-500/25' },
  approved: { label: 'Approved', labelAr: 'موافق عليه', classes: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25' },
  rejected: { label: 'Rejected', labelAr: 'مرفوض', classes: 'bg-red-500/10 text-red-500 border-red-500/25' },
  expired: { label: 'Expired', labelAr: 'منتهي', classes: 'bg-amber-500/10 text-amber-500 border-amber-500/25' },
};

export const StatusBadge: React.FC<{ status: CustomerQuotationStatus; isRtl?: boolean }> = ({ status, isRtl }) => {
  const meta = STATUS_META[status] || STATUS_META.draft;
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${meta.classes}`}>
      {isRtl ? meta.labelAr : meta.label}
    </span>
  );
};

export const formatMoney = (n: number, isRtl?: boolean) =>
  Math.round(n).toLocaleString(isRtl ? 'ar-DZ' : 'en-US') + (isRtl ? ' دج' : ' DZD');
