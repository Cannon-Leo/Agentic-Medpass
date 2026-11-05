export interface WhatsAppDeliveryStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipientId: string;
  conversationId?: string;
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        statuses?: WhatsAppDeliveryStatus[];
      };
      field: string;
    }>;
  }>;
}

export interface PaystackWebhookPayload {
  event: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    channel: string;
    currency: string;
    customer: {
      email: string;
      customer_code: string;
    };
  };
}

