import React, { useMemo, useState } from 'react';
import { useApp } from '../../store/AppContext.tsx';
import { calcLaser, buildRateMap } from '../../lib/workshopCalculations.ts';
import { calculateWorkshopEstimate } from '../../lib/workshopEstimatorApi.ts';
import { CalculatorCard, NumberField, SelectField, ResultRow, formatDzd, PublicResultFooter, PrimaryButton } from './shared.tsx';
import { SaveEstimationBar } from './SaveEstimationBar.tsx';

export const LaserCalculator: React.FC<{ variant?: 'internal' | 'public' }> = ({ variant = 'internal' }) => {
  const { workshopPricing, workshopOptions, language, setCurrentView } = useApp();
  const isRtl = language === 'ar';
  const rates = useMemo(() => buildRateMap(workshopPricing), [workshopPricing]);
  const materials = workshopPricing.filter(p => p.group === 'material' && p.isActive);
  const materialOptions = workshopOptions.filter(o => o.group === 'material');

  const [materialKey, setMaterialKey] = useState('');
  const [cutLengthM, setCutLengthM] = useState(0);
  const [machineHours, setMachineHours] = useState(0);
  const [powerSurcharge, setPowerSurcharge] = useState(0);
  const [marginPct, setMarginPct] = useState(25);

  const [publicResult, setPublicResult] = useState<{ estimatedPrice: number; currency: string; estimatedDeliveryDays?: { min: number; max: number } } | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState('');

  const internalResult = variant === 'internal' && materialKey
    ? calcLaser({ materialKey, cutLengthM, machineHours, powerSurcharge, marginPct }, rates)
    : null;

  const handlePublicCalculate = async () => {
    if (!materialKey || !cutLengthM) {
      setCalcError(isRtl ? 'يرجى تعبئة كل الحقول' : 'Please fill in every field');
      return;
    }
    setCalcError('');
    setCalculating(true);
    try {
      const res = await calculateWorkshopEstimate('laser', { materialKey, cutLengthM });
      setPublicResult(res);
    } catch {
      setCalcError(isRtl ? 'فشل الحساب، حاول لاحقاً' : 'Calculation failed, please try again');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <CalculatorCard
      title={isRtl ? 'حاسبة القص بالليزر' : 'Laser Cutting Calculator'}
      subtitle={isRtl ? 'تسعير حسب وقت التشغيل وطول القص' : 'Machine time and cut length based pricing'}
    >
      {variant === 'internal' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectField label={isRtl ? 'المادة / السماكة' : 'Material / Thickness'} value={materialKey} onChange={setMaterialKey} isRtl={isRtl} options={materials.map(m => ({ value: m.key, label: isRtl ? m.labelAr : m.label }))} />
            <NumberField label={isRtl ? 'طول القص (م)' : 'Cut Length (m)'} value={cutLengthM} onChange={setCutLengthM} />
            <NumberField label={isRtl ? 'وقت تشغيل الآلة (ساعات)' : 'Machine Time (hours)'} value={machineHours} onChange={setMachineHours} />
            <NumberField label={isRtl ? 'رسم إضافي للطاقة (دج)' : 'Power Surcharge (DZD)'} value={powerSurcharge} onChange={setPowerSurcharge} />
            <NumberField label={isRtl ? 'هامش الربح %' : 'Margin %'} value={marginPct} onChange={setMarginPct} />
          </div>

          {internalResult && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-5">
              <ResultRow label={isRtl ? 'تكلفة الآلة' : 'Machine Cost'} value={formatDzd(internalResult.machineCost, isRtl)} />
              <ResultRow label={isRtl ? 'تكلفة المواد' : 'Material Cost'} value={formatDzd(internalResult.materialCost, isRtl)} />
              <ResultRow label={isRtl ? 'تكلفة التصنيع' : 'Manufacturing Cost'} value={formatDzd(internalResult.manufacturingCost, isRtl)} />
              <ResultRow label={isRtl ? 'الربح' : 'Profit'} value={formatDzd(internalResult.profit, isRtl)} />
              <ResultRow label={isRtl ? 'سعر البيع' : 'Selling Price'} value={formatDzd(internalResult.sellingPrice, isRtl)} emphasis />
            </div>
          )}

          {internalResult && (
            <SaveEstimationBar
              module="laser"
              inputs={{ materialKey, cutLengthM, machineHours, powerSurcharge, marginPct }}
              manufacturingCost={internalResult.manufacturingCost}
              sellingPrice={internalResult.sellingPrice}
              profit={internalResult.profit}
            />
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label={isRtl ? 'المادة' : 'Material'} value={materialKey} onChange={setMaterialKey} isRtl={isRtl} options={materialOptions.map(m => ({ value: m.key, label: isRtl ? m.labelAr : m.label }))} />
            <NumberField label={isRtl ? 'طول القص (م)' : 'Cut Length (m)'} value={cutLengthM} onChange={setCutLengthM} />
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
