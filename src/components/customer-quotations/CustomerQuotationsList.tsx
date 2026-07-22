import React, { useMemo, useState } from 'react';
import { Search, Plus, Eye, Edit, Copy, Trash2, FileDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../store/AppContext.tsx';
import { CustomerQuotation, CustomerQuotationStatus } from '../../types';
import { StatusBadge, formatMoney, inputClasses } from './shared.tsx';
import { mapCustomerQuotationForPdf } from './pdfAdapter.ts';

interface Props {
  onCreate: () => void;
  onView: (q: CustomerQuotation) => void;
  onEdit: (q: CustomerQuotation) => void;
}

const PAGE_SIZE = 10;

export const CustomerQuotationsList: React.FC<Props> = ({ onCreate, onView, onEdit }) => {
  const { language, settings, customerQuotations, deleteCustomerQuotation, duplicateCustomerQuotation } = useApp();
  const isRtl = language === 'ar';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerQuotationStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return customerQuotations.filter(q => {
      const matchesSearch = !term
        || q.quotationNumber.toLowerCase().includes(term)
        || q.customerName.toLowerCase().includes(term)
        || q.customerPhone.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customerQuotations, search, statusFilter]);

  const totalPages = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1);
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleDelete = async (q: CustomerQuotation) => {
    if (!confirm(isRtl ? `حذف عرض السعر ${q.quotationNumber}؟` : `Delete quotation ${q.quotationNumber}?`)) return;
    try {
      await deleteCustomerQuotation(q.id);
    } catch {
      alert(isRtl ? 'فشل الحذف' : 'Failed to delete');
    }
  };

  const handleDuplicate = async (q: CustomerQuotation) => {
    setDuplicatingId(q.id);
    try {
      await duplicateCustomerQuotation(q.id);
    } catch {
      alert(isRtl ? 'فشل النسخ' : 'Failed to duplicate');
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleGeneratePdf = async (q: CustomerQuotation) => {
    setGeneratingId(q.id);
    try {
      const { generateQuotePdf } = await import('../../lib/generateQuotePdf.ts');
      await generateQuotePdf(mapCustomerQuotationForPdf(q), settings);
    } catch {
      alert(isRtl ? 'فشل إنشاء PDF' : 'Failed to generate PDF');
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-gray-950 dark:text-white font-medium">
            {isRtl ? 'عروض أسعار الزبائن' : 'Customer Quotations'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {isRtl ? 'إنشاء وإدارة عروض الأسعار للزبائن الحاضرين أو عبر الهاتف/واتساب' : 'Create and manage quotations for walk-in, phone, or WhatsApp customers'}
          </p>
        </div>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-black font-semibold text-xs font-mono uppercase tracking-widest rounded-none transition-all"
        >
          <Plus className="w-4 h-4" />
          {isRtl ? 'إنشاء عرض سعر' : 'Create Quotation'}
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder={isRtl ? 'ابحث بالاسم، الهاتف، أو رقم العرض...' : 'Search by name, phone, or quotation number...'}
            className={`${inputClasses} pl-9 rtl:pl-3 rtl:pr-9`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value as any); setPage(1); }}
          className={`sm:w-56 ${inputClasses}`}
        >
          <option value="all">{isRtl ? 'كل الحالات' : 'All Statuses'}</option>
          <option value="draft">{isRtl ? 'مسودة' : 'Draft'}</option>
          <option value="sent">{isRtl ? 'مُرسل' : 'Sent'}</option>
          <option value="approved">{isRtl ? 'موافق عليه' : 'Approved'}</option>
          <option value="rejected">{isRtl ? 'مرفوض' : 'Rejected'}</option>
          <option value="expired">{isRtl ? 'منتهي' : 'Expired'}</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-gray-150 dark:border-gray-900 overflow-x-auto">
        <table className="w-full text-xs min-w-[760px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-950 text-[9px] uppercase font-mono text-gray-400">
              <th className="text-left rtl:text-right p-3">{isRtl ? 'رقم العرض' : 'Quotation Number'}</th>
              <th className="text-left rtl:text-right p-3">{isRtl ? 'الزبون' : 'Customer'}</th>
              <th className="text-left rtl:text-right p-3">{isRtl ? 'تاريخ الإصدار' : 'Issue Date'}</th>
              <th className="text-left rtl:text-right p-3">{isRtl ? 'الحالة' : 'Status'}</th>
              <th className="text-right rtl:text-left p-3">{isRtl ? 'الإجمالي' : 'Grand Total'}</th>
              <th className="text-right rtl:text-left p-3">{isRtl ? 'إجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map(q => (
              <tr key={q.id} className="border-t border-gray-150 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-950/50 transition-colors">
                <td className="p-3 font-mono text-accent font-bold">{q.quotationNumber}</td>
                <td className="p-3">
                  <p className="text-gray-900 dark:text-white font-semibold">{q.customerName}</p>
                  <p className="text-gray-400 text-[10px]">{q.customerPhone}</p>
                </td>
                <td className="p-3 text-gray-500">{q.issueDate}</td>
                <td className="p-3"><StatusBadge status={q.status} isRtl={isRtl} /></td>
                <td className="p-3 text-right rtl:text-left font-mono font-bold text-gray-900 dark:text-white">{formatMoney(q.total, isRtl)}</td>
                <td className="p-3">
                  <div className="flex items-center justify-end rtl:justify-start gap-1">
                    <button onClick={() => onView(q)} title={isRtl ? 'عرض' : 'View'} className="p-1.5 text-gray-400 hover:text-accent transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    <button onClick={() => onEdit(q)} title={isRtl ? 'تعديل' : 'Edit'} className="p-1.5 text-gray-400 hover:text-accent transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                    <button
                      disabled={duplicatingId === q.id}
                      onClick={() => handleDuplicate(q)}
                      title={isRtl ? 'نسخ' : 'Duplicate'}
                      className="p-1.5 text-gray-400 hover:text-accent transition-colors disabled:opacity-50"
                    ><Copy className="w-3.5 h-3.5" /></button>
                    <button
                      disabled={generatingId === q.id}
                      onClick={() => handleGeneratePdf(q)}
                      title={isRtl ? 'إنشاء PDF' : 'Generate PDF'}
                      className="p-1.5 text-gray-400 hover:text-accent transition-colors disabled:opacity-50"
                    ><FileDown className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(q)} title={isRtl ? 'حذف' : 'Delete'} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-400 text-xs">
                  {isRtl ? 'لا توجد عروض أسعار مطابقة.' : 'No matching quotations.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 font-mono">
            {isRtl
              ? `صفحة ${currentPage} من ${totalPages} (${filtered.length} نتيجة)`
              : `Page ${currentPage} of ${totalPages} (${filtered.length} results)`}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              className="p-2 border border-gray-200 dark:border-gray-800 disabled:opacity-40 hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              className="p-2 border border-gray-200 dark:border-gray-800 disabled:opacity-40 hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
