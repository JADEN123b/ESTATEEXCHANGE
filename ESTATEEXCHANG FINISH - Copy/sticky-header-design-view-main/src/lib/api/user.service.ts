import api from './config';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  location?: string;
  phone?: string;
  isVerified: boolean;
  role: 'user' | 'agent' | 'developer' | 'admin';
  createdAt: string;
  updatedAt: string;
  stats?: {
    listings: number;
    followers: number;
    following: number;
  };
}

export interface UserUpdateInput {
  name?: string;
  bio?: string;
  location?: string;
  phone?: string;
  avatar?: File;
  coverPhoto?: File;
}

export interface VerificationInput {
  type: 'individual' | 'agent' | 'developer';
  documents: {
    [key: string]: File;
  };
  links?: {
    [key: string]: string;
  };
}

const userService = {
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async updateProfile(data: UserUpdateInput): Promise<User> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if ((key === 'avatar' || key === 'coverPhoto') && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.put('/users/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async submitVerification(data: VerificationInput): Promise<{ status: string; message: string }> {
    const formData = new FormData();
    formData.append('type', data.type);
    
    // Append documents
    Object.entries(data.documents).forEach(([key, file]) => {
      formData.append(`documents[${key}]`, file);
    });

    // Append links if any
    if (data.links) {
      formData.append('links', JSON.stringify(data.links));
    }

    const response = await api.post('/users/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async followUser(userId: string): Promise<{ isFollowing: boolean }> {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  async unfollowUser(userId: string): Promise<{ isFollowing: boolean }> {
    const response = await api.delete(`/users/${userId}/follow`);
    return response.data;
  },

  async getFollowers(userId: string): Promise<User[]> {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data;
  },

  async getFollowing(userId: string): Promise<User[]> {
    const response = await api.get(`/users/${userId}/following`);
    return response.data;
  },

  async updateSettings(settings: { [key: string]: any }): Promise<{ message: string }> {
    const response = await api.put('/users/settings', settings);
    return response.data;
  },

  async getNotifications(): Promise<any[]> {
    const response = await api.get('/users/notifications');
    return response.data;
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await api.put(`/users/notifications/${notificationId}/read`);
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const response = await api.put('/users/change-password', data);
    return response.data;
  },

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await api.post('/users/reset-password-request', { email });
    return response.data;
  },

  async resetPassword(data: { token: string; newPassword: string }): Promise<{ message: string }> {
    const response = await api.post('/users/reset-password', data);
    return response.data;
  }
};

export default userService; 