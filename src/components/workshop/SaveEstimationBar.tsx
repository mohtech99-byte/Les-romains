import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../../store/AppContext.tsx';
import { WorkshopModule } from '../../types';
import { TextField, PrimaryButton } from './shared.tsx';

interface Props {
  module: WorkshopModule;
  inputs: Record<string, any>;
  manufacturingCost: number;
  sellingPrice: number;
  profit: number;
  disabled?: boolean;
}

export const SaveEstimationBar: React.FC<Props> = ({ module, inputs, manufacturingCost, sellingPrice, profit, disabled }) => {
  const { saveEstimation, language } = useApp();
  const isRtl = language === 'ar';
  const [client, setClient] = useState('');
  const [projectName, setProjectName] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!client || !projectName || disabled) return;
    setSaving(true);
    try {
      await saveEstimation({
        module,
        client,
        projectName,
        notes,
        inputs,
        manufacturingCost,
        sellingPrice,
        profit,
        status: 'draft',
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert(isRtl ? 'فشل حفظ التقدير' : 'Failed to save estimation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-t border-gray-150 dark:border-gray-900 mt-6 pt-6 space-y-4">
      <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold block">
        {isRtl ? 'حفظ هذا التقدير' : 'Save This Estimation'}
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label={isRtl ? 'الزبون' : 'Client'} value={client} onChange={setClient} placeholder={isRtl ? 'اسم الزبون' : 'Client name'} />
        <TextField label={isRtl ? 'اسم المشروع' : 'Project Name'} value={projectName} onChange={setProjectName} placeholder={isRtl ? 'اسم المشروع' : 'Project name'} />
      </div>
      <TextField label={isRtl ? 'ملاحظات' : 'Notes'} value={notes} onChange={setNotes} placeholder={isRtl ? 'ملاحظات اختيارية' : 'Optional notes'} />
      <div className="flex items-center gap-3">
        <PrimaryButton onClick={handleSave}>
          {saving ? (isRtl ? 'جارٍ الحفظ...' : 'Saving...') : (isRtl ? 'حفظ التقدير' : 'Save Estimation')}
        </PrimaryButton>
        {saved && (
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-green-500">
            <Check className="w-3.5 h-3.5" /> {isRtl ? 'تم الحفظ' : 'Saved'}
          </span>
        )}
      </div>
    </div>
  );
};
