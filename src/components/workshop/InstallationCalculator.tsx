import React, { useMemo, useState } from 'react';
import { useApp } from '../../store/AppContext.tsx';
import { calcInstallation, buildRateMap } from '../../lib/workshopCalculations.ts';
import { calculateWorkshopEstimate } from '../../lib/workshopEstimatorApi.ts';
import { CalculatorCard, NumberField, ToggleField, ResultRow, formatDzd, Field, PublicResultFooter, PrimaryButton } from './shared.tsx';
import { SaveEstimationBar } from './SaveEstimationBar.tsx';

export const InstallationCalculator: React.FC<{ variant?: 'internal' | 'public' }> = ({ variant = 'internal' }) => {
  const { workshopPricing, language, setCurrentView } = useApp();
  const isRtl = language === 'ar';
  const rates = useMemo(() => buildRateMap(workshopPricing), [workshopPricing]);

  const [workers, setWorkers] = useState(1);
  const [hours, setHours] = useState(0);
  const [travelDistanceKm, setTravelDistanceKm] = useState(0);
  const [installationType, setInstallationType] = useState('');
  const [scaffolding, setScaffolding] = useState(false);
  const [scaffoldingDays, setScaffoldingDays] = useState(1);
  const [marginPct, setMarginPct] = useState(25);

  const [publicResult, setPublicResult] = useState<{ estimatedPrice: number; currency: string; estimatedDeliveryDays?: { min: number; max: number } } | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState('');

  const internalResult = variant === 'internal' && workers > 0 && hours > 0
    ? calcInstallation({ workers, hours, travelDistanceKm, installationType, scaffolding, scaffoldingDays, marginPct }, rates)
    : null;

  const handlePublicCalculate = async () => {
    if (!installationType) {
      setCalcError(isRtl ? 'يرجى تعبئة كل الحقول' : 'Please fill in every field');
      return;
    }
    setCalcError('');
    setCalculating(true);
    try {
      const res = await calculateWorkshopEstimate('installation', { installationType, travelDistanceKm, scaffolding });
      setPublicResult(res);
    } catch {
      setCalcError(isRtl ? 'فشل الحساب، حاول لاحقاً' : 'Calculation failed, please try again');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <CalculatorCard
      title={isRtl ? 'حاسبة التركيب' : 'Installation Calculator'}
      subtitle={isRtl ? 'يد عاملة ونقل وسقالات في الموقع' : 'On-site labor, travel and scaffolding'}
    >
      {variant === 'internal' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberField label={isRtl ? 'عدد العمال' : 'Workers'} value={workers} onChange={setWorkers} min={1} step={1} />
            <NumberField label={isRtl ? 'عدد الساعات' : 'Hours'} value={hours} onChange={setHours} />
            <NumberField label={isRtl ? 'مسافة التنقل (كم، اتجاه واحد)' : 'Travel Distance (km, one-way)'} value={travelDistanceKm} onChange={setTravelDistanceKm} />
            <Field label={isRtl ? 'نوع التركيب' : 'Installation Type'}>
              <input type="text" value={installationType} onChange={e => setInstallationType(e.target.value)} placeholder={isRtl ? 'مثال: تركيب ألواح جدارية' : 'e.g. Wall panel mounting'} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent" />
            </Field>
            <ToggleField label={isRtl ? 'السقالات' : 'Scaffolding'} value={scaffolding} onChange={setScaffolding} isRtl={isRtl} />
            {scaffolding && <NumberField label={isRtl ? 'أيام السقالات' : 'Scaffolding Days'} value={scaffoldingDays} onChange={setScaffoldingDays} min={1} step={1} />}
            <NumberField label={isRtl ? 'هامش الربح %' : 'Margin %'} value={marginPct} onChange={setMarginPct} />
          </div>

          {internalResult && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-5">
              <ResultRow label={isRtl ? 'تكلفة اليد العاملة' : 'Labor Cost'} value={formatDzd(internalResult.laborCost, isRtl)} />
              <ResultRow label={isRtl ? 'تكلفة النقل' : 'Transportation Cost'} value={formatDzd(internalResult.transportationCost, isRtl)} />
              <ResultRow label={isRtl ? 'تكلفة التصنيع' : 'Manufacturing Cost'} value={formatDzd(internalResult.manufacturingCost, isRtl)} />
              <ResultRow label={isRtl ? 'الربح' : 'Profit'} value={formatDzd(internalResult.profit, isRtl)} />
              <ResultRow label={isRtl ? 'سعر البيع' : 'Selling Price'} value={formatDzd(internalResult.sellingPrice, isRtl)} emphasis />
            </div>
          )}

          {internalResult && (
            <SaveEstimationBar
              module="installation"
              inputs={{ workers, hours, travelDistanceKm, installationType, scaffolding, scaffoldingDays, marginPct }}
              manufacturingCost={internalResult.manufacturingCost}
              sellingPrice={internalResult.sellingPrice}
              profit={internalResult.profit}
            />
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={isRtl ? 'نوع التركيب' : 'Installation Type'}>
              <input type="text" value={installationType} onChange={e => setInstallationType(e.target.value)} placeholder={isRtl ? 'مثال: تركيب ألواح جدارية' : 'e.g. Wall panel mounting'} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent" />
            </Field>
            <NumberField label={isRtl ? 'مسافة التنقل (كم، اتجاه واحد)' : 'Travel Distance (km, one-way)'} value={travelDistanceKm} onChange={setTravelDistanceKm} />
            <ToggleField label={isRtl ? 'السقالات' : 'Scaffolding'} value={scaffolding} onChange={setScaffolding} isRtl={isRtl} />
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
