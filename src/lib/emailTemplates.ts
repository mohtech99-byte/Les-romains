/**
 * HTML email templates. All styles are inline (email clients strip <style>
 * tags and external stylesheets unpredictably), matching the site's black +
 * brass (#B08D57) design system.
 */

const BRAND = {
  bg: '#0F0F0F',
  panel: '#1A1A1A',
  accent: '#B08D57',
  text: '#F5F3EF',
  muted: '#9C9791',
};

function wrapEmail(bodyHtml: string, appUrl: string, unsubscribeUrl?: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px; background-color:${BRAND.bg};" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:32px 32px 20px; text-align:center; border-bottom:1px solid ${BRAND.panel};">
              <span style="color:${BRAND.text}; font-size:20px; letter-spacing:3px; font-weight:bold;">LES ROMAINS</span>
              <div style="color:${BRAND.accent}; font-size:10px; letter-spacing:2px; text-transform:uppercase; margin-top:6px;">Decorative CNC Manufacturing</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px; color:${BRAND.text}; font-size:14px; line-height:1.7;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 32px; border-top:1px solid ${BRAND.panel}; text-align:center;">
              <a href="${appUrl}" style="color:${BRAND.accent}; font-size:11px; text-decoration:none;">${appUrl.replace(/^https?:\/\//, '')}</a>
              ${unsubscribeUrl ? `<div style="margin-top:10px;"><a href="${unsubscribeUrl}" style="color:${BRAND.muted}; font-size:10px; text-decoration:underline;">Unsubscribe from these emails</a></div>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(text: string, url: string): string {
  return `<div style="text-align:center; margin:28px 0;">
    <a href="${url}" style="display:inline-block; background-color:${BRAND.accent}; color:#0F0F0F; padding:12px 28px; text-decoration:none; font-size:12px; letter-spacing:1.5px; text-transform:uppercase; font-weight:bold; font-family:Arial,sans-serif;">${text}</a>
  </div>`;
}

export function buildNewsletterEmail(opts: {
  title: string;
  excerpt: string;
  postUrl: string;
  appUrl: string;
  unsubscribeUrl: string;
}): string {
  const body = `
    <p style="color:${BRAND.accent}; font-size:10px; letter-spacing:2px; text-transform:uppercase; margin:0 0 16px;">NEW FROM LES ROMAINS</p>
    <h1 style="font-size:22px; margin:0 0 16px; color:${BRAND.text};">${opts.title}</h1>
    <p style="color:${BRAND.muted}; margin:0 0 8px;">${opts.excerpt}</p>
    ${button('Read More', opts.postUrl)}
  `;
  return wrapEmail(body, opts.appUrl, opts.unsubscribeUrl);
}

export function buildBroadcastEmail(opts: {
  subject: string;
  bodyHtml: string;
  appUrl: string;
  unsubscribeUrl: string;
}): string {
  const body = `
    <p style="color:${BRAND.accent}; font-size:10px; letter-spacing:2px; text-transform:uppercase; margin:0 0 16px;">${opts.subject}</p>
    <div style="color:${BRAND.muted};">${opts.bodyHtml}</div>
  `;
  return wrapEmail(body, opts.appUrl, opts.unsubscribeUrl);
}

const STATUS_LABELS: Record<string, string> = {
  created: 'Request Received',
  reviewed: 'Under Review',
  approved: 'Under Review',
  production: 'Manufacturing',
  installation: 'Ready',
  completed: 'Delivered',
};

export function buildTrackingStatusEmail(opts: {
  customerName: string;
  quotationNumber: string;
  status: string;
  trackUrl: string;
  appUrl: string;
}): string {
  const label = STATUS_LABELS[opts.status] || opts.status;
  const body = `
    <p style="color:${BRAND.accent}; font-size:10px; letter-spacing:2px; text-transform:uppercase; margin:0 0 16px;">ORDER UPDATE</p>
    <p style="margin:0 0 8px;">Hi ${opts.customerName},</p>
    <p style="color:${BRAND.muted}; margin:0 0 20px;">Your order <strong style="color:${BRAND.text};">${opts.quotationNumber}</strong> status has been updated to:</p>
    <p style="font-size:18px; font-weight:bold; color:${BRAND.accent}; margin:0 0 20px;">${label}</p>
    ${button('Track Your Order', opts.trackUrl)}
  `;
  return wrapEmail(body, opts.appUrl);
}

export function buildQuotationPdfEmail(opts: {
  customerName: string;
  quotationNumber: string;
  appUrl: string;
}): string {
  const body = `
    <p style="color:${BRAND.accent}; font-size:10px; letter-spacing:2px; text-transform:uppercase; margin:0 0 16px;">YOUR QUOTATION</p>
    <p style="margin:0 0 8px;">Hi ${opts.customerName},</p>
    <p style="color:${BRAND.muted}; margin:0 0 20px;">Please find your quotation <strong style="color:${BRAND.text};">${opts.quotationNumber}</strong> attached to this email as a PDF.</p>
    <p style="color:${BRAND.muted}; font-size:12px;">If you have any questions, simply reply to this email or reach out via WhatsApp.</p>
  `;
  return wrapEmail(body, opts.appUrl);
}
