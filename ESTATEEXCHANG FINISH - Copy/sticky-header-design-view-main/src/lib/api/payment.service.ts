import api from './config';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'property' | 'service' | 'subscription' | 'deposit' | 'refund';
  method: {
    type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'crypto';
    last4?: string;
    brand?: string;
  };
  description: string;
  metadata: {
    propertyId?: string;
    transferId?: string;
    subscriptionId?: string;
  };
  fees?: {
    processing: number;
    service: number;
    total: number;
  };
  refund?: {
    amount: number;
    reason: string;
    date: string;
  };
  billingDetails?: {
    name: string;
    email: string;
    phone?: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

const paymentService = {
  async getPaymentHistory(params?: {
    status?: Payment['status'];
    type?: Payment['type'];
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ payments: Payment[]; total: number }> {
    const response = await api.get('/payments/history', { params });
    return response.data;
  },

  async getPaymentById(id: string): Promise<Payment> {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  async processPayment(data: {
    amount: number;
    currency: string;
    type: Payment['type'];
    method: {
      type: Payment['method']['type'];
      token?: string;
      saveForFuture?: boolean;
    };
    description: string;
    metadata?: Payment['metadata'];
    billingDetails: Payment['billingDetails'];
  }): Promise<Payment> {
    const response = await api.post('/payments/process', data);
    return response.data;
  },

  async requestRefund(paymentId: string, data: {
    amount: number;
    reason: string;
  }): Promise<Payment> {
    const response = await api.post(`/payments/${paymentId}/refund`, data);
    return response.data;
  },

  async getSavedPaymentMethods(): Promise<{
    id: string;
    type: Payment['method']['type'];
    last4: string;
    brand: string;
    expiryMonth: string;
    expiryYear: string;
    isDefault: boolean;
  }[]> {
    const response = await api.get('/payments/methods');
    return response.data;
  },

  async addPaymentMethod(data: {
    token: string;
    makeDefault?: boolean;
  }): Promise<{
    id: string;
    type: Payment['method']['type'];
    last4: string;
    brand: string;
  }> {
    const response = await api.post('/payments/methods', data);
    return response.data;
  },

  async removePaymentMethod(methodId: string): Promise<void> {
    await api.delete(`/payments/methods/${methodId}`);
  },

  async getPaymentReceipt(paymentId: string): Promise<{
    url: string;
    expiresAt: string;
  }> {
    const response = await api.get(`/payments/${paymentId}/receipt`);
    return response.data;
  },

  async getPaymentStats(params?: {
    startDate?: string;
    endDate?: string;
    type?: Payment['type'];
  }): Promise<{
    total: number;
    count: number;
    byStatus: Record<Payment['status'], number>;
    byType: Record<Payment['type'], number>;
    byMethod: Record<Payment['method']['type'], number>;
  }> {
    const response = await api.get('/payments/stats', { params });
    return response.data;
  }
};

export default paymentService; 