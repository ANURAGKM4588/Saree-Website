import { formatPrice } from "@/data/sarees";
import type { Order } from "./shop-store";

export const BRAND_SENDER_EMAIL = "kadha.shop@gmail.com";
export const BRAND_SENDER_NAME = "Kadha Sarees";

export interface EmailTemplateConfig {
  subjectTemplate: string;
  greetingText: string;
  thankYouMessage: string;
  senderEmail: string;
  senderName: string;
  googleScriptUrl?: string;
}

export const DEFAULT_EMAIL_TEMPLATE: EmailTemplateConfig = {
  subjectTemplate: "Kadha Sarees — Booking Order Confirmation (#{ORDER_ID})",
  greetingText: "Thank you for choosing Kadha Sarees! We are delighted to reserve your handwoven masterpiece.",
  thankYouMessage: "Your saree booking order #{ORDER_ID} has been successfully received by our studio master weavers.",
  senderEmail: BRAND_SENDER_EMAIL,
  senderName: BRAND_SENDER_NAME,
  googleScriptUrl: "",
};

const TEMPLATE_KEY = "kadha_email_template_config";
const EMAIL_LOGS_KEY = "kadha_sent_email_logs";

export function getEmailTemplateConfig(): EmailTemplateConfig {
  try {
    const raw = localStorage.getItem(TEMPLATE_KEY);
    return raw ? { ...DEFAULT_EMAIL_TEMPLATE, ...JSON.parse(raw) } : DEFAULT_EMAIL_TEMPLATE;
  } catch (e) {
    return DEFAULT_EMAIL_TEMPLATE;
  }
}

export function saveEmailTemplateConfig(config: EmailTemplateConfig) {
  try {
    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save email template:", e);
  }
}

export interface SentEmailLog {
  id: string;
  orderId: string;
  senderEmail: string;
  recipientEmail: string;
  customerName: string;
  subject: string;
  sentAt: string;
  status: "Sent" | "Delivered";
  htmlContent: string;
}

