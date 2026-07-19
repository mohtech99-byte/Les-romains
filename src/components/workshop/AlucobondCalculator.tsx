import React, { useMemo, useState } from 'react';
import { useApp } from '../../store/AppContext.tsx';
import { calcAlucobond, buildRateMap } from '../../lib/workshopCalculations.ts';
import { calculateWorkshopEstimate } from '../../lib/workshopEstimatorApi.ts';
import { CalculatorCard, NumberField, SelectField, ToggleField, ResultRow, formatDzd, Field, PublicResultFooter, PrimaryButton } from './shared.tsx';
import { SaveEstimationBar } from './SaveEstimationBar.tsx';

export const AlucobondCalculator: React.FC<{ variant?: 'internal' | 'public' }> = ({ variant = 'internal' }) => {
  const { workshopPricing, workshopOptions, language, setCurrentView } = useApp();
  const isRtl = language === 'ar';
  const rates = useMemo(() => buildRateMap(workshopPricing), [workshopPricing]);
  const panels = workshopPricing.filter(p => p.group === 'material' && p.key.startsWith('ALUCOBOND') && p.isActive);
  const panelOptions = workshopOptions.filter(o => o.group === 'material' && o.key.startsWith('ALUCOBOND'));

  const [panelColor, setPanelColor] = useState('');
  const [materialKey, setMaterialKey] = useState('');
  const [lengthCm, setLengthCm] = useState(0);
  const [widthCm, setWidthCm] = useState(0);
  const [panelsQuantity, setPanelsQuantity] = useState(1);
  const [cutting, setCutting] = useState(false);
  const [routing, setRouting] = useState(false);
  const [folding, setFolding] = useState(false);
  const [installation, setInstallation] = useState(false);
  const [installHours, setInstallHours] = useState(0);
  const [marginPct, setMarginPct] = useState(25);

  const [publicResult, setPublicResult] = useState<{ estimatedPrice: number; currency: string; estimatedDeliveryDays?: { min: number; max: number } } | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState('');

  const internalResult = variant === 'internal' && materialKey
    ? calcAlucobond({ materialKey, lengthCm, widthCm, panelsQuantity, cutting, routing, folding, installation, installHours, marginPct }, rates)
    : null;

  const handlePublicCalculate = async () => {
    if (!materialKey || !lengthCm || !widthCm) {
      setCalcError(isRtl ? 'يرجى تعبئة كل الحقول' : 'Please fill in every field');
      return;
    }
    setCalcError('');
    setCalculating(true);
    try {
      const res = await calculateWorkshopEstimate('alucobond', { materialKey, lengthCm, widthCm, panelsQuantity, cutting, routing, folding, installation });
      setPublicResult(res);
    } catch {
      setCalcError(isRtl ? 'فشل الحساب، حاول لاحقاً' : 'Calculation failed, please try again');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <CalculatorCard
      title={isRtl ? 'حاسبة الألوكوبوند' : 'Alucobond Calculator'}
      subtitle={isRtl ? 'ألواح ACP المركبة — قص، تفريز، طي، تركيب' : 'ACP composite panel jobs — cutting, routing, folding, install'}
    >
      {variant === 'internal' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label={isRtl ? 'لون اللوح' : 'Panel Color'}>
              <input type="text" value={panelColor} onChange={e => setPanelColor(e.target.value)} placeholder={isRtl ? 'مثال: فضي' : 'e.g. Silver'} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-none px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent" />
            </Field>
            <SelectField label={isRtl ? 'السماكة' : 'Thickness'} value={materialKey} onChange={setMaterialKey} isRtl={isRtl} options={panels.map(m => ({ value: m.key, label: isRtl ? m.labelAr : m.label }))} />
            <NumberField label={isRtl ? 'الطول (سم)' : 'Length (cm)'} value={lengthCm} onChange={setLengthCm} />
            <NumberField label={isRtl ? 'العرض (سم)' : 'Width (cm)'} value={widthCm} onChange={setWidthCm} />
            <NumberField label={isRtl ? 'عدد الألواح' : 'Panels Quantity'} value={panelsQuantity} onChange={setPanelsQuantity} min={1} step={1} />
            <ToggleField label={isRtl ? 'القص' : 'Cutting'} value={cutting} onChange={setCutting} isRtl={isRtl} />
            <ToggleField label={isRtl ? 'التفريز' : 'Routing'} value={routing} onChange={setRouting} isRtl={isRtl} />
            <ToggleField label={isRtl ? 'الطي' : 'Folding'} value={folding} onChange={setFolding} isRtl={isRtl} />
            <ToggleField label={isRtl ? 'التركيب' : 'Installation'} value={installation} onChange={setInstallation} isRtl={isRtl} />
            {installation && <NumberField label={isRtl ? 'ساعات التركيب' : 'Install Hours'} value={installHours} onChange={setInstallHours} />}
            <NumberField label={isRtl ? 'هامش الربح %' : 'Margin %'} value={marginPct} onChange={setMarginPct} />
          </div>

          {internalResult && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-5">
              <ResultRow label={isRtl ? 'المساحة' : 'Area'} value={`${internalResult.areaM2} m²`} />
              <ResultRow label={isRtl ? 'تكلفة المواد' : 'Material Cost'} value={formatDzd(internalResult.materialCost, isRtl)} />
              <ResultRow label={isRtl ? 'تكلفة التصنيع' : 'Manufacturing Cost'} value={formatDzd(internalResult.manufacturingCost, isRtl)} />
              <ResultRow label={isRtl ? 'الربح' : 'Profit'} value={formatDzd(internalResult.profit, isRtl)} />
              <ResultRow label={isRtl ? 'سعر البيع' : 'Selling Price'} value={formatDzd(internalResult.sellingPrice, isRtl)} emphasis />
            </div>
          )}

          {internalResult && (
            <SaveEstimationBar
              module="alucobond"
              inputs={{ panelColor, materialKey, lengthCm, widthCm, panelsQuantity, cutting, routing, folding, installation, installHours, marginPct }}
              manufacturingCost={internalResult.manufacturingCost}
              sellingPrice={internalResult.sellingPrice}
              profit={internalResult.profit}
            />
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label={isRtl ? 'السماكة' : 'Thickness'} value={materialKey} onChange={setMaterialKey} isRtl={isRtl} options={panelOptions.map(m => ({ value: m.key, label: isRtl ? m.labelAr : m.label }))} />
            <NumberField label={isRtl ? 'الطول (سم)' : 'Length (cm)'} value={lengthCm} onChange={setLengthCm} />
            <NumberField label={isRtl ? 'العرض (سم)' : 'Width (cm)'} value={widthCm} onChange={setWidthCm} />
            <NumberField label={isRtl ? 'عدد الألواح' : 'Panels Quantity'} value={panelsQuantity} onChange={setPanelsQuantity} min={1} step={1} />
            <ToggleField label={isRtl ? 'القص' : 'Cutting'} value={cutting} onChange={setCutting} isRtl={isRtl} />
            <ToggleField label={isRtl ? 'التفريز' : 'Routing'} value={routing} onChange={setRouting} isRtl={isRtl} />
            <ToggleField label={isRtl ? 'الطي' : 'Folding'} value={folding} onChange={setFolding} isRtl={isRtl} />
            <ToggleField label={isRtl ? 'التركيب' : 'Installation'} value={installation} onChange={setInstallation} isRtl={isRtl} />
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
