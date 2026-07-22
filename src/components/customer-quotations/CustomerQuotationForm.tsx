import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import { useApp } from '../../store/AppContext.tsx';
import { CustomerQuotation, CustomerQuotationInput, CustomerQuotationItem, CustomerQuotationStatus } from '../../types';
import { inputClasses, labelClasses, formatMoney } from './shared.tsx';

interface Props {
  existing?: CustomerQuotation; // present when editing
  onSaved: (quotation: CustomerQuotation) => void;
  onCancel: () => void;
}

const todayIso = () => new Date().toISOString().slice(0, 10);
const inDaysIso = (days: number) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

const emptyItem = (): CustomerQuotationItem => ({ description: '', quantity: 1, unitPrice: 0, total: 0 });

export const CustomerQuotationForm: React.FC<Props> = ({ existing, onSaved, onCancel }) => {
  const { language, createCustomerQuotation, updateCustomerQuotation } = useApp();
  const isRtl = language === 'ar';

  const [customerName, setCustomerName] = useState(existing?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(existing?.customerPhone || '');
  const [customerEmail, setCustomerEmail] = useState(existing?.customerEmail || '');
  const [customerAddress, setCustomerAddress] = useState(existing?.customerAddress || '');
  const [issueDate, setIssueDate] = useState(existing?.issueDate || todayIso());
  const [validUntil, setValidUntil] = useState(existing?.validUntil || inDaysIso(15));
  const [notes, setNotes] = useState(existing?.notes || '');
  const [status, setStatus] = useState<CustomerQuotationStatus>(existing?.status || 'draft');
  const [discount, setDiscount] = useState(existing?.discount || 0);
  const [items, setItems] = useState<CustomerQuotationItem[]>(
    existing?.items && existing.items.length > 0 ? existing.items : [emptyItem()]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const subtotal = items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
  const grandTotal = Math.max(subtotal - (Number(discount) || 0), 0);

  const updateItem = (idx: number, patch: Partial<CustomerQuotationItem>) => {
    setItems(prev => prev.map((it, i) => {
      if (i !== idx) return it;
      const next = { ...it, ...patch };
      next.total = (Number(next.quantity) || 0) * (Number(next.unitPrice) || 0);
      return next;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setError(isRtl ? 'اسم الزبون والهاتف مطلوبان' : 'Customer name and phone are required');
      return;
    }
    const cleanItems = items.filter(it => it.description.trim());
    if (cleanItems.length === 0) {
      setError(isRtl ? 'أضف بنداً واحداً على الأقل' : 'Add at least one item');
      return;
    }

    const payload: CustomerQuotationInput = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      customerAddress: customerAddress.trim(),
      issueDate,
      validUntil,
      subtotal,
      discount: Number(discount) || 0,
      total: grandTotal,
      notes,
      status,
      items: cleanItems,
    };

    setSaving(true);
    try {
      const saved = existing
        ? await updateCustomerQuotation(existing.id, payload)
        : await createCustomerQuotation(payload);
      onSaved(saved);
    } catch {
      setError(isRtl ? 'فشل حفظ عرض السعر' : 'Failed to save the quotation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onCancel} className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase text-gray-400 hover:text-accent transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          {isRtl ? 'رجوع للقائمة' : 'Back to List'}
        </button>
        {existing && <span className="text-[10px] font-mono text-gray-400">{existing.quotationNumber}</span>}
      </div>

      {/* Customer Information */}
      <div className="bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-5 space-y-4">
        <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
          {isRtl ? 'معلومات الزبون' : 'Customer Information'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>{isRtl ? 'الاسم *' : 'Name *'}</label>
            <input required value={customerName} onChange={e => setCustomerName(e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>{isRtl ? 'الهاتف *' : 'Phone *'}</label>
            <input required value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
            <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>{isRtl ? 'العنوان' : 'Address'}</label>
            <input value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className={inputClasses} />
          </div>
        </div>
      </div>

      {/* Quotation meta */}
      <div className="bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-5 space-y-4">
        <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
          {isRtl ? 'تفاصيل العرض' : 'Quotation'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClasses}>{isRtl ? 'تاريخ الإصدار' : 'Issue Date'}</label>
            <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>{isRtl ? 'صالح حتى' : 'Valid Until'}</label>
            <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>{isRtl ? 'الحالة' : 'Status'}</label>
            <select value={status} onChange={e => setStatus(e.target.value as CustomerQuotationStatus)} className={inputClasses}>
              <option value="draft">{isRtl ? 'مسودة' : 'Draft'}</option>
              <option value="sent">{isRtl ? 'مُرسل' : 'Sent'}</option>
              <option value="approved">{isRtl ? 'موافق عليه' : 'Approved'}</option>
              <option value="rejected">{isRtl ? 'مرفوض' : 'Rejected'}</option>
              <option value="expired">{isRtl ? 'منتهي' : 'Expired'}</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClasses}>{isRtl ? 'ملاحظات' : 'Notes'}</label>
          <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className={inputClasses} />
        </div>
      </div>

      {/* Items table */}
      <div className="bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-5 space-y-4">
        <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
          {isRtl ? 'البنود' : 'Items'}
        </span>

        <div className="hidden sm:grid grid-cols-12 gap-2 text-[9px] uppercase font-mono text-gray-400 px-1">
          <span className="col-span-6">{isRtl ? 'الوصف' : 'Description'}</span>
          <span className="col-span-2">{isRtl ? 'الكمية' : 'Quantity'}</span>
          <span className="col-span-2">{isRtl ? 'سعر الوحدة' : 'Unit Price'}</span>
          <span className="col-span-1">{isRtl ? 'المجموع' : 'Total'}</span>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              <input
                value={item.description}
                onChange={e => updateItem(idx, { description: e.target.value })}
                placeholder={isRtl ? 'الوصف' : 'Description'}
                className={`col-span-6 ${inputClasses}`}
              />
              <input
                type="number"
                min={0}
                step="0.01"
                value={item.quantity}
                onChange={e => updateItem(idx, { quantity: parseFloat(e.target.value) || 0 })}
                className={`col-span-2 ${inputClasses}`}
              />
              <input
                type="number"
                min={0}
                step="0.01"
                value={item.unitPrice}
                onChange={e => updateItem(idx, { unitPrice: parseFloat(e.target.value) || 0 })}
                className={`col-span-2 ${inputClasses}`}
              />
              <span className="col-span-1 text-[11px] font-mono text-gray-500 text-center truncate">
                {formatMoney(item.total, isRtl)}
              </span>
              <button
                type="button"
                onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}
                className="col-span-1 p-2 text-gray-400 hover:text-red-500 transition-colors justify-self-end"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setItems(prev => [...prev, emptyItem()])}
          className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-accent hover:text-accent-dark"
        >
          <Plus className="w-3.5 h-3.5" /> {isRtl ? 'إضافة بند' : 'Add Item'}
        </button>

        {/* Totals */}
        <div className="border-t border-gray-150 dark:border-gray-900 pt-4 space-y-2 max-w-xs ms-auto">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-mono uppercase text-[10px]">{isRtl ? 'المجموع الفرعي' : 'Subtotal'}</span>
            <span className="text-gray-700 dark:text-gray-300 font-mono">{formatMoney(subtotal, isRtl)}</span>
          </div>
          <div className="flex items-center justify-between text-xs gap-3">
            <span className="text-gray-400 font-mono uppercase text-[10px]">{isRtl ? 'الخصم' : 'Discount'}</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={discount}
              onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
              className="w-28 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none px-2 py-1.5 text-xs text-gray-900 dark:text-white text-right"
            />
          </div>
          <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-gray-150 dark:border-gray-900">
            <span className="text-gray-900 dark:text-white font-mono uppercase text-[10px]">{isRtl ? 'الإجمالي' : 'Grand Total'}</span>
            <span className="text-accent font-mono">{formatMoney(grandTotal, isRtl)}</span>
          </div>
        </div>
      </div>

      {error && <p className="text-[11px] text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-black font-semibold text-xs font-mono uppercase tracking-[0.15em] rounded-none transition-all disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? (isRtl ? 'جارٍ الحفظ...' : 'Saving...') : (existing ? (isRtl ? 'حفظ التعديلات' : 'Save Changes') : (isRtl ? 'إنشاء عرض السعر' : 'Create Quotation'))}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-accent hover:text-accent text-gray-500 font-semibold text-xs font-mono uppercase tracking-[0.15em] rounded-none transition-all">
          {isRtl ? 'إلغاء' : 'Cancel'}
        </button>
      </div>
    </form>
  );
};
