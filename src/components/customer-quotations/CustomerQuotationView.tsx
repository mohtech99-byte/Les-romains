import React, { useState } from 'react';
import { ArrowLeft, FileDown, Copy, Edit, Trash2, Mail } from 'lucide-react';
import { useApp } from '../../store/AppContext.tsx';
import { CustomerQuotation } from '../../types';
import { StatusBadge, formatMoney } from './shared.tsx';
import { mapCustomerQuotationForPdf } from './pdfAdapter.ts';

interface Props {
  quotation: CustomerQuotation;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
  onDuplicated: (q: CustomerQuotation) => void;
}

export const CustomerQuotationView: React.FC<Props> = ({ quotation, onBack, onEdit, onDeleted, onDuplicated }) => {
  const { language, settings, deleteCustomerQuotation, duplicateCustomerQuotation, emailQuotationPdf } = useApp();
  const isRtl = language === 'ar';
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [emailingPdf, setEmailingPdf] = useState(false);

  const handleEmailPdf = async () => {
    if (!quotation.customerEmail) {
      alert(isRtl ? 'لا يوجد بريد إلكتروني لهذا الزبون' : 'This customer has no email on file');
      return;
    }
    setEmailingPdf(true);
    try {
      const { getQuotePdfBase64 } = await import('../../lib/generateQuotePdf.ts');
      const pdfBase64 = await getQuotePdfBase64(mapCustomerQuotationForPdf(quotation), settings);
      await emailQuotationPdf(quotation.customerEmail, quotation.customerName, quotation.quotationNumber, pdfBase64);
      alert(isRtl ? 'تم إرسال الملف بنجاح' : 'PDF emailed successfully');
    } catch (e) {
      alert(e instanceof Error ? e.message : (isRtl ? 'فشل إرسال البريد' : 'Failed to email PDF'));
    } finally {
      setEmailingPdf(false);
    }
  };

  const handleGeneratePdf = async () => {
    setGeneratingPdf(true);
    try {
      const { generateQuotePdf } = await import('../../lib/generateQuotePdf.ts');
      await generateQuotePdf(mapCustomerQuotationForPdf(quotation), settings);
    } catch {
      alert(isRtl ? 'فشل إنشاء PDF' : 'Failed to generate PDF');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleDuplicate = async () => {
    setDuplicating(true);
    try {
      const copy = await duplicateCustomerQuotation(quotation.id);
      onDuplicated(copy);
    } catch {
      alert(isRtl ? 'فشل النسخ' : 'Failed to duplicate');
    } finally {
      setDuplicating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(isRtl ? 'هل أنت متأكد من حذف عرض السعر هذا؟' : 'Delete this quotation permanently?')) return;
    setDeleting(true);
    try {
      await deleteCustomerQuotation(quotation.id);
      onDeleted();
    } catch {
      alert(isRtl ? 'فشل الحذف' : 'Failed to delete');
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase text-gray-400 hover:text-accent transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          {isRtl ? 'رجوع للقائمة' : 'Back to List'}
        </button>
        <StatusBadge status={quotation.status} isRtl={isRtl} />
      </div>

      <div className="precision-frame bg-white dark:bg-[#0C0C0C]/50 border border-gray-150 dark:border-gray-900 p-6 md:p-10 space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-150 dark:border-gray-900 pb-6">
          <div>
            <span className="text-[9px] uppercase font-mono text-gray-400 block">{isRtl ? 'رقم عرض السعر' : 'Quotation Number'}</span>
            <span className="text-lg font-mono font-bold text-accent">{quotation.quotationNumber}</span>
          </div>
          <div className="text-right rtl:text-left">
            <span className="text-[9px] uppercase font-mono text-gray-400 block">{isRtl ? 'تاريخ الإصدار' : 'Issue Date'}</span>
            <span className="text-xs text-gray-700 dark:text-gray-300">{quotation.issueDate}</span>
            <span className="text-[9px] uppercase font-mono text-gray-400 block mt-2">{isRtl ? 'صالح حتى' : 'Valid Until'}</span>
            <span className="text-xs text-gray-700 dark:text-gray-300">{quotation.validUntil}</span>
          </div>
        </div>

        {/* Customer info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5 text-xs">
            <span className="text-[9px] uppercase font-mono text-gray-400 block">{isRtl ? 'الزبون' : 'Customer'}</span>
            <p className="text-gray-900 dark:text-white font-bold">{quotation.customerName}</p>
            <p className="text-gray-500">{quotation.customerPhone}</p>
            {quotation.customerEmail && <p className="text-gray-500">{quotation.customerEmail}</p>}
            {quotation.customerAddress && <p className="text-gray-500">{quotation.customerAddress}</p>}
          </div>
          {quotation.notes && (
            <div className="space-y-1.5 text-xs">
              <span className="text-[9px] uppercase font-mono text-gray-400 block">{isRtl ? 'ملاحظات' : 'Notes'}</span>
              <p className="text-gray-700 dark:text-gray-300 italic whitespace-pre-line">{quotation.notes}</p>
            </div>
          )}
        </div>

        {/* Items */}
        <div>
          <span className="text-[9px] uppercase font-mono text-gray-400 block mb-3">{isRtl ? 'البنود' : 'Items'}</span>
          <div className="border border-gray-150 dark:border-gray-900 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950 text-[9px] uppercase font-mono text-gray-400">
                  <th className="text-left rtl:text-right p-3">{isRtl ? 'الوصف' : 'Description'}</th>
                  <th className="text-center p-3">{isRtl ? 'الكمية' : 'Qty'}</th>
                  <th className="text-right rtl:text-left p-3">{isRtl ? 'سعر الوحدة' : 'Unit Price'}</th>
                  <th className="text-right rtl:text-left p-3">{isRtl ? 'المجموع' : 'Total'}</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, idx) => (
                  <tr key={item.id ?? idx} className="border-t border-gray-150 dark:border-gray-900">
                    <td className="p-3 text-gray-900 dark:text-white">{item.description}</td>
                    <td className="p-3 text-center text-gray-500">{item.quantity}</td>
                    <td className="p-3 text-right rtl:text-left text-gray-500 font-mono">{formatMoney(item.unitPrice, isRtl)}</td>
                    <td className="p-3 text-right rtl:text-left text-gray-700 dark:text-gray-300 font-mono">{formatMoney(item.total, isRtl)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="max-w-xs ms-auto mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-mono uppercase text-[10px]">{isRtl ? 'المجموع الفرعي' : 'Subtotal'}</span>
              <span className="text-gray-700 dark:text-gray-300 font-mono">{formatMoney(quotation.subtotal, isRtl)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-mono uppercase text-[10px]">{isRtl ? 'الخصم' : 'Discount'}</span>
              <span className="text-gray-700 dark:text-gray-300 font-mono">-{formatMoney(quotation.discount, isRtl)}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-gray-150 dark:border-gray-900">
              <span className="text-gray-900 dark:text-white font-mono uppercase text-[10px]">{isRtl ? 'الإجمالي' : 'Grand Total'}</span>
              <span className="text-accent font-mono">{formatMoney(quotation.total, isRtl)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          disabled={generatingPdf}
          onClick={handleGeneratePdf}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-accent border border-accent/40 font-semibold text-xs uppercase tracking-widest rounded transition-all disabled:opacity-60"
        >
          <FileDown className="w-4 h-4" />
          {generatingPdf ? (isRtl ? 'جارٍ الإنشاء...' : 'Generating...') : (isRtl ? 'إنشاء PDF' : 'Generate PDF')}
        </button>
        <button
          disabled={emailingPdf}
          onClick={handleEmailPdf}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-700 hover:border-accent hover:text-accent text-gray-500 font-semibold text-xs uppercase tracking-widest rounded transition-all disabled:opacity-60"
        >
          <Mail className="w-4 h-4" />
          {emailingPdf ? (isRtl ? 'جارٍ الإرسال...' : 'Sending...') : (isRtl ? 'إرسال PDF بالبريد' : 'Email PDF to Customer')}
        </button>
        <button
          disabled={duplicating}
          onClick={handleDuplicate}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-700 hover:border-accent hover:text-accent text-gray-500 font-semibold text-xs uppercase tracking-widest rounded transition-all disabled:opacity-60"
        >
          <Copy className="w-4 h-4" />
          {isRtl ? 'نسخ' : 'Duplicate'}
        </button>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-black font-semibold text-xs uppercase tracking-widest rounded transition-all"
        >
          <Edit className="w-4 h-4" />
          {isRtl ? 'تعديل' : 'Edit'}
        </button>
        <button
          disabled={deleting}
          onClick={handleDelete}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-red-500/30 hover:bg-red-500/10 text-red-500 font-semibold text-xs uppercase tracking-widest rounded transition-all disabled:opacity-60"
        >
          <Trash2 className="w-4 h-4" />
          {isRtl ? 'حذف' : 'Delete'}
        </button>
      </div>
    </div>
  );
};
