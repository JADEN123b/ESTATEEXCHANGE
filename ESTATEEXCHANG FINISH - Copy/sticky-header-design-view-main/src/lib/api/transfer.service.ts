import api from './config';

export interface Transfer {
  id: string;
  propertyId: string;
  sellerId: string;
  buyerId: string;
  price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
  documents: {
    id: string;
    type: string;
    url: string;
    verified: boolean;
  }[];
  payment: {
    id: string;
    amount: number;
    method: string;
    status: string;
    transactionId?: string;
  };
  timeline: {
    step: string;
    status: string;
    timestamp: string;
    notes?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface TransferCreateInput {
  propertyId: string;
  buyerId: string;
  price: number;
  documents: File[];
}

const transferService = {
  async getTransfers(params?: {
    status?: Transfer['status'];
    role?: 'buyer' | 'seller';
    page?: number;
    limit?: number;
  }): Promise<{ transfers: Transfer[]; total: number }> {
    const response = await api.get('/transfers', { params });
    return response.data;
  },

  async getTransferById(id: string): Promise<Transfer> {
    const response = await api.get(`/transfers/${id}`);
    return response.data;
  },

  async createTransfer(data: TransferCreateInput): Promise<Transfer> {
    const formData = new FormData();
    formData.append('propertyId', data.propertyId);
    formData.append('buyerId', data.buyerId);
    formData.append('price', data.price.toString());
    
    data.documents.forEach(doc => {
      formData.append('documents', doc);
    });

    const response = await api.post('/transfers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateTransferDocuments(id: string, documents: File[]): Promise<Transfer> {
    const formData = new FormData();
    documents.forEach(doc => {
      formData.append('documents', doc);
    });

    const response = await api.put(`/transfers/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async processPayment(transferId: string, paymentData: {
    method: string;
    token?: string;
    saveCard?: boolean;
  }): Promise<Transfer> {
    const response = await api.post(`/transfers/${transferId}/payment`, paymentData);
    return response.data;
  },

  async cancelTransfer(id: string, reason: string): Promise<Transfer> {
    const response = await api.post(`/transfers/${id}/cancel`, { reason });
    return response.data;
  },

  async confirmTransfer(id: string): Promise<Transfer> {
    const response = await api.post(`/transfers/${id}/confirm`);
    return response.data;
  },

  async getTransferTimeline(id: string): Promise<Transfer['timeline']> {
    const response = await api.get(`/transfers/${id}/timeline`);
    return response.data;
  },

  async addTimelineNote(id: string, note: string): Promise<Transfer['timeline']> {
    const response = await api.post(`/transfers/${id}/timeline/note`, { note });
    return response.data;
  }
};

export default transferService; 