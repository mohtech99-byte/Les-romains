import React, { useMemo, useState } from 'react';
import { useApp } from '../../store/AppContext.tsx';
import { calcLetters, buildRateMap } from '../../lib/workshopCalculations.ts';
import { calculateWorkshopEstimate } from '../../lib/workshopEstimatorApi.ts';
import { CalculatorCard, NumberField, SelectField, ResultRow, formatDzd, Field, PublicResultFooter, PrimaryButton } from './shared.tsx';
import { SaveEstimationBar } from './SaveEstimationBar.tsx';

const LIGHTING_OPTIONS_EN = [
  { value: 'none', label: 'No Light' },
  { value: 'front', label: 'Front Light' },
  { value: 'back', label: 'Back Light' },
  { value: 'halo', label: 'Halo' },
];
const LIGHTING_OPTIONS_AR = [
  { value: 'none', label: 'بدون إضاءة' },
  { value: 'front', label: 'إضاءة أمامية' },
  { value: 'back', label: 'إضاءة خلفية' },
  { value: 'halo', label: 'هالة مضيئة' },
];

export const LettersCalculator: React.FC<{ variant?: 'internal' | 'public' }> = ({ variant = 'internal' }) => {
  const { workshopPricing, workshopOptions, language, setCurrentView } = useApp();
  const isRtl = language === 'ar';
  const rates = useMemo(() => buildRateMap(workshopPricing), [workshopPricing]);
  const materials = workshopPricing.filter(p => p.group === 'material' && p.isActive);
  const materialOptions = workshopOptions.filter(o => o.group === 'material');

  const [letterHeightCm, setLetterHeightCm] = useState(0);
  const [materialKey, setMaterialKey] = useState('');
  const [frontColor, setFrontColor] = useState('');
  const [sideColor, setSideColor] = useState('');
  const [lighting, setLighting] = useState<'none' | 'front' | 'back' | 'halo'>('none');
  const [quantity, setQuantity] = useState(1);
  const [installationFlat, setInstallationFlat] = useState(0);
  const [marginPct, setMarginPct] = useState(25);

  const [publicResult, setPublicResult] = useState<{ estimatedPrice: number; currency: string; estimatedDeliveryDays?: { min: number; max: number } } | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState('');

  const internalResult = variant === 'internal' && materialKey && letterHeightCm > 0
    ? calcLetters({ letterHeightCm, materialKey, quantity, lighting, installationFlat, marginPct }, rates)
    : null;

  const handlePublicCalculate = async () => {
    if (!materialKey || !letterHeightCm) {
      setCalcError(isRtl ? 'يرجى تعبئة كل الحقول' : 'Please fill in every field');
      return;
    }
    setCalcError('');
    setCalculating(true);
    try {
      const res = await calculateWorkshopEstimate('letters', { letterHeightCm, materialKey, quantity, lighting });
      setPublicResult(res);
    } catch {
      setCalcError(isRtl ? 'فشل الحساب، حاول لاحقاً' : 'Calculation failed, please try again');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <CalculatorCard
      title={isRtl ? 'حاسبة حروف الأكريليك' : 'Acrylic Letters Calculator'}
      subtitle={isRtl ? 'حروف إعلانية ثلاثية الأبعاد — المادة والإضاءة والتركيب' : '3D signage letters — material, lighting and installation'}
    >
      {variant === 'internal' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberField label={isRtl ? 'ارتفاع الحرف (سم)' : 'Letter Height (cm)'} value={letterHeightCm} onChange={setLetterHeightCm} />
            <SelectField
              label={isRtl ? 'المادة / السماكة' : 'Material / Thickness'}
              value={materialKey}
              onChange={setMaterialKey}
              isRtl={isRtl}
              options={materials.map(m => ({ value: m.key, label: isRtl ? m.labelAr : m.label }))}
            />
            <Field label={isRtl ? 'اللون الأمامي' : 'Front Color'}>
              <input type="text" value={frontColor} onChange={e => setFrontColor(e.target.value)} placeholder={isRtl ? 'مثال: أبيض' : 'e.g. White'} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent" />
            </Field>
            <Field label={isRtl ? 'لون الجانب' : 'Side Color'}>
              <input type="text" value={sideColor} onChange={e => setSideColor(e.target.value)} placeholder={isRtl ? 'مثال: ذهبي' : 'e.g. Gold'} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent" />
            </Field>
            <SelectField label={isRtl ? 'الإضاءة' : 'Lighting'} value={lighting} onChange={v => setLighting(v as any)} options={isRtl ? LIGHTING_OPTIONS_AR : LIGHTING_OPTIONS_EN} isRtl={isRtl} />
            <NumberField label={isRtl ? 'الكمية' : 'Quantity'} value={quantity} onChange={setQuantity} min={1} step={1} />
            <NumberField label={isRtl ? 'التركيب (مبلغ ثابت دج)' : 'Installation (flat DZD)'} value={installationFlat} onChange={setInstallationFlat} />
            <NumberField label={isRtl ? 'هامش الربح %' : 'Margin %'} value={marginPct} onChange={setMarginPct} />
          </div>

          {internalResult && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-5">
              <ResultRow label={isRtl ? 'تكلفة التصنيع' : 'Manufacturing Cost'} value={formatDzd(internalResult.manufacturingCost, isRtl)} />
              <ResultRow label={isRtl ? 'الربح' : 'Profit'} value={formatDzd(internalResult.profit, isRtl)} />
              <ResultRow label={isRtl ? 'سعر البيع' : 'Selling Price'} value={formatDzd(internalResult.sellingPrice, isRtl)} emphasis />
            </div>
          )}

          {internalResult && (
            <SaveEstimationBar
              module="letters"
              inputs={{ letterHeightCm, materialKey, frontColor, sideColor, lighting, quantity, installationFlat, marginPct }}
              manufacturingCost={internalResult.manufacturingCost}
              sellingPrice={internalResult.sellingPrice}
              profit={internalResult.profit}
            />
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField label={isRtl ? 'ارتفاع الحرف (سم)' : 'Letter Height (cm)'} value={letterHeightCm} onChange={setLetterHeightCm} />
            <SelectField
              label={isRtl ? 'المادة' : 'Material'}
              value={materialKey}
              onChange={setMaterialKey}
              isRtl={isRtl}
              options={materialOptions.map(m => ({ value: m.key, label: isRtl ? m.labelAr : m.label }))}
            />
            <SelectField label={isRtl ? 'الإضاءة' : 'Lighting'} value={lighting} onChange={v => setLighting(v as any)} options={isRtl ? LIGHTING_OPTIONS_AR : LIGHTING_OPTIONS_EN} isRtl={isRtl} />
            <NumberField label={isRtl ? 'الكمية' : 'Quantity'} value={quantity} onChange={setQuantity} min={1} step={1} />
          </div>

          {calcError && <p className="text-[11px] text-red-500 mt-4">{calcError}</p>}

          <div className="mt-6">
            <PrimaryButton onClick={handlePublicCalculate}>
              {calculating ? (isRtl ? 'جارٍ الحساب...' : 'Calculating...') : (isRtl ? 'احسب السعر التقديري' : 'Calculate Estimate')}
            </PrimaryButton>
          </div>

          {publicResult && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-950 border border-accent/25 p-5">
              <ResultRow label={isRtl ? 'السعر التقديري' : 'Estimated Price'} value={formatDzd(publicResult.estimatedPrice, isRtl)} emphasis />
              {publicResult.estimatedDeliveryDays && (
                <ResultRow
                  label={isRtl ? 'مدة التنفيذ التقريبية' : 'Estimated Delivery'}
                  value={isRtl ? `${publicResult.estimatedDeliveryDays.min}-${publicResult.estimatedDeliveryDays.max} يوم` : `${publicResult.estimatedDeliveryDays.min}-${publicResult.estimatedDeliveryDays.max} days`}
                />
              )}
            </div>
          )}

          {publicResult && (
            <PublicResultFooter isRtl={isRtl} onRequestQuote={() => setCurrentView('quote')} />
          )}
        </>
      )}
    </CalculatorCard>
  );
};
