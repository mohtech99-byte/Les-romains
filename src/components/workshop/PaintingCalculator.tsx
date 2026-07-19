import React, { useMemo, useState } from 'react';
import { useApp } from '../../store/AppContext.tsx';
import { calcPainting, buildRateMap } from '../../lib/workshopCalculations.ts';
import { calculateWorkshopEstimate } from '../../lib/workshopEstimatorApi.ts';
import { CalculatorCard, NumberField, SelectField, ToggleField, ResultRow, formatDzd, PublicResultFooter, PrimaryButton } from './shared.tsx';
import { SaveEstimationBar } from './SaveEstimationBar.tsx';

export const PaintingCalculator: React.FC<{ variant?: 'internal' | 'public' }> = ({ variant = 'internal' }) => {
  const { workshopPricing, workshopOptions, language, setCurrentView } = useApp();
  const isRtl = language === 'ar';
  const rates = useMemo(() => buildRateMap(workshopPricing), [workshopPricing]);
  const paints = workshopPricing.filter(p => p.group === 'paint' && p.isActive);
  const paintOptions = workshopOptions.filter(o => o.group === 'paint');

  const [paintKey, setPaintKey] = useState('');
  const [areaM2, setAreaM2] = useState(0);
  const [coats, setCoats] = useState(2);
  const [primer, setPrimer] = useState(false);
  const [sanding, setSanding] = useState(false);
  const [clearCoat, setClearCoat] = useState(false);
  const [laborCost, setLaborCost] = useState(0);
  const [marginPct, setMarginPct] = useState(25);

  const [publicResult, setPublicResult] = useState<{ estimatedPrice: number; currency: string; estimatedDeliveryDays?: { min: number; max: number } } | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState('');

  const internalResult = variant === 'internal' && paintKey && areaM2 > 0
    ? calcPainting({ paintKey, areaM2, coats, primer, sanding, clearCoat, laborCost, marginPct }, rates)
    : null;

  const handlePublicCalculate = async () => {
    if (!paintKey || !areaM2) {
      setCalcError(isRtl ? 'يرجى تعبئة كل الحقول' : 'Please fill in every field');
      return;
    }
    setCalcError('');
    setCalculating(true);
    try {
      const res = await calculateWorkshopEstimate('painting', { paintKey, areaM2, coats, primer, sanding, clearCoat });
      setPublicResult(res);
    } catch {
      setCalcError(isRtl ? 'فشل الحساب، حاول لاحقاً' : 'Calculation failed, please try again');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <CalculatorCard
      title={isRtl ? 'حاسبة الدهان' : 'Painting Calculator'}
      subtitle={isRtl ? 'تشطيب الأسطح — برايمر، صنفرة، طبقات وطبقة واقية' : 'Surface finishing — primer, sanding, coats and clear coat'}
    >
      {variant === 'internal' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectField label={isRtl ? 'نوع الدهان' : 'Paint Type'} value={paintKey} onChange={setPaintKey} isRtl={isRtl} options={paints.map(p => ({ value: p.key, label: isRtl ? p.labelAr : p.label }))} />
            <NumberField label={isRtl ? 'مساحة السطح (م²)' : 'Surface Area (m²)'} value={areaM2} onChange={setAreaM2} />
            <NumberField label={isRtl ? 'عدد الطبقات' : 'Number of Coats'} value={coats} onChange={setCoats} min={1} step={1} />
            <ToggleField label={isRtl ? 'برايمر' : 'Primer'} value={primer} onChange={setPrimer} isRtl={isRtl} />
            <ToggleField label={isRtl ? 'صنفرة' : 'Sanding'} value={sanding} onChange={setSanding} isRtl={isRtl} />
            <ToggleField label={isRtl ? 'طبقة واقية' : 'Clear Coat'} value={clearCoat} onChange={setClearCoat} isRtl={isRtl} />
            <NumberField label={isRtl ? 'تكلفة اليد العاملة (دج)' : 'Labor Cost (DZD)'} value={laborCost} onChange={setLaborCost} />
            <NumberField label={isRtl ? 'هامش الربح %' : 'Margin %'} value={marginPct} onChange={setMarginPct} />
          </div>

          {internalResult && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-5">
              <ResultRow label={isRtl ? 'استهلاك الدهان' : 'Paint Consumption'} value={`${internalResult.paintConsumptionM2} m²`} />
              <ResultRow label={isRtl ? 'تكلفة المواد' : 'Material Cost'} value={formatDzd(internalResult.materialCost, isRtl)} />
              <ResultRow label={isRtl ? 'تكلفة اليد العاملة' : 'Labor Cost'} value={formatDzd(internalResult.laborCost, isRtl)} />
              <ResultRow label={isRtl ? 'التكلفة الإجمالية' : 'Total Cost'} value={formatDzd(internalResult.totalCost, isRtl)} />
              <ResultRow label={isRtl ? 'الربح' : 'Profit'} value={formatDzd(internalResult.profit, isRtl)} />
              <ResultRow label={isRtl ? 'سعر البيع' : 'Selling Price'} value={formatDzd(internalResult.sellingPrice, isRtl)} emphasis />
            </div>
          )}

          {internalResult && (
            <SaveEstimationBar
              module="painting"
              inputs={{ paintKey, areaM2, coats, primer, sanding, clearCoat, laborCost, marginPct }}
              manufacturingCost={internalResult.totalCost}
              sellingPrice={internalResult.sellingPrice}
              profit={internalResult.profit}
            />
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label={isRtl ? 'نوع الدهان' : 'Paint Type'} value={paintKey} onChange={setPaintKey} isRtl={isRtl} options={paintOptions.map(p => ({ value: p.key, label: isRtl ? p.labelAr : p.label }))} />
            <NumberField label={isRtl ? 'مساحة السطح (م²)' : 'Surface Area (m²)'} value={areaM2} onChange={setAreaM2} />
            <NumberField label={isRtl ? 'عدد الطبقات' : 'Number of Coats'} value={coats} onChange={setCoats} min={1} step={1} />
            <ToggleField label={isRtl ? 'برايمر' : 'Primer'} value={primer} onChange={setPrimer} isRtl={isRtl} />
            <ToggleField label={isRtl ? 'صنفرة' : 'Sanding'} value={sanding} onChange={setSanding} isRtl={isRtl} />
            <ToggleField label={isRtl ? 'طبقة واقية' : 'Clear Coat'} value={clearCoat} onChange={setClearCoat} isRtl={isRtl} />
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
