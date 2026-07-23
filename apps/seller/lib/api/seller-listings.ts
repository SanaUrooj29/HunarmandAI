import { apiClient } from '../api-client'

export const getListings = async (status?: string) => {
  const query = status ? `?stockStatus=${status}` : ''; // Aligned query param to Postman spec
  const response = await apiClient.get(`/products${query}`);
  return response.data.data; // Ensure this matches your response envelope structure
}

export const getListing = async (productId: string) => {
  const response = await apiClient.get(`/products/${productId}`);
  return response.data.data;
}

/**
 * Compress image to reduce file size and token usage
 * Targets max 1 MB via progressive JPEG quality reduction
 */
async function compressImage(file: File, maxSizeMB: number = 1): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        // Downscale if large; target ~1200px max dimension
        if (width > 1200 || height > 1200) {
          const ratio = Math.min(1200 / width, 1200 / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Start with quality 0.8, reduce until under size limit
        let quality = 0.8


        const toBlobAsync = (q: number): Promise<Blob | null> =>
          new Promise((res) => canvas.toBlob((b) => res(b), 'image/jpeg', q))

        ;(async () => {
          let blob = await toBlobAsync(quality)
          while ((blob && blob.size / (1024 * 1024) > maxSizeMB) && quality > 0.1) {
            quality = Math.max(0.1, +(quality - 0.1).toFixed(2))
            blob = await toBlobAsync(quality)
          }
          const compressedFile = new File([blob || new Blob()], file.name, { type: 'image/jpeg' })
          resolve(compressedFile)
        })()
      }
    }
  })
}

/**
 * Generate AI-powered listing suggestion from product image
 * POST /api/seller/products/ai-listing
 * Compresses image to ~1MB before sending to reduce token usage
 */
export const generateAiListing = async (file: File) => {
  console.debug('[UI] generateAiListing: original file size (MB):', (file.size / (1024*1024)).toFixed(2))
  const compressedFile = await compressImage(file, 1)
  console.debug('[UI] generateAiListing: compressed file size (MB):', (compressedFile.size / (1024*1024)).toFixed(2))
  const formData = new FormData()
  formData.append('image', compressedFile) // Backend expects field name "image"
  try {
    const response = await apiClient.post('/products/ai-listing', formData)
    console.debug('[UI] generateAiListing: server response status', response.status)
    return response.data.data
  } catch (err) {
    console.error('[UI] generateAiListing error', err)
    throw err
  }
}

export const uploadListingImage = async (file: File) => {
  const formData = new FormData()
  formData.append('image', file)
  console.log('[uploadListingImage] Uploading file:', file.name, 'size:', file.size)
  try {
    const response = await apiClient.post('/uploads', formData)
    console.log('[uploadListingImage] Raw response:', response)
    console.log('[uploadListingImage] response.data:', response.data)
    console.log('[uploadListingImage] response.data.data:', response.data.data)
    const url = response.data.data?.url
    console.log('[uploadListingImage] Extracted URL:', url, 'Type:', typeof url)
    if (!url) {
      throw new Error(`Upload failed: no URL in response. Response was: ${JSON.stringify(response.data)}`)
    }
    return url
  } catch (err) {
    console.error('[uploadListingImage] Error:', err)
    throw err
  }
}

export const createListing = async (data: any) => {
  const payload = {
    stockStatus: 'in_stock',
    ...data,
  }
  console.log('[createListing] Final payload before sending:', JSON.stringify(payload, null, 2))
  console.log('[createListing] images array:', payload.images)
  console.log('[createListing] images[0]:', payload.images?.[0], 'Type:', typeof payload.images?.[0])
  
  try {
    const response = await apiClient.post('/products', payload)
    console.log('[createListing] Success response:', response.data)
    return response.data.data
  } catch (err: any) {
    console.error('[createListing] Error response:', err.response?.data)
    throw err
  }
}

export const updateListing = async (productId: string, data: any) => {
  const response = await apiClient.patch(`/products/${productId}`, data);
  return response.data.data;
}

export const deleteListing = async (productId: string) => {
  const response = await apiClient.delete(`/products/${productId}`);
  return response.data;
}