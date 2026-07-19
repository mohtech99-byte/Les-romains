import React, { useMemo, useState } from 'react';
import { useApp } from '../../store/AppContext.tsx';
import { calcSheet, buildRateMap } from '../../lib/workshopCalculations.ts';
import { calculateWorkshopEstimate } from '../../lib/workshopEstimatorApi.ts';
import { CalculatorCard, NumberField, SelectField, ToggleField, ResultRow, formatDzd, PublicResultFooter, PrimaryButton } from './shared.tsx';
import { SaveEstimationBar } from './SaveEstimationBar.tsx';

export const SheetCalculator: React.FC<{ variant?: 'internal' | 'public' }> = ({ variant = 'internal' }) => {
  const { workshopPricing, workshopOptions, language, setCurrentView } = useApp();
  const isRtl = language === 'ar';
  const rates = useMemo(() => buildRateMap(workshopPricing), [workshopPricing]);
  const materials = workshopPricing.filter(p => p.group === 'material' && p.isActive);
  const materialOptions = workshopOptions.filter(o => o.group === 'material');

  const [materialKey, setMaterialKey] = useState('');
  const [lengthCm, setLengthCm] = useState(0);
  const [widthCm, setWidthCm] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wastePct, setWastePct] = useState(8);
  const [cuttingCost, setCuttingCost] = useState(0);
  const [edgeBand, setEdgeBand] = useState(false);
  const [edgeMeterPrice, setEdgeMeterPrice] = useState(0);
  const [marginPct, setMarginPct] = useState(25);
  const [notesField, setNotesField] = useState('');

  // Public-mode result comes from the server; internal-mode is computed
  // client-side (admin already has authenticated access to the rates).
  const [publicResult, setPublicResult] = useState<{ estimatedPrice: number; currency: string; estimatedDeliveryDays?: { min: number; max: number } } | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState('');

  const internalResult = variant === 'internal' && materialKey
    ? calcSheet({ materialKey, lengthCm, widthCm, quantity, wastePct, cuttingCost, edgeBand, edgeMeterPrice: edgeMeterPrice || undefined, marginPct }, rates)
    : null;

  const handlePublicCalculate = async () => {
    if (!materialKey || !lengthCm || !widthCm) {
      setCalcError(isRtl ? 'يرجى تعبئة كل الحقول' : 'Please fill in every field');
      return;
    }
    setCalcError('');
    setCalculating(true);
    try {
      const res = await calculateWorkshopEstimate('sheet', { materialKey, lengthCm, widthCm, quantity, edgeBand });
      setPublicResult(res);
    } catch {
      setCalcError(isRtl ? 'فشل الحساب، حاول لاحقاً' : 'Calculation failed, please try again');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <CalculatorCard
      title={isRtl ? 'حاسبة الألواح المسطحة' : 'Sheet Materials Calculator'}
      subtitle={isRtl ? 'فوركس، PMMA، PVC، MDF وألوكوبوند' : 'Forex, PMMA, PVC, MDF and Alucobond flat-sheet jobs'}
    >
      {variant === 'internal' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectField
              label={isRtl ? 'المادة' : 'Material'}
              value={materialKey}
              onChange={setMaterialKey}
              isRtl={isRtl}
              options={materials.map(m => ({ value: m.key, label: `${isRtl ? m.labelAr : m.label} (${m.value.toLocaleString()} ${m.unit})` }))}
            />
            <NumberField label={isRtl ? 'الطول (سم)' : 'Length (cm)'} value={lengthCm} onChange={setLengthCm} />
            <NumberField label={isRtl ? 'العرض (سم)' : 'Width (cm)'} value={widthCm} onChange={setWidthCm} />
            <NumberField label={isRtl ? 'الكمية' : 'Quantity'} value={quantity} onChange={setQuantity} min={1} step={1} />
            <NumberField label={isRtl ? 'نسبة الهدر %' : 'Waste %'} value={wastePct} onChange={setWastePct} />
            <NumberField label={isRtl ? 'تكلفة القص (دج)' : 'Cutting Cost (DZD)'} value={cuttingCost} onChange={setCuttingCost} />
            <ToggleField label={isRtl ? 'شريط الحواف (شونط)' : 'Edge Band (Chant)'} value={edgeBand} onChange={setEdgeBand} isRtl={isRtl} />
            {edgeBand && (
              <NumberField label={isRtl ? 'سعر الحافة / المتر (دج)' : 'Edge Price / Meter (DZD)'} value={edgeMeterPrice} onChange={setEdgeMeterPrice} placeholder={String(rates['EDGE_BAND'] || 0)} />
            )}
            <NumberField label={isRtl ? 'هامش الربح %' : 'Margin %'} value={marginPct} onChange={setMarginPct} />
          </div>

          <div className="mt-4">
            <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1.5 tracking-wider">{isRtl ? 'ملاحظات اختيارية' : 'Optional Notes'}</label>
            <textarea
              value={notesField}
              onChange={e => setNotesField(e.target.value)}
              rows={2}
              className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent"
            />
          </div>

          {internalResult && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-5">
              <ResultRow label={isRtl ? 'المساحة' : 'Area'} value={`${internalResult.areaM2} m²`} />
              <ResultRow label={isRtl ? 'تكلفة المواد' : 'Material Cost'} value={formatDzd(internalResult.materialCost, isRtl)} />
              <ResultRow label={isRtl ? 'تكلفة الحواف' : 'Edge Cost'} value={formatDzd(internalResult.edgeCost, isRtl)} />
              <ResultRow label={isRtl ? 'تكلفة القص' : 'Cutting Cost'} value={formatDzd(internalResult.cuttingCost, isRtl)} />
              <ResultRow label={isRtl ? 'تكلفة التصنيع' : 'Manufacturing Cost'} value={formatDzd(internalResult.manufacturingCost, isRtl)} />
              <ResultRow label={isRtl ? 'الربح' : 'Profit'} value={formatDzd(internalResult.profit, isRtl)} />
              <ResultRow label={isRtl ? 'سعر البيع' : 'Selling Price'} value={formatDzd(internalResult.sellingPrice, isRtl)} emphasis />
            </div>
          )}

          {internalResult && (
            <SaveEstimationBar
              module="sheet"
              inputs={{ materialKey, lengthCm, widthCm, quantity, wastePct, cuttingCost, edgeBand, edgeMeterPrice, marginPct, notes: notesField }}
              manufacturingCost={internalResult.manufacturingCost}
              sellingPrice={internalResult.sellingPrice}
              profit={internalResult.profit}
            />
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label={isRtl ? 'المادة' : 'Material'}
              value={materialKey}
              onChange={setMaterialKey}
              isRtl={isRtl}
              options={materialOptions.map(m => ({ value: m.key, label: isRtl ? m.labelAr : m.label }))}
            />
            <NumberField label={isRtl ? 'الطول (سم)' : 'Length (cm)'} value={lengthCm} onChange={setLengthCm} />
            <NumberField label={isRtl ? 'العرض (سم)' : 'Width (cm)'} value={widthCm} onChange={setWidthCm} />
            <NumberField label={isRtl ? 'الكمية' : 'Quantity'} value={quantity} onChange={setQuantity} min={1} step={1} />
            <ToggleField label={isRtl ? 'شريط الحواف (شونط)' : 'Edge Band (Chant)'} value={edgeBand} onChange={setEdgeBand} isRtl={isRtl} />
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
