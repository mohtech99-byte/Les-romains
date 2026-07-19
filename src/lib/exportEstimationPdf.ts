import { WorkshopEstimation } from '../types';

const MODULE_LABELS: Record<WorkshopEstimation['module'], string> = {
  sheet: 'Sheet Materials',
  letters: 'Acrylic Letters',
  alucobond: 'Alucobond',
  painting: 'Painting',
  laser: 'Laser Cutting',
  routing: 'CNC Routing',
  installation: 'Installation',
};

const fmt = (n: number) => Math.round(n).toLocaleString('en-US') + ' DZD';

/**
 * Opens a new window with a printable summary of the estimation and
 * triggers the browser's print dialog (which offers "Save as PDF" on every
 * major browser/OS). Avoids pulling in a PDF-generation library.
 */
export function exportEstimationToPdf(est: WorkshopEstimation) {
  const win = window.open('', '_blank', 'width=800,height=1000');
  if (!win) return;

  const rows = Object.entries(est.inputs || {})
    .filter(([, v]) => v !== '' && v !== undefined && v !== null)
    .map(([k, v]) => `<tr><td>${k}</td><td>${String(v)}</td></tr>`)
    .join('');

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Estimation ${est.id}</title>
      <style>
        body { font-family: Georgia, 'Times New Roman', serif; color: #0F0F0F; padding: 48px; }
        h1 { font-size: 22px; letter-spacing: 2px; margin-bottom: 4px; }
        .sub { color: #8F7040; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 32px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 13px; }
        .meta div { line-height: 1.8; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        td { padding: 6px 0; border-bottom: 1px solid #eee; font-size: 12px; text-transform: capitalize; }
        td:last-child { text-align: right; font-family: monospace; }
        .totals td { font-size: 13px; }
        .totals .grand { font-weight: bold; font-size: 16px; color: #8F7040; border-top: 2px solid #0F0F0F; padding-top: 10px; }
      </style>
    </head>
    <body>
      <h1>LES ROMAINS</h1>
      <div class="sub">Workshop Estimation — ${MODULE_LABELS[est.module]}</div>
      <div class="meta">
        <div>
          <strong>Client:</strong> ${est.client}<br/>
          <strong>Project:</strong> ${est.projectName}<br/>
          <strong>Notes:</strong> ${est.notes || '—'}
        </div>
        <div>
          <strong>Estimation ID:</strong> ${est.id}<br/>
          <strong>Date:</strong> ${new Date(est.date).toLocaleDateString()}<br/>
          <strong>Status:</strong> ${est.status}
        </div>
      </div>
      <table>${rows}</table>
      <table class="totals">
        <tr><td>Manufacturing Cost</td><td>${fmt(est.manufacturingCost)}</td></tr>
        <tr><td>Profit</td><td>${fmt(est.profit)}</td></tr>
        <tr class="grand"><td>Selling Price</td><td>${fmt(est.sellingPrice)}</td></tr>
      </table>
    </body>
    </html>
  `);
  win.document.close();
  win.onload = () => {
    win.focus();
    win.print();
  };
}
