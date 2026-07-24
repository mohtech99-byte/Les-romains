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
async function buildQuotePdfDoc(quote: QuoteRequest, settings: AppSettings): Promise<jsPDF> {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const logo = await loadLogo();
  // ===== Layout =====
  const HEADER_HEIGHT = 100;
  const TITLE_Y = 132;
  const META_Y = 155;
  const INFO_BOX_Y = 195;
  const INFO_BOX_HEIGHT = 70;
  const TABLE_Y = 290;

  // --- Header: logo + company info -----------------------------------------
  doc.addImage(logo, 'PNG', margin, 22, 58, 58);

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
  doc.line(margin, HEADER_HEIGHT, pageWidth - margin, HEADER_HEIGHT);

  // --- Title + meta ----------------------------------------------------------
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL QUOTATION', pageWidth / 2, TITLE_Y, {
    align: 'center'
});
  doc.setTextColor(15);
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
  doc.setDrawColor(220);
 // ===== Client Card =====
const cardY = 200;
const cardWidth = 230;
const cardHeight = 70; 

  // --- QR code -> live tracking page -----------------------------------------
  const trackUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/?track=${quote.id}`;
  const qrDataUrl = await QRCode.toDataURL(trackUrl, { margin: 1, width: 200, color: { dark: '#0F0F0F', light: '#FFFFFF' } });
  const qrSize = 78;
  doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - qrSize, 185, qrSize, qrSize);
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
    startY: 290,
    margin: { left: margin, right: margin },
    head: [['Description', 'Qty', 'Unit Price', 'Total']],
    body: rows,
    foot: [['', '', 'Grand Total', `${total.toLocaleString('en-US')} DZD`]],
    theme: 'grid',
    headStyles: { fillColor: [15, 15, 15], textColor: 255, fontSize: 9 },
    footStyles: { fillColor: [176, 141, 87], textColor: 20, fontSize: 10, fontStyle: 'bold' },
    styles: {
    fontSize: 10,
    cellPadding: 8,
    textColor: 40,
    },

    alternateRowStyles: {
  fillColor: [248, 248, 248],
    },
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

  return doc;
}

/**
 * Generates a professional quotation PDF and triggers a browser download.
 * Unchanged behavior from before this refactor — every existing call site
 * works identically.
 */
export async function generateQuotePdf(quote: QuoteRequest, settings: AppSettings) {
  const doc = await buildQuotePdfDoc(quote, settings);
  doc.save(`${quote.id}-quotation.pdf`);
}

/**
 * Same PDF, returned as a base64 string instead of triggering a download —
 * used to attach the quotation to an email via the server's /api/email/send-pdf.
 */
export async function getQuotePdfBase64(quote: QuoteRequest, settings: AppSettings): Promise<string> {
  const doc = await buildQuotePdfDoc(quote, settings);
  return doc.output('datauristring').split(',')[1];
}
