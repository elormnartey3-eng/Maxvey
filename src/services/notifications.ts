import type { Order } from '../types/index.ts';

export interface NotificationResult {
  emailSent: boolean;
  whatsappSent: boolean;
  emailError?: string;
  whatsappError?: string;
}

export class NotificationService {
  private adminEmail: string;
  private adminWhatsApp: string;
  private resendApiKey?: string;
  private whatsappToken?: string;
  private whatsappPhoneId?: string;

  constructor() {
    this.adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'maxwellunusual@gmail.com';
    this.adminWhatsApp = process.env.ADMIN_NOTIFICATION_WHATSAPP || '+2349029602573';
    this.resendApiKey = process.env.RESEND_API_KEY;
    this.whatsappToken = process.env.WHATSAPP_API_TOKEN;
    this.whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  }

  /**
   * Generates a clean, readable text summary of an order
   */
  public formatOrderSummaryText(order: Order): string {
    const itemsList = order.items
      .map(
        item =>
          `• ${item.name}\n  Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity} | ₦${(
            item.price * item.quantity
          ).toLocaleString()}`
      )
      .join('\n');

    return `🔥 NEW MAXVEY ORDER: ${order.orderNumber}
━━━━━━━━━━━━━━━━━━━━
Status: ${order.paymentStatus.toUpperCase()} (${order.paymentMethod})
Total Paid: ₦${order.total.toLocaleString()} (Items: ₦${order.subtotal.toLocaleString()} + Delivery: ₦${order.deliveryFee.toLocaleString()})

📦 ORDER ITEMS:
${itemsList}

👤 CUSTOMER DETAILS:
Name: ${order.customer.fullName}
Phone: ${order.customer.phone}
Email: ${order.customer.email}

📍 DELIVERY ADDRESS:
${order.customer.address}
City: ${order.customer.city}
State: ${order.customer.state}
${order.customer.notes ? `Note: ${order.customer.notes}` : ''}

🔗 Reference: ${order.paystackReference || 'N/A'}`;
  }

  /**
   * Generates a direct WhatsApp click-to-chat URL for the admin with prefilled order text
   */
  public getWhatsAppClickToChatUrl(order: Order): string {
    const cleanPhone = this.adminWhatsApp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(this.formatOrderSummaryText(order));
    return `https://wa.me/${cleanPhone}?text=${message}`;
  }

