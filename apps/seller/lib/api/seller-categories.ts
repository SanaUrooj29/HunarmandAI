import axios from 'axios'

export interface Category {
  _id: string
  name: string
  description?: string
  icon?: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

/**
 * Fetch all product categories (public endpoint, no auth required)
 * GET /api/categories
 */
export const getCategories = async (): Promise<Category[]> => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  const response = await axios.get(`${API_BASE_URL}/api/categories`)
  return response.data.data // Standard API response envelope
}
