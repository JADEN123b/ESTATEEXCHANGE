import api from './config';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'video';
  attachments?: string[];
  readAt?: string;
  createdAt: string;
  replyTo?: {
    id: string;
    content: string;
    senderId: string;
  };
  reactions?: {
    type: '👍' | '❤️' | '😊' | '😮' | '😢' | '😠';
    users: string[];
  }[];
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
    isTyping?: boolean;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
  callStatus?: {
    type: 'voice' | 'video';
    status: 'ongoing' | 'ended';
    initiator: string;
    startTime: string;
    participants: string[];
  };
}

const messageService = {
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await api.get(`/messages/conversations/${conversationId}`);
    return response.data;
  },

  async sendMessage(conversationId: string, data: { content: string; type: Message['type']; attachments?: File[] }): Promise<Message> {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('type', data.type);
    
    if (data.attachments) {
      data.attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }

    const response = await api.post(`/messages/conversations/${conversationId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async createConversation(userId: string): Promise<Conversation> {
    const response = await api.post('/messages/conversations', { userId });
    return response.data;
  },

  async markAsRead(conversationId: string): Promise<void> {
    await api.put(`/messages/conversations/${conversationId}/read`);
  },

  async deleteMessage(messageId: string): Promise<void> {
    await api.delete(`/messages/${messageId}`);
  },

  async deleteConversation(conversationId: string): Promise<void> {
    await api.delete(`/messages/conversations/${conversationId}`);
  },

  async initiateCall(conversationId: string, type: 'voice' | 'video'): Promise<{ 
    sessionId: string;
    token: string;
    iceServers: RTCIceServer[];
  }> {
    const response = await api.post(`/messages/conversations/${conversationId}/call`, { type });
    return response.data;
  },

  async endCall(conversationId: string, sessionId: string): Promise<void> {
    await api.post(`/messages/conversations/${conversationId}/call/${sessionId}/end`);
  },

  async rejectCall(conversationId: string, sessionId: string): Promise<void> {
    await api.post(`/messages/conversations/${conversationId}/call/${sessionId}/reject`);
  },

  async sendReaction(messageId: string, reaction: Message['reactions'][0]['type']): Promise<Message> {
    const response = await api.post(`/messages/${messageId}/reactions`, { reaction });
    return response.data;
  },

  async removeReaction(messageId: string, reaction: Message['reactions'][0]['type']): Promise<Message> {
    const response = await api.delete(`/messages/${messageId}/reactions/${reaction}`);
    return response.data;
  },

  async replyToMessage(conversationId: string, data: {
    content: string;
    type: Message['type'];
    replyToId: string;
    attachments?: File[];
  }): Promise<Message> {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('type', data.type);
    formData.append('replyToId', data.replyToId);
    
    if (data.attachments) {
      data.attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }

    const response = await api.post(`/messages/conversations/${conversationId}/reply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async setTypingStatus(conversationId: string, isTyping: boolean): Promise<void> {
    await api.post(`/messages/conversations/${conversationId}/typing`, { isTyping });
  },

  async forwardMessage(messageId: string, toConversationId: string): Promise<Message> {
    const response = await api.post(`/messages/${messageId}/forward`, { toConversationId });
    return response.data;
  }
};

export default messageService; 