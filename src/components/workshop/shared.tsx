import React from 'react';

const inputClasses = 'w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent';
const labelClasses = 'block text-[10px] text-gray-400 uppercase font-mono mb-1.5 tracking-wider';

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className={labelClasses}>{label}</label>
    {children}
  </div>
);

export const NumberField: React.FC<{
  label: string;
  value: number | string;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
  placeholder?: string;
}> = ({ label, value, onChange, min = 0, step = 0.1, placeholder }) => (
  <Field label={label}>
    <input
      type="number"
      min={min}
      step={step}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      className={inputClasses}
    />
  </Field>
);

export const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => (
  <Field label={label}>
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className={inputClasses}
    />
  </Field>
);

export const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  isRtl?: boolean;
}> = ({ label, value, onChange, options, isRtl }) => (
  <Field label={label}>
    <select value={value} onChange={e => onChange(e.target.value)} className={inputClasses}>
      <option value="">{isRtl ? 'اختر' : 'Select'}</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </Field>
);

export const ToggleField: React.FC<{
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  isRtl?: boolean;
}> = ({ label, value, onChange, isRtl }) => (
  <Field label={label}>
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 px-3 py-2.5 text-[10px] font-mono uppercase tracking-wider border transition-all ${value ? 'bg-accent text-black border-accent' : 'border-gray-200 dark:border-gray-800 text-gray-400'}`}
      >
        {isRtl ? 'نعم' : 'Yes'}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 px-3 py-2.5 text-[10px] font-mono uppercase tracking-wider border transition-all ${!value ? 'bg-accent text-black border-accent' : 'border-gray-200 dark:border-gray-800 text-gray-400'}`}
      >
        {isRtl ? 'لا' : 'No'}
      </button>
    </div>
  </Field>
);

export const ResultRow: React.FC<{ label: string; value: string; emphasis?: boolean }> = ({ label, value, emphasis }) => (
  <div className={`flex items-center justify-between py-2.5 ${emphasis ? '' : 'border-b border-gray-150 dark:border-gray-900'}`}>
    <span className={`text-[11px] font-mono uppercase tracking-wider ${emphasis ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-400'}`}>{label}</span>
    <span className={`font-mono ${emphasis ? 'text-accent text-lg font-bold' : 'text-xs text-gray-700 dark:text-gray-300'}`}>{value}</span>
  </div>
);

export const CalculatorCard: React.FC<{ title: string; subtitle: string; children: React.ReactNode; signature?: boolean }> = ({ title, subtitle, children, signature }) => (
  <div className={`${signature ? 'precision-frame ' : ''}bg-white dark:bg-[#0C0C0C]/50 rounded-none border border-gray-150 dark:border-gray-900 p-6 md:p-8`}>
    <div className="mb-6">
      <h3 className="font-serif text-xl md:text-2xl text-gray-900 dark:text-white font-normal">{title}</h3>
      <p className="text-[11px] text-gray-500 mt-1">{subtitle}</p>
    </div>
    {children}
  </div>
);

export const formatDzd = (n: number, isRtl?: boolean) =>
  Math.round(n).toLocaleString(isRtl ? 'ar-DZ' : 'en-US') + (isRtl ? ' دج' : ' DZD');

export const PrimaryButton: React.FC<{ onClick: () => void; children: React.ReactNode; type?: 'button' | 'submit' }> = ({ onClick, children, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    className="px-6 py-3 bg-accent hover:bg-accent-dark text-black font-semibold text-xs font-mono uppercase tracking-[0.15em] rounded-none transition-all"
  >
    {children}
  </button>
);

export const SecondaryButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-accent hover:text-accent text-gray-500 font-semibold text-xs font-mono uppercase tracking-[0.15em] rounded-none transition-all"
  >
    {children}
  </button>
);

/**
 * Shown instead of <SaveEstimationBar/> when a calculator renders in
 * variant="public" (customer-facing Workshop page). No internal save/PDF
 * actions — just a non-binding disclaimer and a path into the official
 * quote request flow.
 */
export const PublicResultFooter: React.FC<{ isRtl: boolean; onRequestQuote: () => void }> = ({ isRtl, onRequestQuote }) => (
  <div className="border-t border-gray-150 dark:border-gray-900 mt-6 pt-6 space-y-4">
    <p className="text-[10px] text-gray-400 leading-relaxed">
      {isRtl
        ? '* هذا سعر تقديري أولي غير ملزم لأغراض التخطيط فقط. السعر النهائي يُحدد بعد دراسة تفصيلية لمواصفات مشروعك.'
        : '* This is a non-binding preliminary estimate for planning purposes only. The final price is confirmed after a detailed review of your project.'}
    </p>
    <PrimaryButton onClick={onRequestQuote}>
      {isRtl ? 'اطلب عرض سعر رسمي ←' : 'Request Official Quote →'}
    </PrimaryButton>
  </div>
);
