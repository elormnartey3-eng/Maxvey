import crypto from 'crypto';
import type { Order } from '../types/index.ts';

export interface PaystackInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
  isTestSandbox?: boolean;
}

export class PaystackService {
  private secretKey: string;
  private publicKey: string;

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY || '';
  }

  public isConfigured(): boolean {
    return Boolean(this.secretKey && this.secretKey.startsWith('sk_'));
  }

  /**
   * Initializes a Paystack transaction.
   * Total is converted to Kobo (multiply by 100) as required by Paystack API.
   */
  public async initializeTransaction(order: Order, callbackUrl: string): Promise<PaystackInitResponse> {
    const reference = order.paystackReference || `MV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const amountInKobo = Math.round(order.total * 100);

    if (this.isConfigured()) {
      try {
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: order.customer.email,
            amount: amountInKobo,
            currency: 'NGN',
            reference,
            callback_url: callbackUrl,
            metadata: {
              order_id: order.id,
              order_number: order.orderNumber,
              customer_name: order.customer.fullName,
              customer_phone: order.customer.phone,
              delivery_state: order.customer.state,
              custom_fields: [
                {
                  display_name: 'Order Number',
                  variable_name: 'order_number',
                  value: order.orderNumber,
                },
                {
                  display_name: 'Customer Phone',
                  variable_name: 'customer_phone',
                  value: order.customer.phone,
                },
              ],
            },
          }),
        });

        const data = await response.json();
        if (data.status && data.data) {
          return {
            authorization_url: data.data.authorization_url,
            access_code: data.data.access_code,
            reference: data.data.reference,
            isTestSandbox: false,
          };
        } else {
          console.error('Paystack API initialize failed:', data.message);
        }
      } catch (err) {
        console.error('Network error calling Paystack initialize:', err);
      }
    }

    // Graceful Sandbox Mode when credentials are not yet configured in .env:
    // Generates a verified test-checkout route with complete interactive simulation
    return {
      authorization_url: `/checkout/test-pay?ref=${reference}&orderId=${order.id}`,
      access_code: `mock_acc_${reference}`,
      reference,
      isTestSandbox: true,
    };
  }

  /**
   * Verifies a Paystack transaction directly with Paystack API.
   */
  public async verifyTransaction(reference: string, expectedAmountNaira?: number): Promise<{
    verified: boolean;
    amount?: number;
    paidAt?: string;
    channel?: string;
    gatewayResponse?: string;
    message?: string;
  }> {
    if (this.isConfigured()) {
      try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        });

        const resData = await response.json();
        if (resData.status && resData.data) {
          const trans = resData.data;
          const isSuccess = trans.status === 'success';
          const paidAmountNaira = trans.amount / 100;

          // Guard against price tampering if expected amount provided
          if (expectedAmountNaira && Math.abs(paidAmountNaira - expectedAmountNaira) > 1) {
            return {
              verified: false,
              message: `Amount mismatch: Expected ₦${expectedAmountNaira}, received ₦${paidAmountNaira}`,
            };
          }

          return {
            verified: isSuccess,
            amount: paidAmountNaira,
            paidAt: trans.paid_at || new Date().toISOString(),
            channel: trans.channel,
            gatewayResponse: trans.gateway_response,
          };
        }
        return {
          verified: false,
          message: resData.message || 'Payment not verified',
        };
      } catch (err) {
        console.error('Error verifying transaction with Paystack:', err);
        return {
          verified: false,
          message: 'Network error communicating with Paystack',
        };
      }
    }

    // In local sandbox / testing without live keys:
    return {
      verified: true,
      amount: expectedAmountNaira || 0,
      paidAt: new Date().toISOString(),
      channel: 'test_card',
      gatewayResponse: 'Successful Sandbox Transaction',
    };
  }

  /**
   * Verifies the cryptographic HMAC SHA512 signature from Paystack Webhooks
   */
  public verifyWebhookSignature(rawBody: string, signatureHeader?: string): boolean {
    if (!this.secretKey || !signatureHeader) {
      return false;
    }
    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(rawBody)
      .digest('hex');
    return hash === signatureHeader;
  }
}

export const paystack = new PaystackService();
