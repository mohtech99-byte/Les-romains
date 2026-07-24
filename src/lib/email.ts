/**
 * Email sending service — server-side only (uses process.env, never imported
 * by client code). Uses Brevo's v3 SMTP API directly via fetch, so no new npm
 * dependency is needed (Node 18+ has fetch built in).
 *
 * If BREVO_API_KEY is not configured, every function here resolves with
 * { success: false, error: '...' } instead of throwing, so the rest of the
 * app degrades gracefully — admin sees a clear error, nothing crashes.
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export interface EmailAttachment {
  filename: string;
  content: string; // base64-encoded
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}

export interface SendEmailResult {
  success: boolean;
  error?: string;
}

function getConfig() {
  const apiKey = process.env.BREVO_API_KEY;
  const from =
  process.env.EMAIL_FROM ||
  'Les Romains <sadeco005@gmail.com>';
  return { apiKey, from };
}

function parseFrom(from: string): { name?: string; email: string } {
  const match = from.match(/^(.*?)\s*<(.+)>$/);
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }
  return { email: from.trim() };
}

function mapAttachments(attachments?: EmailAttachment[]) {
  if (!attachments || attachments.length === 0) return undefined;
  return attachments.map(att => ({
    name: att.filename,
    content: att.content,
  }));
}

export function isEmailConfigured(): boolean {
  return !!process.env.BREVO_API_KEY;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const { apiKey, from } = getConfig();
  if (!apiKey) {
    console.warn('[email] BREVO_API_KEY not set — skipping send to', input.to);
    return { success: false, error: 'Email service is not configured (missing BREVO_API_KEY)' };
  }

  const sender = parseFrom(from);

  try {
    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        sender,
        to: [{ email: input.to }],
        subject: input.subject,
        htmlContent: input.html,
        attachment: mapAttachments(input.attachments),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('[email] Brevo API error:', res.status, body);
      return { success: false, error: `Email provider error (${res.status})` };
    }
    return { success: true };
  } catch (error) {
    console.error('[email] Failed to send:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Sends the same email to many recipients using Brevo's batch endpoint
 * (messageVersions, up to 1000 message versions per call), chunking
 * automatically for larger lists. Used for newsletter broadcasts. Each
 * recipient gets their own individual message (not a visible group "To" list).
 */
export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  html: string
): Promise<{ sent: number; failed: number; error?: string }> {
  const { apiKey, from } = getConfig();
  if (!apiKey) {
    console.warn('[email] BREVO_API_KEY not set — skipping bulk send');
    return { sent: 0, failed: recipients.length, error: 'Email service is not configured (missing BREVO_API_KEY)' };
  }

  const sender = parseFrom(from);

  // Brevo allows up to 1000 message versions per request.
  // Each version can have up to 99 recipients, but since we want individual
  // messages (no shared To: list), we use 1 recipient per version.
  const CHUNK_SIZE = 1000;
  let sent = 0;
  let failed = 0;
  let lastError: string | undefined;

  for (let i = 0; i < recipients.length; i += CHUNK_SIZE) {
    const chunk = recipients.slice(i, i + CHUNK_SIZE);
    const messageVersions = chunk.map(email => ({
      to: [{ email }],
    }));

    try {
      const res = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          sender,
          subject,
          htmlContent: html,
          messageVersions,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error('[email] Brevo batch API error:', res.status, body);
        failed += chunk.length;
        lastError = `Email provider error (${res.status})`;
      } else {
        sent += chunk.length;
      }
    } catch (error) {
      console.error('[email] Bulk send chunk failed:', error);
      failed += chunk.length;
      lastError = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  return { sent, failed, error: lastError };
}
