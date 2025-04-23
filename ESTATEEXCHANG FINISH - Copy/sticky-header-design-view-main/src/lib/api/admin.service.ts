import api from './config';

export interface AdminStats {
  totalUsers: number;
  activeListings: number;
  pendingVerifications: number;
  totalRevenue: number;
  userGrowth: number;
  listingGrowth: number;
  revenueGrowth: number;
}

export interface SystemAlert {
  id: string;
  type: 'verification' | 'property' | 'user' | 'system' | 'security';
  message: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  type: 'user_action' | 'system_event' | 'admin_action';
  action: string;
  description: string;
  performedBy?: {
    id: string;
    name: string;
    role: string;
  };
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface RiskAlert {
  id: string;
  type: 'suspicious_activity' | 'fraud_attempt' | 'system_security' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedEntity?: {
    type: 'user' | 'property' | 'transaction';
    id: string;
  };
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  metrics: {
    apiLatency: number;
    errorRate: number;
    activeUsers: number;
    databasePerformance: number;
  };
  lastChecked: string;
}

export interface AdminMessage {
  id: string;
  from: string;
  subject: string;
  message: string;
  type: 'support' | 'system' | 'inquiry';
  priority: 'low' | 'medium' | 'high';
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'success' | 'info';
  read: boolean;
  createdAt: string;
}

const adminService = {
  async getStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getSystemAlerts(): Promise<SystemAlert[]> {
    const response = await api.get('/admin/alerts');
    return response.data;
  },

  async getActivityLogs(params?: {
    type?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: ActivityLog[]; total: number }> {
    const response = await api.get('/admin/activity-logs', { params });
    return response.data;
  },

  async getRiskAlerts(): Promise<RiskAlert[]> {
    const response = await api.get('/admin/risk-alerts');
    return response.data;
  },

  async updateRiskAlert(id: string, update: Partial<RiskAlert>): Promise<RiskAlert> {
    const response = await api.put(`/admin/risk-alerts/${id}`, update);
    return response.data;
  },

  async getSystemHealth(): Promise<SystemHealth> {
    const response = await api.get('/admin/system-health');
    return response.data;
  },

  async bulkVerifyUsers(userIds: string[]): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/admin/users/bulk-verify', { userIds });
    return response.data;
  },

  async bulkSuspendUsers(userIds: string[]): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/admin/users/bulk-suspend', { userIds });
    return response.data;
  },

  async generateReport(params: {
    type: 'users' | 'properties' | 'transactions' | 'verifications';
    startDate: string;
    endDate: string;
    format: 'csv' | 'pdf' | 'excel';
  }): Promise<{ url: string }> {
    const response = await api.post('/admin/reports/generate', params);
    return response.data;
  },

  async getRecentReports(): Promise<Array<{
    id: string;
    name: string;
    type: string;
    format: string;
    size: string;
    createdAt: string;
    url: string;
  }>> {
    const response = await api.get('/admin/reports/recent');
    return response.data;
  },

  async getUsers(params?: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: any[]; total: number }> {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'restricted'): Promise<void> {
    await api.put(`/admin/users/${userId}/status`, { status });
  },

  async getProperties(params?: {
    search?: string;
    status?: string;
    verification?: string;
    page?: number;
    limit?: number;
  }): Promise<{ properties: any[]; total: number }> {
    const response = await api.get('/admin/properties', { params });
    return response.data;
  },

  async updatePropertyStatus(propertyId: string, status: 'approved' | 'rejected' | 'suspended'): Promise<void> {
    await api.put(`/admin/properties/${propertyId}/status`, { status });
  },

  async getVerificationRequests(params?: {
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ requests: any[]; total: number }> {
    const response = await api.get('/admin/verifications', { params });
    return response.data;
  },

  async processVerification(requestId: string, decision: 'approve' | 'reject', notes?: string): Promise<void> {
    await api.put(`/admin/verifications/${requestId}`, { decision, notes });
  },

  async getAdminMessages(params?: {
    search?: string;
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ messages: AdminMessage[]; total: number }> {
    const response = await api.get('/admin/messages', { params });
    return response.data;
  },

  async replyToMessage(messageId: string, reply: string): Promise<void> {
    await api.post(`/admin/messages/${messageId}/reply`, { reply });
  },

  async updateMessageStatus(messageId: string, status: 'read' | 'archived'): Promise<void> {
    await api.put(`/admin/messages/${messageId}/status`, { status });
  },

  async getAdminNotifications(): Promise<AdminNotification[]> {
    const response = await api.get('/admin/notifications');
    return response.data;
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await api.put(`/admin/notifications/${notificationId}/read`);
  },

  async updateSystemSettings(settings: Record<string, any>): Promise<void> {
    await api.put('/admin/settings', settings);
  },

  async getSystemSettings(): Promise<Record<string, any>> {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  async sendMassNotification(params: {
    userType: 'all' | 'verified' | 'unverified' | 'agents' | 'developers';
    title: string;
    message: string;
    priority: 'high' | 'normal' | 'low';
  }): Promise<{ success: boolean; recipientCount: number }> {
    const response = await api.post('/admin/notifications/send-mass', params);
    return response.data;
  },

  async getPropertyAnalytics(propertyId: string): Promise<{
    views: number;
    inquiries: number;
    favorited: number;
    priceHistory: Array<{ date: string; price: number }>;
    similarProperties: Array<{ id: string; price: number; distance: number }>;
  }> {
    const response = await api.get(`/admin/properties/${propertyId}/analytics`);
    return response.data;
  },

  async getUserAnalytics(userId: string): Promise<{
    loginHistory: Array<{ date: string; ip: string; device: string }>;
    activityScore: number;
    propertyViews: number;
    inquiriesSent: number;
    listingsCount: number;
    reportedCount: number;
  }> {
    const response = await api.get(`/admin/users/${userId}/analytics`);
    return response.data;
  }
};

export default adminService; 