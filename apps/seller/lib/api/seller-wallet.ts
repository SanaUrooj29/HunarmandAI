import { apiClient } from '../api-client'

export const getWallet = async () => {
  try {
    const response = await apiClient.get('/wallet');
    return response.data?.data || null;
  } catch (err) {
    console.error('Failed to fetch wallet data', err);
    return null;
  }
}