  /**
   * Generates an HTML email body for Resend
   */
  public formatOrderEmailHtml(order: Order): string {
    const itemsRows = order.items
      .map(
        item => `
        <tr style="border-bottom: 1px solid #27272a;">
          <td style="padding: 12px 8px; color: #ffffff; font-weight: 600;">
            ${item.name}<br/>
            <span style="font-size: 12px; color: #a1a1aa; font-weight: normal;">Size: ${item.size} &middot; Color: ${item.color} &middot; Qty: ${item.quantity}</span>
          </td>
          <td style="padding: 12px 8px; text-align: right; color: #ffffff; font-family: monospace;">
            ₦${(item.price * item.quantity).toLocaleString()}
          </td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #121215; border: 1px solid #27272a; border-radius: 8px; padding: 28px;">
          <div style="text-align: center; border-bottom: 1px solid #27272a; padding-bottom: 20px; margin-bottom: 20px;">
            <h1 style="color: #ffffff; font-size: 26px; margin: 0; letter-spacing: 2px;">MAXVEY<span style="color: #dc2626;">.</span></h1>
            <p style="color: #a1a1aa; font-size: 12px; letter-spacing: 1px; margin: 4px 0 0 0;">FOR THOSE WHO MOVE DIFFERENT.</p>
          </div>

          <div style="background-color: #1c1917; border-left: 4px solid #dc2626; padding: 12px 16px; margin-bottom: 24px;">
            <p style="margin: 0; color: #ffffff; font-weight: bold; font-size: 16px;">NEW ORDER RECEIVED: ${order.orderNumber}</p>
            <p style="margin: 4px 0 0 0; color: #a1a1aa; font-size: 13px;">Payment Status: <span style="color: #22c55e; font-weight: bold;">VERIFIED (PAID)</span></p>
          </div>

          <h3 style="color: #ffffff; border-bottom: 1px solid #27272a; padding-bottom: 8px; margin-top: 0;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            ${itemsRows}
            <tr>
              <td style="padding: 8px; color: #a1a1aa;">Subtotal:</td>
              <td style="padding: 8px; text-align: right; color: #ffffff; font-family: monospace;">₦${order.subtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #a1a1aa;">Delivery Fee (${order.customer.state}):</td>
              <td style="padding: 8px; text-align: right; color: #ffffff; font-family: monospace;">₦${order.deliveryFee.toLocaleString()}</td>
            </tr>
            <tr style="border-top: 1px solid #27272a; font-weight: bold;">
              <td style="padding: 12px 8px; color: #ffffff; font-size: 16px;">Total Paid:</td>
              <td style="padding: 12px 8px; text-align: right; color: #dc2626; font-size: 18px; font-family: monospace;">₦${order.total.toLocaleString()}</td>
            </tr>
          </table>

          <h3 style="color: #ffffff; border-bottom: 1px solid #27272a; padding-bottom: 8px;">Customer & Delivery Info</h3>
          <p style="margin: 4px 0; color: #d4d4d8; font-size: 14px;"><strong>Customer:</strong> ${order.customer.fullName}</p>
          <p style="margin: 4px 0; color: #d4d4d8; font-size: 14px;"><strong>Phone:</strong> <a href="tel:${order.customer.phone}" style="color: #38bdf8;">${order.customer.phone}</a></p>
          <p style="margin: 4px 0; color: #d4d4d8; font-size: 14px;"><strong>Email:</strong> ${order.customer.email}</p>
          <p style="margin: 4px 0; color: #d4d4d8; font-size: 14px;"><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.state}</p>
          ${order.customer.notes ? `<p style="margin: 4px 0; color: #facc15; font-size: 14px;"><strong>Delivery Notes:</strong> ${order.customer.notes}</p>` : ''}

          <div style="margin-top: 28px; text-align: center; border-top: 1px solid #27272a; padding-top: 20px;">
            <a href="${this.getWhatsAppClickToChatUrl(order)}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
              Chat Customer on WhatsApp
            </a>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Dispatches notifications to Admin via Resend Email and WhatsApp Cloud API
   */
  public async sendOrderNotifications(order: Order): Promise<NotificationResult> {
    const result: NotificationResult = {
      emailSent: false,
      whatsappSent: false,
    };

    // 1. Resend Email Dispatch
    if (this.resendApiKey && this.resendApiKey.startsWith('re_')) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'MAXVEY Orders <orders@maxvey.com>',
            to: [this.adminEmail],
            subject: `[MAXVEY] New Order ${order.orderNumber} (₦${order.total.toLocaleString()})`,
            html: this.formatOrderEmailHtml(order),
          }),
        });

        if (response.ok) {
          result.emailSent = true;
        } else {
          const errBody = await response.text();
          result.emailError = `Resend error: ${errBody}`;
          console.warn('Failed to send Resend email:', errBody);
        }
      } catch (err: any) {
        result.emailError = err?.message || 'Network error sending email';
        console.warn('Resend exception:', err);
      }
    } else {
      // Log to console for dev / test verification
      console.log(`[Notification: Email queued for ${this.adminEmail}] Order ${order.orderNumber}`);
    }

    // 2. WhatsApp Cloud API Dispatch
    if (this.whatsappToken && this.whatsappPhoneId) {
      try {
        const cleanToPhone = this.adminWhatsApp.replace(/[^0-9]/g, '');
        const response = await fetch(
          `https://graph.facebook.com/v19.0/${this.whatsappPhoneId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.whatsappToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: cleanToPhone,
              type: 'text',
              text: {
                preview_url: false,
                body: this.formatOrderSummaryText(order),
              },
            }),
          }
        );

        if (response.ok) {
          result.whatsappSent = true;
        } else {
          const errBody = await response.text();
          result.whatsappError = `WhatsApp Cloud API error: ${errBody}`;
          console.warn('Failed to send WhatsApp message:', errBody);
        }
      } catch (err: any) {
        result.whatsappError = err?.message || 'Network error sending WhatsApp message';
        console.warn('WhatsApp API exception:', err);
      }
    } else {
      console.log(`[Notification: WhatsApp ready for ${this.adminWhatsApp}] Order ${order.orderNumber}`);
    }

    return result;
  }
}

export const notifications = new NotificationService();
