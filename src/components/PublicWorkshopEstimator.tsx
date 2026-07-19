import React, { useState } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { SheetCalculator } from './workshop/SheetCalculator.tsx';
import { LettersCalculator } from './workshop/LettersCalculator.tsx';
import { AlucobondCalculator } from './workshop/AlucobondCalculator.tsx';
import { PaintingCalculator } from './workshop/PaintingCalculator.tsx';
import { LaserCalculator } from './workshop/LaserCalculator.tsx';
import { RoutingCalculator } from './workshop/RoutingCalculator.tsx';
import { InstallationCalculator } from './workshop/InstallationCalculator.tsx';

type PublicWorkshopTab = 'sheet' | 'letters' | 'alucobond' | 'painting' | 'laser' | 'routing' | 'installation';

const TABS: { id: PublicWorkshopTab; label: string; labelAr: string }[] = [
  { id: 'sheet', label: 'Sheet Materials', labelAr: 'ألواح مسطحة' },
  { id: 'letters', label: 'Acrylic Letters', labelAr: 'حروف أكريليك' },
  { id: 'alucobond', label: 'Alucobond', labelAr: 'ألوكوبوند' },
  { id: 'painting', label: 'Painting', labelAr: 'دهان' },
  { id: 'laser', label: 'Laser Cutting', labelAr: 'قص ليزر' },
  { id: 'routing', label: 'CNC Routing', labelAr: 'تفريز CNC' },
  { id: 'installation', label: 'Installation', labelAr: 'تركيب' },
];

export const PublicWorkshopEstimator: React.FC = () => {
  const { language } = useApp();
  const isRtl = language === 'ar';
  const [tab, setTab] = useState<PublicWorkshopTab>('sheet');

  return (
    <div className="py-16 space-y-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold block">
          {isRtl ? 'ورشة التقدير' : 'WORKSHOP ESTIMATOR'}
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-gray-950 dark:text-white font-medium">
          {isRtl ? 'احسب سعر خدمتك مباشرة' : 'Price Your Service, By Module'}
        </h2>
        <div className="cut-line w-16 mx-auto" />
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          {isRtl
            ? 'اختر نوع الخدمة (ألواح، دهان، حروف أكريليك، ألوكوبوند، قص ليزر، تفريز CNC، تركيب) وأدخل تفاصيل مشروعك للحصول على سعر تقديري فوري لكل خدمة على حدة.'
            : 'Choose a service type (sheet materials, painting, acrylic letters, alucobond, laser cutting, CNC routing, installation) and enter your project details for an instant estimate — each service calculated on its own.'}
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2 border-b border-gray-150 dark:border-gray-900 pb-6 mb-2">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-[10px] uppercase font-mono tracking-widest font-bold rounded-none border transition-all ${
                tab === t.id
                  ? 'bg-accent text-black border-accent'
                  : 'text-gray-400 border-gray-200 dark:border-gray-800 hover:text-accent'
              }`}
            >
              {isRtl ? t.labelAr : t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {tab === 'sheet' && <SheetCalculator variant="public" />}
        {tab === 'letters' && <LettersCalculator variant="public" />}
        {tab === 'alucobond' && <AlucobondCalculator variant="public" />}
        {tab === 'painting' && <PaintingCalculator variant="public" />}
        {tab === 'laser' && <LaserCalculator variant="public" />}
        {tab === 'routing' && <RoutingCalculator variant="public" />}
        {tab === 'installation' && <InstallationCalculator variant="public" />}
      </div>
    </div>
  );
};
