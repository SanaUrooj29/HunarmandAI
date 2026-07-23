import { apiClient } from '../api-client'

// Aligned with backend Mongoose Schema (source: 6)
export interface SellerProfile {
  _id: string;
  phone: string;
  isPhoneVerified: boolean;
  username?: string;
  gender?: 'female' | 'male' | 'other';
  dateOfBirth?: string;
  preferredLanguage?: 'ur' | 'en';
  cnic?: string;
  shopName?: string;
  city?: string;
  productCategory?: string; // Holds the ObjectId of the Category
  shopDescription?: string;
  socialMediaLinks?: string[];
  profilePictureUrl?: string;
  profileComplete: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  accountStatus: 'active' | 'suspended' | 'deleted';
  wallet: {
    availableBalance: number;
    pendingBalance: number;
    completedSalesCount: number;
    withdrawalEnabled: boolean;
  };
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

// Aligned with POSTMAN PATCH /profile body requirements (source: 4)
export interface UpdateProfilePayload {
  username?: string;
  gender?: 'female' | 'male' | 'other';
  cnic?: string;
  shopName?: string;
  city?: string;
  productCategory?: string; // Must pass the Category ObjectId
  shopDescription?: string;
  socialMediaLinks?: string[];
  preferredLanguage?: 'ur' | 'en';
}

/**
 * Fetch current seller's profile details
 * GET /api/seller/profile
 */
export const getProfile = async (): Promise<SellerProfile> => {
  const response = await apiClient.get('/profile')
  return response.data.data // Accessing standard API response envelope
}

/**
 * Update personal and store profile fields (Handles partial updates)
 * PATCH /api/seller/profile
 */
export const updateProfile = async (data: UpdateProfilePayload): Promise<SellerProfile> => {
  const response = await apiClient.patch('/profile', data)
  return response.data.data
}

/**
 * Upload profile picture (multipart/form-data)
 * POST /api/seller/profile/picture
 */
export const uploadProfilePicture = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData()
  formData.append('picture', file) // Express backend looks for field name "picture"

  // Don't manually set Content-Type - let axios/browser handle it with boundary
  // The auth token will be added by the request interceptor
  const response = await apiClient.post('/profile/picture', formData)
  return response.data.data
}

/**
 * Soft delete seller account
 * DELETE /api/seller/profile
 */
export const deleteAccount = async (): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete('/profile')
  return response.data
}