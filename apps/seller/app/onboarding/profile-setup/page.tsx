'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Loader2, User } from 'lucide-react'
import clsx from 'clsx'
import { updateProfile, uploadProfilePicture } from '@/lib/api/seller-profile'
import { getCategories, type Category } from '@/lib/api/seller-categories'

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Multan', 'Faisalabad', 'Peshawar', 'Quetta', 'Other']

export default function ProfileSetupPage() {
  const [username, setUsername] = useState('')
  const [cnic, setCnic] = useState('')
  const [shopName, setShopName] = useState('')
  const [city, setCity] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadingPicture, setUploadingPicture] = useState(false)
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (err: any) {
        console.error('Failed to fetch categories:', err)
        setErrors({ categories: 'Failed to load categories' })
      } finally {
        setCategoriesLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handlePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setErrors(p => ({ ...p, picture: 'Please select an image file' }))
      return
    }

    setUploadingPicture(true)
    try {
      const result = await uploadProfilePicture(file)
      setProfilePictureUrl(result.url)
      setErrors(p => ({ ...p, picture: '' }))
    } catch (err: any) {
      console.error('Failed to upload picture:', err)
      setErrors(p => ({
        ...p,
        picture:
          err.response?.data?.message ||
          err.message ||
          'Failed to upload picture',
      }))
    } finally {
      setUploadingPicture(false)
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // CNIC: Extract only digits and enforce 13-digit limit
  const formatCnic = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 13)
    return digitsOnly
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!username.trim()) e.username = 'Please enter your name'
    if (!shopName.trim()) e.shopName = 'Please enter your shop name'
    if (cnic.length !== 13) e.cnic = 'CNIC must be 13 digits'
    if (!city) e.city = 'Please select your city'
    if (!selectedCategory) e.category = 'Please select your product category'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleStart = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      // Map all fields correctly to backend schema
      await updateProfile({
        username, // backend expects "username", not "fullName"
        cnic,
        shopName,
        city,
        productCategory: selectedCategory, // single ObjectId, not array
      })
      if (typeof window !== 'undefined') {
        document.cookie = 'hunarmand_onboarded=true; path=/; max-age=86400'
        localStorage.setItem('hunarmand_seller_name', username)
        localStorage.setItem('hunarmand_seller_city', city)
      }
      router.push('/dashboard')
    } catch (err: any) {
      setErrors({ submit: err.response?.data?.message || 'Failed to update profile' })
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-6 max-w-sm mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold text-[#E27D60] uppercase tracking-wider">Step 2 of 2</p>
        <h1 className="font-display font-bold text-3xl text-[#2A1F14] mt-1">Tell us about you</h1>
        <p className="text-[#2A1F14]/50 mt-1">Buyers see this on your storefront.</p>
      </div>

      {(errors.submit || errors.picture) && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
          {errors.submit || errors.picture}
        </div>
      )}

      <div className="flex-1 space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            {profilePictureUrl ? (
              <img
                src={profilePictureUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-[#1F7A8C] to-[#E27D60] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {username ? username.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : <User size={32} />}
              </div>
            )}
            <button
              onClick={handlePictureClick}
              disabled={uploadingPicture}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#E27D60] rounded-full flex items-center justify-center shadow-sm border-2 border-white hover:bg-[#c85c3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingPicture ? <Loader2 size={14} className="text-white animate-spin" /> : <Camera size={14} className="text-white" />}
            </button>
          </div>
          {errors.picture && <p className="text-red-500 text-xs mt-2 text-center">{errors.picture}</p>}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
            className="hidden"
          />
        </div>

        {/* Submit Error */}
        {errors.submit && <p className="text-center text-red-500 text-sm">{errors.submit}</p>}

        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider">Your Name</label>
          <input
            type="text"
            placeholder="e.g. Fatima Aslam"
            value={username}
            onChange={e => { setUsername(e.target.value); setErrors(p => ({ ...p, username: '' })) }}
            className={clsx(
              'w-full bg-white border-2 rounded-2xl px-4 py-3 text-base outline-none transition-colors',
              errors.username ? 'border-red-400' : 'border-[#e6d8cc] focus:border-[#1F7A8C]'
            )}
          />
          {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
        </div>

        {/* Shop Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider">Shop Name</label>
          <input
            type="text"
            placeholder="e.g. Fatima's Traditional Crafts"
            value={shopName}
            onChange={e => { setShopName(e.target.value); setErrors(p => ({ ...p, shopName: '' })) }}
            className={clsx(
              'w-full bg-white border-2 rounded-2xl px-4 py-3 text-base outline-none transition-colors',
              errors.shopName ? 'border-red-400' : 'border-[#e6d8cc] focus:border-[#1F7A8C]'
            )}
          />
          {errors.shopName && <p className="text-red-500 text-xs">{errors.shopName}</p>}
        </div>

        {/* CNIC */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider">CNIC Number</label>
          <input
            type="text"
            placeholder="e.g. 3520112223334 (13 digits)"
            value={cnic}
            onChange={e => { setCnic(formatCnic(e.target.value)); setErrors(p => ({ ...p, cnic: '' })) }}
            maxLength={13}
            className={clsx(
              'w-full bg-white border-2 rounded-2xl px-4 py-3 text-base outline-none transition-colors',
              errors.cnic ? 'border-red-400' : 'border-[#e6d8cc] focus:border-[#1F7A8C]'
            )}
          />
          {errors.cnic && <p className="text-red-500 text-xs">{errors.cnic}</p>}
          <p className="text-xs text-[#2A1F14]/40">Required for seller verification</p>
        </div>

        {/* City */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider">City</label>
          <div className="flex flex-wrap gap-2">
            {CITIES.map(c => (
              <button key={c} onClick={() => { setCity(c); setErrors(p => ({ ...p, city: '' })) }}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  city === c ? 'bg-[#E27D60] text-white' : 'bg-white border border-[#e6d8cc] text-[#2A1F14] hover:border-[#E27D60]'
                )}>
                {c}
              </button>
            ))}
          </div>
          {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
        </div>

        {/* Product Category - Single Select */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider">
            Select your primary category
          </label>
          {categoriesLoading ? (
            <p className="text-[#2A1F14]/50 text-sm">Loading categories...</p>
          ) : categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat._id} onClick={() => { setSelectedCategory(cat._id); setErrors(p => ({ ...p, category: '' })) }}
                  className={clsx(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                    selectedCategory === cat._id
                      ? 'bg-[#1F7A8C] text-white'
                      : 'bg-white border border-[#e6d8cc] text-[#2A1F14] hover:border-[#1F7A8C]'
                  )}>
                  {cat.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-red-500 text-xs">{errors.categories || 'No categories available'}</p>
          )}
          {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={loading}
        className="mt-8 w-full bg-[#E27D60] disabled:bg-[#E27D60]/50 hover:bg-[#c85c3a] active:scale-[0.98] transition-all text-white font-semibold text-base py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#E27D60]/20"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? 'Setting up your store…' : 'Start Selling'}
      </button>
    </div>
  )
}
