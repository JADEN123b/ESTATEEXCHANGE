import api from './config';

export interface Notification {
  id: string;
  type: 'message' | 'property' | 'verification' | 'payment' | 'system' | 'price_alert' | 'market_update' | 'document_expiry' | 'viewing_request' | 'call';
  title: string;
  message: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data?: {
    propertyId?: string;
    messageId?: string;
    userId?: string;
    paymentId?: string;
    documentId?: string;
    viewingId?: string;
    callId?: string;
    priceChange?: {
      oldPrice: number;
      newPrice: number;
      percentage: number;
    };
    marketUpdate?: {
      type: 'price_trend' | 'new_listings' | 'market_report';
      region: string;
      change: number;
    };
  };
  expiresAt?: string;
  createdAt: string;
}

export interface NotificationPreferences {
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
  types: {
    messages: boolean;
    propertyUpdates: boolean;
    marketUpdates: boolean;
    priceAlerts: boolean;
    documentReminders: boolean;
    viewingRequests: boolean;
    calls: boolean;
    marketing: boolean;
    newsletter: boolean;
  };
  frequency: {
    marketUpdates: 'daily' | 'weekly' | 'monthly' | 'never';
    priceAlerts: 'instant' | 'daily' | 'weekly' | 'never';
    newsletter: 'weekly' | 'monthly' | 'never';
  };
  quiet_hours: {
    enabled: boolean;
    start: string; // 24h format "HH:mm"
    end: string; // 24h format "HH:mm"
    timezone: string;
  };
}

const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get('/notifications');
    return response.data;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await api.put(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  },

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    await api.put('/notifications/preferences', preferences);
  },

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await api.get('/notifications/preferences');
    return response.data;
  },

  async setPriceAlert(propertyId: string, conditions: {
    type: 'price_drop' | 'price_increase';
    threshold: number;
    frequency: NotificationPreferences['frequency']['priceAlerts'];
  }): Promise<void> {
    await api.post(`/notifications/price-alerts/${propertyId}`, conditions);
  },

  async removePriceAlert(propertyId: string): Promise<void> {
    await api.delete(`/notifications/price-alerts/${propertyId}`);
  },

  async setMarketAlert(params: {
    region: string;
    type: 'price_trend' | 'new_listings' | 'market_report';
    threshold?: number;
    frequency: NotificationPreferences['frequency']['marketUpdates'];
  }): Promise<void> {
    await api.post('/notifications/market-alerts', params);
  },

  async removeMarketAlert(alertId: string): Promise<void> {
    await api.delete(`/notifications/market-alerts/${alertId}`);
  },

  async snoozeNotifications(duration: number): Promise<void> {
    await api.post('/notifications/snooze', { duration });
  },

  async unsnoozeNotifications(): Promise<void> {
    await api.delete('/notifications/snooze');
  },

  async getNotificationHistory(params?: {
    type?: Notification['type'][];
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ notifications: Notification[]; total: number }> {
    const response = await api.get('/notifications/history', { params });
    return response.data;
  }
};

export default notificationService; 