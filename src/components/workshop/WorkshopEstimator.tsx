import React, { useState } from 'react';
import { SheetCalculator } from './SheetCalculator.tsx';
import { LettersCalculator } from './LettersCalculator.tsx';
import { AlucobondCalculator } from './AlucobondCalculator.tsx';
import { PaintingCalculator } from './PaintingCalculator.tsx';
import { LaserCalculator } from './LaserCalculator.tsx';
import { RoutingCalculator } from './RoutingCalculator.tsx';
import { InstallationCalculator } from './InstallationCalculator.tsx';
import { SavedEstimations } from './SavedEstimations.tsx';

type WorkshopTab = 'sheet' | 'letters' | 'alucobond' | 'painting' | 'laser' | 'routing' | 'installation' | 'saved';

const TABS: { id: WorkshopTab; label: string }[] = [
  { id: 'sheet', label: 'Sheet Materials' },
  { id: 'letters', label: 'Acrylic Letters' },
  { id: 'alucobond', label: 'Alucobond' },
  { id: 'painting', label: 'Painting' },
  { id: 'laser', label: 'Laser Cutting' },
  { id: 'routing', label: 'CNC Routing' },
  { id: 'installation', label: 'Installation' },
  { id: 'saved', label: 'Saved Estimations' },
];

export const WorkshopEstimator: React.FC = () => {
  const [tab, setTab] = useState<WorkshopTab>('sheet');

  return (
    <div className="space-y-8 text-left">
      <div>
        <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold block mb-1">
          INTERNAL TOOL — WORKSHOP STAFF ONLY
        </span>
        <h2 className="font-serif text-2xl text-gray-950 dark:text-white font-medium">Workshop Estimator</h2>
        <p className="text-xs text-gray-500 mt-1">Manufacturing cost and selling price calculators. All rates are managed in "Workshop Pricing".</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-150 dark:border-gray-900 pb-4">
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
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'sheet' && <SheetCalculator />}
      {tab === 'letters' && <LettersCalculator />}
      {tab === 'alucobond' && <AlucobondCalculator />}
      {tab === 'painting' && <PaintingCalculator />}
      {tab === 'laser' && <LaserCalculator />}
      {tab === 'routing' && <RoutingCalculator />}
      {tab === 'installation' && <InstallationCalculator />}
      {tab === 'saved' && <SavedEstimations />}
    </div>
  );
};
