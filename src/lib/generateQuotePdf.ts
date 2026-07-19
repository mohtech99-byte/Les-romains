import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import { QuoteRequest, AppSettings } from '../types';
async function loadLogo(): Promise<string> {
  const response = await fetch('/icon-512.png');
  const blob = await response.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

/**
 * Generates a professional quotation PDF and triggers a browser download.
 *
 * Note: rendered in English regardless of site language. jsPDF's core fonts
 * do not support Arabic glyph shaping/bidi text, so an Arabic version would
 * render broken/disconnected letters — safer to keep this document in
 * English/Latin script, which is also standard practice for formal business
 * quotations in Algeria (often bilingual FR/EN or EN alongside Arabic).
 */
export async function generateQuotePdf(quote: QuoteRequest, settings: AppSettings) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const logo = await loadLogo();

  // --- Header: logo + company info -----------------------------------------
  doc.addImage(logo, 'PNG', margin, 32, 154, 44);

  doc.setFontSize(9);
  doc.setTextColor(90);
  const companyLines = [
    'Decorative CNC Manufacturing Studio',
    settings.address || 'Batna, Algeria',
    settings.contactPhone || '',
    settings.contactEmail || '',
  ].filter(Boolean);
  companyLines.forEach((line, i) => {
    doc.text(line, pageWidth - margin, 40 + i * 12, { align: 'right' });
  });

  doc.setDrawColor(176, 141, 87);
  doc.setLineWidth(1);
  doc.line(margin, 92, pageWidth - margin, 92);

  // --- Title + meta ----------------------------------------------------------
  doc.setFontSize(20);
  doc.setTextColor(15);
  doc.text('OFFICIAL QUOTATION', margin, 122);

  const issueDate = new Date();
  const validityDays = settings.quoteValidityDays || 15;
  const expiryDate = new Date(issueDate.getTime() + validityDays * 86400000);

  doc.setFontSize(9.5);
  doc.setTextColor(60);
  doc.text(`Quotation No: ${quote.id}`, margin, 145);
  doc.text(`Issue Date: ${issueDate.toLocaleDateString('en-GB')}`, margin, 160);
  doc.text(`Valid Until: ${expiryDate.toLocaleDateString('en-GB')}  (${validityDays} days)`, margin, 175);

  doc.text(`Client: ${quote.name}`, pageWidth - margin, 145, { align: 'right' });
  doc.text(`Project: ${quote.projectType}`, pageWidth - margin, 160, { align: 'right' });
  if (quote.dimensions) doc.text(`Scope: ${quote.dimensions}`, pageWidth - margin, 175, { align: 'right' });

  // --- QR code -> live tracking page -----------------------------------------
  const trackUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/?track=${quote.id}`;
  const qrDataUrl = await QRCode.toDataURL(trackUrl, { margin: 1, width: 200, color: { dark: '#0F0F0F', light: '#FFFFFF' } });
  const qrSize = 78;
  doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - qrSize, 195, qrSize, qrSize);
  doc.setFontSize(7);
  doc.setTextColor(130);
  doc.text('Scan to track your order', pageWidth - margin - qrSize / 2, 195 + qrSize + 10, { align: 'center' });

  // --- Pricing table -----------------------------------------------------
  const items = quote.quoteItems && quote.quoteItems.length > 0
    ? quote.quoteItems
    : [{ description: quote.projectType, quantity: 1, unitPrice: 0 }];
  const rows = items.map(it => [
    it.description,
    String(it.quantity),
    `${it.unitPrice.toLocaleString('en-US')} DZD`,
    `${(it.quantity * it.unitPrice).toLocaleString('en-US')} DZD`,
  ]);
  const total = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);

  autoTable(doc, {
    startY: 300,
    margin: { left: margin, right: margin },
    head: [['Description', 'Qty', 'Unit Price', 'Total']],
    body: rows,
    foot: [['', '', 'Grand Total', `${total.toLocaleString('en-US')} DZD`]],
    theme: 'grid',
    headStyles: { fillColor: [15, 15, 15], textColor: 255, fontSize: 9 },
    footStyles: { fillColor: [176, 141, 87], textColor: 20, fontSize: 10, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 7, textColor: 40 },
    columnStyles: { 1: { halign: 'center' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
  });

  // --- Terms & conditions -----------------------------------------------------
  const afterTableY = (doc as any).lastAutoTable.finalY + 34;
  doc.setFontSize(10.5);
  doc.setTextColor(15);
  doc.text('Terms & Conditions', margin, afterTableY);

  doc.setFontSize(8);
  doc.setTextColor(100);
  const terms = settings.termsAndConditions || '';
  const termsLines = doc.splitTextToSize(terms, pageWidth - margin * 2);
  doc.text(termsLines, margin, afterTableY + 16);

  // --- Footer -----------------------------------------------------
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(220);
  doc.setLineWidth(0.5);
  doc.line(margin, pageHeight - 50, pageWidth - margin, pageHeight - 50);
  doc.setFontSize(7.5);
  doc.setTextColor(150);
  doc.text('LES ROMAINS — This is a computer-generated quotation and does not require a signature.', pageWidth / 2, pageHeight - 34, { align: 'center' });

  doc.save(`${quote.id}-quotation.pdf`);
}
