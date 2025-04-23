import api from './config';

export interface Review {
  id: string;
  userId: string;
  reviewerId: string;
  rating: number;
  comment: string;
  type: 'seller' | 'buyer' | 'agent';
  propertyId?: string;
  transactionId?: string;
  images?: string[];
  likes: number;
  replies?: {
    id: string;
    userId: string;
    comment: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

const reviewService = {
  async getUserReviews(userId: string, params?: {
    type?: Review['type'];
    page?: number;
    limit?: number;
  }): Promise<{ reviews: Review[]; total: number }> {
    const response = await api.get(`/users/${userId}/reviews`, { params });
    return response.data;
  },

  async createReview(data: {
    userId: string;
    rating: number;
    comment: string;
    type: Review['type'];
    propertyId?: string;
    transactionId?: string;
    images?: File[];
  }): Promise<Review> {
    const formData = new FormData();
    formData.append('userId', data.userId);
    formData.append('rating', data.rating.toString());
    formData.append('comment', data.comment);
    formData.append('type', data.type);
    
    if (data.propertyId) {
      formData.append('propertyId', data.propertyId);
    }
    if (data.transactionId) {
      formData.append('transactionId', data.transactionId);
    }
    if (data.images) {
      data.images.forEach(image => {
        formData.append('images', image);
      });
    }

    const response = await api.post('/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateReview(reviewId: string, data: {
    rating?: number;
    comment?: string;
    images?: File[];
  }): Promise<Review> {
    const formData = new FormData();
    if (data.rating !== undefined) {
      formData.append('rating', data.rating.toString());
    }
    if (data.comment !== undefined) {
      formData.append('comment', data.comment);
    }
    if (data.images) {
      data.images.forEach(image => {
        formData.append('images', image);
      });
    }

    const response = await api.put(`/reviews/${reviewId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteReview(reviewId: string): Promise<void> {
    await api.delete(`/reviews/${reviewId}`);
  },

  async likeReview(reviewId: string): Promise<{ likes: number }> {
    const response = await api.post(`/reviews/${reviewId}/like`);
    return response.data;
  },

  async replyToReview(reviewId: string, comment: string): Promise<Review> {
    const response = await api.post(`/reviews/${reviewId}/replies`, { comment });
    return response.data;
  },

  async deleteReplyToReview(reviewId: string, replyId: string): Promise<void> {
    await api.delete(`/reviews/${reviewId}/replies/${replyId}`);
  },

  async getUserRatingStats(userId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
    typeDistribution: Record<Review['type'], number>;
  }> {
    const response = await api.get(`/users/${userId}/rating-stats`);
    return response.data;
  }
};

export default reviewService; 