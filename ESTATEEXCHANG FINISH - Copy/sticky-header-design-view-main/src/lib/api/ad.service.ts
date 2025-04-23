import api from './config';

export interface Ad {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  duration: number;
  reach: number;
  status: 'active' | 'pending' | 'expired';
  startDate: string;
  endDate: string;
  stats: {
    views: number;
    clicks: number;
    conversions: number;
  };
  type: 'basic' | 'premium' | 'featured';
  cta: {
    text: string;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdCreateInput {
  title: string;
  description: string;
  image: File;
  price: number;
  duration: number;
  type: Ad['type'];
  cta: {
    text: string;
    url: string;
  };
  startDate: string;
}

const adService = {
  async getAds(params?: {
    status?: Ad['status'];
    type?: Ad['type'];
    page?: number;
    limit?: number;
  }): Promise<{ ads: Ad[]; total: number }> {
    const response = await api.get('/ads', { params });
    return response.data;
  },

  async getAdById(id: string): Promise<Ad> {
    const response = await api.get(`/ads/${id}`);
    return response.data;
  },

  async createAd(data: AdCreateInput): Promise<Ad> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image') {
        formData.append('image', value);
      } else if (key === 'cta') {
        formData.append('cta', JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });

    const response = await api.post('/ads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateAd(id: string, data: Partial<AdCreateInput>): Promise<Ad> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (key === 'cta') {
        formData.append('cta', JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.put(`/ads/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteAd(id: string): Promise<void> {
    await api.delete(`/ads/${id}`);
  },

  async getAdStats(id: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<Ad['stats']> {
    const response = await api.get(`/ads/${id}/stats`, { params });
    return response.data;
  },

  async activateAd(id: string): Promise<Ad> {
    const response = await api.post(`/ads/${id}/activate`);
    return response.data;
  },

  async pauseAd(id: string): Promise<Ad> {
    const response = await api.post(`/ads/${id}/pause`);
    return response.data;
  }
};

export default adService; 