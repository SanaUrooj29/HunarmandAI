import { apiClient } from '../api-client'

export const getOrders = async (status?: string) => {
  const query = status ? `?status=${status}` : '';
  try {
    const response = await apiClient.get(`/orders${query}`);
    return response.data?.data?.orders || response.data?.orders || [];
  } catch (err) {
    console.error('Failed to fetch orders', err);
    return [];
  }
}

export const getOrder = async (orderId: string) => {
  const response = await apiClient.get(`/orders/${orderId}`);
  return response.data.data.order;
}

export const markOrderReady = async (orderId: string) => {
  const response = await apiClient.post(`/orders/${orderId}/mark-ready`);
  return response.data.data.order;
}
