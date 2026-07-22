import { CustomerQuotation, QuoteRequest } from '../../types';

/**
 * Customer Quotation Management reuses the existing generateQuotePdf()
 * function completely unchanged (per project rules). This adapter maps a
 * CustomerQuotation into the QuoteRequest-shaped object that function reads.
 *
 * Known limitation (documented, not silently hidden): generateQuotePdf()
 * always computes "Issue Date" as today and "Valid Until" as
 * settings.quoteValidityDays from today — it has no parameter for a custom
 * per-quotation issue/validity date. Since a manual quotation's PDF is
 * normally generated the same day it's created, "today" is usually correct
 * in practice, but a manually backdated issueDate or a custom validUntil
 * chosen in the form will NOT be reflected on the generated PDF. Fixing
 * this would require modifying generateQuotePdf.ts, which is explicitly
 * out of scope for this feature.
 *
 * The discount, however, IS reflected correctly: it's appended as a
 * negative line item, which the existing table-summing logic in
 * generateQuotePdf() already handles with no changes needed.
 */
export function mapCustomerQuotationForPdf(quotation: CustomerQuotation): QuoteRequest {
  const items = quotation.items.map(item => ({
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));

  if (quotation.discount && quotation.discount > 0) {
    items.push({
      description: 'Discount',
      quantity: 1,
      unitPrice: -Math.abs(quotation.discount),
    });
  }

  const noteSummary = quotation.notes && quotation.notes.trim()
    ? quotation.notes.trim().split('\n')[0].slice(0, 90)
    : 'Custom Quotation';

  return {
    id: quotation.quotationNumber,
    name: quotation.customerName,
    phone: quotation.customerPhone,
    email: quotation.customerEmail || '',
    city: quotation.customerAddress || '',
    projectType: noteSummary,
    description: quotation.notes || '',
    dimensions: quotation.customerAddress || undefined,
    preferredContact: 'phone',
    referenceImages: [],
    status: 'created',
    date: quotation.issueDate,
    quoteItems: items,
  };
}
