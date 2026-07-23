import { apiClient } from '../api-client'

export interface DashboardData {
  thisMonthRevenuePkr: number;
  revenueGrowthRate: number;
  pendingPayoutPkr: number;
  ordersThisWeek: number;
  products: {
    total: number;
    active: number;
    inactive: number;
    outOfStock: number;
    drafts: number;
  };
  averageRating: number;
  reviewCount: number;
}

export const getDashboard = async (): Promise<DashboardData> => {
  try {
    const response = await apiClient.get('/dashboard');
    const data = response.data?.data || response.data;
    if (data && typeof data === 'object' && 'thisMonthRevenuePkr' in data) {
      return data;
    }
    return {
      thisMonthRevenuePkr: 0,
      revenueGrowthRate: 0,
      pendingPayoutPkr: 0,
      ordersThisWeek: 0,
      products: { total: 0, active: 0, inactive: 0, outOfStock: 0, drafts: 0 },
      averageRating: 0,
      reviewCount: 0
    };
  } catch (err) {
    console.error('Failed to fetch dashboard data', err);
    return {
      thisMonthRevenuePkr: 0,
      revenueGrowthRate: 0,
      pendingPayoutPkr: 0,
      ordersThisWeek: 0,
      products: { total: 0, active: 0, inactive: 0, outOfStock: 0, drafts: 0 },
      averageRating: 0,
      reviewCount: 0
    };
  }
}
