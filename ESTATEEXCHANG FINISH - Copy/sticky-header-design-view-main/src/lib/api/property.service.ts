import api from './config';

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  amenities: string[];
  status: 'available' | 'sold' | 'pending';
  agent: {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PropertyCreateInput {
  title: string;
  description: string;
  location: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  amenities: string[];
  images: File[];
}

export interface PropertyUpdateInput extends Partial<PropertyCreateInput> {
  id: string;
  status?: 'available' | 'sold' | 'pending';
}

export interface PropertySearchParams {
  query?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minSize?: number;
  maxSize?: number;
  status?: 'available' | 'sold' | 'pending';
  page?: number;
  limit?: number;
}

const propertyService = {
  async getProperties(params: PropertySearchParams = {}): Promise<{ properties: Property[]; total: number }> {
    const response = await api.get('/properties', { params });
    return response.data;
  },

  async getPropertyById(id: string): Promise<Property> {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  async createProperty(data: PropertyCreateInput): Promise<Property> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images') {
        value.forEach((image: File) => {
          formData.append('images', image);
        });
      } else if (key === 'amenities') {
        formData.append('amenities', JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });

    const response = await api.post('/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateProperty(data: PropertyUpdateInput): Promise<Property> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((image: File) => {
          formData.append('images', image);
        });
      } else if (key === 'amenities') {
        formData.append('amenities', JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.put(`/properties/${data.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteProperty(id: string): Promise<void> {
    await api.delete(`/properties/${id}`);
  },

  async toggleFavorite(id: string): Promise<{ isFavorite: boolean }> {
    const response = await api.post(`/properties/${id}/favorite`);
    return response.data;
  },

  async getFavorites(): Promise<Property[]> {
    const response = await api.get('/properties/favorites');
    return response.data;
  },

  async getMyProperties(): Promise<Property[]> {
    const response = await api.get('/properties/my-properties');
    return response.data;
  },

  async verifyProperty(id: string, documents: File[]): Promise<Property> {
    const formData = new FormData();
    documents.forEach(doc => {
      formData.append('documents', doc);
    });

    const response = await api.post(`/properties/${id}/verify`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default propertyService; 