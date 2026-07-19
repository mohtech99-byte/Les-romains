import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { useApp } from '../../store/AppContext.tsx';
import { WorkshopEstimation, EstimationStatus } from '../../types';
import { formatDzd } from './shared.tsx';
import { exportEstimationToPdf } from '../../lib/exportEstimationPdf.ts';

const MODULE_LABELS: Record<WorkshopEstimation['module'], string> = {
  sheet: 'Sheet Materials',
  letters: 'Acrylic Letters',
  alucobond: 'Alucobond',
  painting: 'Painting',
  laser: 'Laser Cutting',
  routing: 'CNC Routing',
  installation: 'Installation',
};

const STATUS_OPTIONS: EstimationStatus[] = ['draft', 'sent', 'approved', 'completed'];

const statusColor: Record<EstimationStatus, string> = {
  draft: 'text-gray-400 border-gray-400',
  sent: 'text-blue-400 border-blue-400',
  approved: 'text-accent border-accent',
  completed: 'text-green-500 border-green-500',
};

export const SavedEstimations: React.FC = () => {
  const { estimations, updateEstimationStatus, deleteEstimation } = useApp();

  if (estimations.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0C0C0C]/50 rounded-none border border-gray-150 dark:border-gray-900 p-10 text-center">
        <p className="text-xs text-gray-400">No saved estimations yet. Calculate and save one from any module.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {estimations.map(est => (
        <div key={est.id} className="bg-white dark:bg-[#0C0C0C]/50 border border-gray-150 dark:border-gray-900 p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] uppercase font-mono tracking-widest text-accent font-bold">{MODULE_LABELS[est.module]}</span>
              <span className="text-[9px] text-gray-400 font-mono">{est.id}</span>
            </div>
            <p className="font-bold text-sm text-gray-900 dark:text-white mt-1 truncate">{est.projectName}</p>
            <p className="text-xs text-gray-500">{est.client} — {new Date(est.date).toLocaleDateString()}</p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="text-accent font-mono font-bold text-sm">{formatDzd(est.sellingPrice)}</span>

            <select
              value={est.status}
              onChange={e => updateEstimationStatus(est.id, e.target.value as EstimationStatus)}
              className={`text-[10px] font-mono uppercase tracking-wider bg-transparent border px-2 py-1.5 rounded-none ${statusColor[est.status]}`}
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <button onClick={() => exportEstimationToPdf(est)} title="Export PDF" className="p-2 text-gray-400 hover:text-accent transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => { if (confirm('Delete this estimation?')) deleteEstimation(est.id); }}
              title="Delete"
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
