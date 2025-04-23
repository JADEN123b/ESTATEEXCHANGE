import api from './config';

export interface PropertyAnalytics {
  currentValue: number;
  predictedValue: {
    threeMonths: number;
    sixMonths: number;
    oneYear: number;
  };
  priceHistory: {
    date: string;
    price: number;
    event: 'listed' | 'price_change' | 'sold' | 'rented';
  }[];
  comparables: {
    propertyId: string;
    price: number;
    similarity: number;
    features: string[];
  }[];
  marketTrends: {
    period: 'week' | 'month' | 'quarter' | 'year';
    change: number;
    volume: number;
    averagePrice: number;
  }[];
  demographics: {
    population: number;
    medianAge: number;
    medianIncome: number;
    ownership: {
      owned: number;
      rented: number;
    };
  };
  neighborhood: {
    walkScore: number;
    transitScore: number;
    schools: {
      name: string;
      rating: number;
      distance: number;
    }[];
    amenities: {
      type: string;
      count: number;
      nearest: {
        name: string;
        distance: number;
      }[];
    }[];
  };
}

export interface InvestmentAnalytics {
  roi: {
    annual: number;
    fiveYear: number;
    tenYear: number;
  };
  rentalYield: {
    gross: number;
    net: number;
  };
  expenses: {
    maintenance: number;
    tax: number;
    insurance: number;
    utilities: number;
  };
  cashFlow: {
    monthly: number;
    annual: number;
  };
  breakEven: {
    months: number;
    assumptions: {
      appreciation: number;
      rentalGrowth: number;
      expenses: number;
    };
  };
}

const analyticsService = {
  async getPropertyAnalytics(propertyId: string): Promise<PropertyAnalytics> {
    const response = await api.get(`/analytics/properties/${propertyId}`);
    return response.data;
  },

  async getInvestmentAnalytics(propertyId: string, params?: {
    downPayment?: number;
    interestRate?: number;
    loanTerm?: number;
    rentalIncome?: number;
  }): Promise<InvestmentAnalytics> {
    const response = await api.get(`/analytics/properties/${propertyId}/investment`, { params });
    return response.data;
  },

  async getMarketReport(params: {
    region: string;
    propertyType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    trends: PropertyAnalytics['marketTrends'];
    insights: string[];
    predictions: {
      trend: 'up' | 'down' | 'stable';
      confidence: number;
      factors: string[];
    };
  }> {
    const response = await api.get('/analytics/market-report', { params });
    return response.data;
  },

  async getComparableProperties(propertyId: string, params?: {
    radius?: number;
    limit?: number;
    similarityThreshold?: number;
  }): Promise<PropertyAnalytics['comparables']> {
    const response = await api.get(`/analytics/properties/${propertyId}/comparables`, { params });
    return response.data;
  },

  async getPriceHistory(propertyId: string): Promise<PropertyAnalytics['priceHistory']> {
    const response = await api.get(`/analytics/properties/${propertyId}/price-history`);
    return response.data;
  },

  async getNeighborhoodInsights(propertyId: string): Promise<PropertyAnalytics['neighborhood']> {
    const response = await api.get(`/analytics/properties/${propertyId}/neighborhood`);
    return response.data;
  },

  async getDemographics(params: {
    region: string;
    radius?: number;
  }): Promise<PropertyAnalytics['demographics']> {
    const response = await api.get('/analytics/demographics', { params });
    return response.data;
  },

  async calculateMortgage(params: {
    propertyPrice: number;
    downPayment: number;
    interestRate: number;
    loanTerm: number;
    propertyTax?: number;
    insurance?: number;
  }): Promise<{
    monthlyPayment: number;
    totalPayment: number;
    amortizationSchedule: {
      date: string;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }[];
  }> {
    const response = await api.post('/analytics/calculate-mortgage', params);
    return response.data;
  }
};

export default analyticsService; 