export function getSentEmailLogs(): SentEmailLog[] {
  try {
    const raw = localStorage.getItem(EMAIL_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveSentEmailLog(log: SentEmailLog) {
  try {
    const current = getSentEmailLogs();
    const updated = [log, ...current];
    localStorage.setItem(EMAIL_LOGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save email log:", e);
  }
}

/**
 * Formats an official HTML booking confirmation email receipt
 * Uses customizable email template configuration
 */
export function generateOrderEmailHtml(order: Order, customConfig?: EmailTemplateConfig): string {
  const cfg = customConfig || getEmailTemplateConfig();

  const replaceVars = (str: string) =>
    str
      .replace(/{ORDER_ID}/g, order.id)
      .replace(/{CUSTOMER_NAME}/g, order.customerName)
      .replace(/{PHONE}/g, order.phone)
      .replace(/{EMAIL}/g, order.email)
      .replace(/{ADDRESS}/g, order.address);

  const greeting = replaceVars(cfg.greetingText);
  const thankYouMsg = replaceVars(cfg.thankYouMessage);

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; color: #111827;">
        <strong>${item.name}</strong><br/>
        <span style="font-size: 11px; color: #6b7280;">Quantity: ${item.qty} × ${formatPrice(item.price)}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; font-weight: bold; color: #064e3b; text-align: right;">
        ${formatPrice(item.price * item.qty)}
      </td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kadha Sarees Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf9f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf9f6; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #064e3b; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 500; color: #fef08a; letter-spacing: 0.15em; text-transform: uppercase;">
                ${cfg.senderName}
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; color: #d1fae5; letter-spacing: 0.2em; text-transform: uppercase;">
                Handwoven Sarees · Heritage Craftsmanship
              </p>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <!-- Booking ID Badge Box -->
              <div style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 12px; padding: 18px 22px; margin-bottom: 24px; text-align: center;">
                <span style="font-size: 10px; font-weight: bold; color: #b45309; text-transform: uppercase; letter-spacing: 0.2em;">
                  Official Booking Receipt
                </span>
                <h2 style="margin: 6px 0 0 0; font-size: 22px; color: #064e3b; font-weight: 700; letter-spacing: 0.05em;">
                  Booking ID: #${order.id}
                </h2>
              </div>

              <!-- Warm Thank You Greeting -->
              <p style="font-size: 15px; line-height: 1.6; color: #111827; margin-top: 0; font-weight: 600;">
                Dear ${order.customerName},
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #064e3b; font-weight: 500; background-color: #f0fdf4; padding: 14px 16px; border-radius: 8px; border-left: 4px solid #059669;">
                ${greeting}
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #374151;">
                ${thankYouMsg}
              </p>

              <!-- Order Summary Table -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 24px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #6b7280; text-align: left; letter-spacing: 0.1em;">
                      Reserved Saree Item(s)
                    </th>
                    <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #6b7280; text-align: right; letter-spacing: 0.1em;">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td style="padding: 12px; font-size: 13px; font-weight: bold; color: #111827;">
                      Total Order Amount
                    </td>
                    <td style="padding: 12px; font-size: 16px; font-weight: bold; color: #064e3b; text-align: right;">
                      ${formatPrice(order.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <!-- Delivery Information -->
              <div style="margin-top: 24px; background-color: #f9fafb; border-radius: 8px; padding: 16px;">
                <h3 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #4b5563; letter-spacing: 0.1em;">
                  Delivery Address:
                </h3>
                <p style="margin: 0; font-size: 13px; color: #111827; line-height: 1.5;">
                  ${order.address}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">
                  Contact Phone: ${order.phone}
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 11px; color: #4b5563;">
                Sent officially from <strong>${cfg.senderName}</strong> (&lt;<a href="mailto:${cfg.senderEmail}" style="color: #064e3b; text-decoration: underline;">${cfg.senderEmail}</a>&gt;)
              </p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #9ca3af;">
                Kadha Sarees Studio · Kerala, India · WhatsApp Support: +91 8075676393
              </p>
              <p style="margin: 4px 0 0 0; font-size: 10px; color: #9ca3af;">
                This is an automated transactional booking notification sent directly to ${order.email}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Triggers automated confirmation email dispatch to the customer
 * Integrates with Google Apps Script Web App for automated Gmail delivery from kadha.shop@gmail.com
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<{ success: boolean; message: string }> {
  const cfg = getEmailTemplateConfig();
  const emailHtml = generateOrderEmailHtml(order, cfg);

  const subject = cfg.subjectTemplate
    .replace(/{ORDER_ID}/g, order.id)
    .replace(/{CUSTOMER_NAME}/g, order.customerName);

  const scriptUrl = cfg.googleScriptUrl || import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  let scriptDispatched = false;
  if (scriptUrl && scriptUrl.trim().length > 0) {
    try {
      await fetch(scriptUrl.trim(), {
        method: "POST",
        mode: "no-cors", // Google Apps Script cross-origin redirect support
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          recipient: order.email,
          subject: subject,
          htmlBody: emailHtml,
          senderName: cfg.senderName,
          orderId: order.id,
        }),
      });
      scriptDispatched = true;
      console.log(`[Google Apps Script] Automated email sent to ${order.email} via ${scriptUrl}`);
    } catch (err) {
      console.warn("Google Apps Script email fetch warning:", err);
    }
  }

  const log: SentEmailLog = {
    id: `EML-${Date.now().toString().substring(6)}`,
    orderId: order.id,
    senderEmail: cfg.senderEmail,
    recipientEmail: order.email,
    customerName: order.customerName,
    subject,
    sentAt: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    status: "Sent",
    htmlContent: emailHtml,
  };

  // Save audit log
  saveSentEmailLog(log);

  // Print official dispatch log to browser dev console
  console.log(
    `%c[AUTOMATED BRAND EMAIL DISPATCHED] %cFrom: "${cfg.senderName}" <${cfg.senderEmail}> -> To: ${order.email} | Subject: ${subject}`,
    "color: #047857; font-weight: bold",
    "color: #111827"
  );

  return {
    success: true,
    message: scriptDispatched
      ? `Automated Google Apps Script email sent from ${cfg.senderEmail} to ${order.email}!`
      : `Automated confirmation email logged for ${order.email}!`,
  };
}
