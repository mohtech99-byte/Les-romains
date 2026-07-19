import React, { useMemo, useState } from 'react';
import { useApp } from '../../store/AppContext.tsx';
import { calcRouting, buildRateMap } from '../../lib/workshopCalculations.ts';
import { calculateWorkshopEstimate } from '../../lib/workshopEstimatorApi.ts';
import { CalculatorCard, NumberField, SelectField, ResultRow, formatDzd, PublicResultFooter, PrimaryButton } from './shared.tsx';
import { SaveEstimationBar } from './SaveEstimationBar.tsx';

const BIT_TYPES_EN = [
  { value: 'straight', label: 'Straight Bit' },
  { value: 'v-groove', label: 'V-Groove Bit' },
  { value: 'ball-nose', label: 'Ball Nose Bit' },
  { value: 'compression', label: 'Compression Bit' },
];
const BIT_TYPES_AR = [
  { value: 'straight', label: 'أداة مستقيمة' },
  { value: 'v-groove', label: 'أداة V' },
  { value: 'ball-nose', label: 'أداة كروية' },
  { value: 'compression', label: 'أداة ضغط' },
];

export const RoutingCalculator: React.FC<{ variant?: 'internal' | 'public' }> = ({ variant = 'internal' }) => {
  const { workshopPricing, workshopOptions, language, setCurrentView } = useApp();
  const isRtl = language === 'ar';
  const rates = useMemo(() => buildRateMap(workshopPricing), [workshopPricing]);
  const materials = workshopPricing.filter(p => p.group === 'material' && p.isActive);
  const materialOptions = workshopOptions.filter(o => o.group === 'material');

  const [materialKey, setMaterialKey] = useState('');
  const [machiningAreaM2, setMachiningAreaM2] = useState(0);
  const [machineHours, setMachineHours] = useState(0);
  const [bitType, setBitType] = useState('');
  const [toolChanges, setToolChanges] = useState(0);
  const [marginPct, setMarginPct] = useState(25);

  const [publicResult, setPublicResult] = useState<{ estimatedPrice: number; currency: string; estimatedDeliveryDays?: { min: number; max: number } } | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState('');

  const internalResult = variant === 'internal' && materialKey
    ? calcRouting({ materialKey, machiningAreaM2, machineHours, toolChanges, marginPct }, rates)
    : null;

  const handlePublicCalculate = async () => {
    if (!materialKey || !machiningAreaM2) {
      setCalcError(isRtl ? 'يرجى تعبئة كل الحقول' : 'Please fill in every field');
      return;
    }
    setCalcError('');
    setCalculating(true);
    try {
      const res = await calculateWorkshopEstimate('routing', { materialKey, machiningAreaM2 });
      setPublicResult(res);
    } catch {
      setCalcError(isRtl ? 'فشل الحساب، حاول لاحقاً' : 'Calculation failed, please try again');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <CalculatorCard
      title={isRtl ? 'حاسبة تفريز CNC' : 'CNC Routing Calculator'}
      subtitle={isRtl ? 'أعمال تفريز متعددة المحاور — المساحة، وقت الآلة، والأدوات' : 'Multi-axis routing jobs — area, machine time and tooling'}
    >
      {variant === 'internal' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectField label={isRtl ? 'المادة / السماكة' : 'Material / Thickness'} value={materialKey} onChange={setMaterialKey} isRtl={isRtl} options={materials.map(m => ({ value: m.key, label: isRtl ? m.labelAr : m.label }))} />
            <NumberField label={isRtl ? 'مساحة التشغيل (م²)' : 'Machining Area (m²)'} value={machiningAreaM2} onChange={setMachiningAreaM2} />
            <NumberField label={isRtl ? 'وقت تشغيل الآلة (ساعات)' : 'Machine Time (hours)'} value={machineHours} onChange={setMachineHours} />
            <SelectField label={isRtl ? 'نوع الأداة' : 'Bit Type'} value={bitType} onChange={setBitType} isRtl={isRtl} options={isRtl ? BIT_TYPES_AR : BIT_TYPES_EN} />
            <NumberField label={isRtl ? 'تغييرات الأداة' : 'Tool Changes'} value={toolChanges} onChange={setToolChanges} min={0} step={1} />
            <NumberField label={isRtl ? 'هامش الربح %' : 'Margin %'} value={marginPct} onChange={setMarginPct} />
          </div>

          {internalResult && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-5">
              <ResultRow label={isRtl ? 'تكلفة التفريز' : 'Routing Cost'} value={formatDzd(internalResult.routingCost, isRtl)} />
              <ResultRow label={isRtl ? 'تكلفة المواد' : 'Material Cost'} value={formatDzd(internalResult.materialCost, isRtl)} />
              <ResultRow label={isRtl ? 'تكلفة التصنيع' : 'Manufacturing Cost'} value={formatDzd(internalResult.manufacturingCost, isRtl)} />
              <ResultRow label={isRtl ? 'الربح' : 'Profit'} value={formatDzd(internalResult.profit, isRtl)} />
              <ResultRow label={isRtl ? 'سعر البيع' : 'Selling Price'} value={formatDzd(internalResult.sellingPrice, isRtl)} emphasis />
            </div>
          )}

          {internalResult && (
            <SaveEstimationBar
              module="routing"
              inputs={{ materialKey, machiningAreaM2, machineHours, bitType, toolChanges, marginPct }}
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
            <NumberField label={isRtl ? 'مساحة التشغيل (م²)' : 'Machining Area (m²)'} value={machiningAreaM2} onChange={setMachiningAreaM2} />
            <SelectField label={isRtl ? 'نوع الأداة (اختياري)' : 'Bit Type (optional)'} value={bitType} onChange={setBitType} isRtl={isRtl} options={isRtl ? BIT_TYPES_AR : BIT_TYPES_EN} />
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
