'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Zap, Camera, Image, RotateCcw, CheckCircle, Loader2, ChevronRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/seller/ui'
import Link from 'next/link'
import { createListing, generateAiListing, uploadListingImage } from '@/lib/api/seller-listings'
import { getCategories, type Category } from '@/lib/api/seller-categories'

type Step = 'capture' | 'processing' | 'review' | 'published'

interface AIResult {
  titleEnglish: string
  titleUrdu: string
  descriptionEnglish: string
  descriptionUrdu: string
  suggestedCategory: string
  suggestedPriceMinPKR: number
  suggestedPriceMaxPKR: number
  suggestedTags: string[]
}

const processingSteps = [
  { key: 'analyze', label: 'Analyzing image' },
  { key: 'classify', label: 'Identifying category' },
  { key: 'write', label: 'Writing your listing in Urdu + English' },
  { key: 'price', label: 'Suggesting a fair price' },
]

export default function NewListingPage() {
  const [step, setStep] = useState<Step>('capture')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [aiResult, setAiResult] = useState<AIResult | null>(null)

  useEffect(() => {
    return () => {
      photoPreviews.forEach((preview) => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview)
        }
      })
    }
  }, [photoPreviews])
  const [aiError, setAiError] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [titleEn, setTitleEn] = useState('')
  const [titleUr, setTitleUr] = useState('')
  const [descEn, setDescEn] = useState('')
  const [descUr, setDescUr] = useState('')
  const [price, setPrice] = useState(0)
  const [qty, setQty] = useState(1)
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null)
  const [suggestedCategoryName, setSuggestedCategoryName] = useState('')
  const [publishError, setPublishError] = useState<string | null>(null)

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const incoming = Array.from(files).slice(0, 3 - selectedFiles.length)
    if (!incoming.length) return

    const newPreviews = incoming.map((file) => URL.createObjectURL(file))
    setSelectedFiles((prev) => [...prev, ...incoming])
    setPhotoPreviews((prev) => [...prev, ...newPreviews])
  }

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    addFiles(files)
    startProcessing(files[0])
    e.target.value = ''
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        console.error('Failed to load categories:', err)
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (!suggestedCategoryName || !categories.length) return
    const normalized = suggestedCategoryName.toLowerCase()
    const match = categories.find((cat) => cat.name.toLowerCase() === normalized)
    if (match) {
      setCategory(match._id)
    }
  }, [suggestedCategoryName, categories])

  const startProcessing = async (file: File) => {
    setStep('processing')
    setAiError(null)

    try {
      const result = await generateAiListing(file)
      setAiImageUrl(result.imageUrl || null)

      if (result.suggestion) {
        setAiResult(result.suggestion)
        setTitleEn(result.suggestion.titleEnglish)
        setTitleUr(result.suggestion.titleUrdu)
        setDescEn(result.suggestion.descriptionEnglish)
        setDescUr(result.suggestion.descriptionUrdu)
        setPrice(result.suggestion.suggestedPriceMinPKR)
        setSuggestedCategoryName(result.suggestion.suggestedCategory)
      } else {
        setAiError(result.aiError || 'Could not generate AI suggestions. Please fill in details manually.')
      }
      setStep('review')
    } catch (err: any) {
      console.error('AI generation error:', err)
      setAiError(err.response?.data?.message || err.message || 'Failed to process image. Please try again.')
      setStep('review')
    }
  }

  const validatePublish = () => {
    if (selectedFiles.length === 0) {
      return 'Please upload at least one product photo before publishing.'
    }

    if (selectedFiles.length > 3) {
      return 'You can upload a maximum of 3 product photos.'
    }

    if (!category) {
      return 'Please select a category.'
    }

    if (!titleEn.trim()) {
      return 'Title is required.'
    }

    if (!descEn.trim() || descEn.trim().length < 10) {
      return 'Description must be at least 10 characters.'
    }

    if (Number(price) <= 0 || Number.isNaN(Number(price))) {
      return 'Price must be greater than zero.'
    }

    if (Number(qty) <= 1 || Number(qty) >= 500 || Number.isNaN(Number(qty))) {
      return 'Quantity must be greater than 1 and less than 500.'
    }

    return null
  }

  const handlePublish = async () => {
    setPublishError(null)
    const validationError = validatePublish()
    if (validationError) {
      setPublishError(validationError)
      return
    }

    setIsPublishing(true)
    try {
      const imageUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          return await uploadListingImage(file)
        })
      )
      
      console.log('[handlePublish] imageUrls array:', imageUrls)
      console.log('[handlePublish] imageUrls length:', imageUrls.length)
      imageUrls.forEach((url, idx) => {
        console.log(`[handlePublish] imageUrls[${idx}]:`, url, 'Type:', typeof url)
      })

      await createListing({
        title: titleEn,
        description: descEn,
        categoryId: category,
        price: Number(price),
        quantity: Number(qty),
        images: imageUrls,
        stockStatus: 'in_stock',
        isAiGenerated: !!aiResult,
        tags: aiResult?.suggestedTags || [],
      })
      setStep('published')
    } catch (err: any) {
      console.error('Publish error:', err)
      const message = err?.response?.data?.message || err.message || 'Failed to publish listing. Please try again.'
      setPublishError(message)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f4ede3]">
      {/* Step indicator */}
      {step !== 'published' && (
        <div className="sticky top-0 z-20 bg-[#f4ede3]/90 backdrop-blur-sm border-b border-[#e6d8cc] px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard">
            <X size={20} className="text-[#2A1F14]/60" />
          </Link>
          <p className="text-xs font-semibold text-[#1F7A8C] uppercase tracking-wider">
            {step === 'capture' && 'Step 1 of 3 · Take photo'}
            {step === 'processing' && 'Step 2 of 3'}
            {step === 'review' && 'Step 3 of 3 · Review'}
          </p>
          {step === 'capture' && <Zap size={18} className="text-[#2A1F14]/40" />}
          {step !== 'capture' && <div className="w-5" />}
        </div>
      )}

      {/* ── Step 1: Capture ── */}
      {step === 'capture' && (
        <div className="flex flex-col h-[calc(100vh-57px)]">
          <div className="flex-1 bg-black relative flex items-center justify-center">
            {/* Camera viewfinder */}
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-white/10 rounded-3xl border-2 border-white/30" />
              {/* Corner brackets */}
              {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
                <div key={pos} className={`absolute w-8 h-8 border-white border-2 ${
                  pos.includes('top') ? 'top-0' : 'bottom-0'
                } ${pos.includes('left') ? 'left-0 border-r-0 border-b-0' : 'right-0 border-l-0 border-b-0'} ${
                  pos.includes('bottom') ? (pos.includes('left') ? 'border-r-0 border-t-0' : 'border-l-0 border-t-0') : ''
                }`} />
              ))}
            </div>

            {/* Tip */}
            <div className="absolute bottom-8 left-4 right-4">
              <div className="bg-[#1F7A8C] rounded-xl px-4 py-3 flex items-start gap-2">
                <Zap size={14} className="text-white mt-0.5 flex-shrink-0" />
                <p className="text-white text-sm">Use a plain background — AI works better with clean shots</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-black pb-8 px-4 pt-4 flex items-center justify-between">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Image size={20} className="text-white" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 bg-[#E27D60] rounded-full flex items-center justify-center shadow-lg shadow-[#E27D60]/40 hover:bg-[#c85c3a] transition-colors active:scale-95"
            >
              <div className="w-12 h-12 border-2 border-white rounded-full" />
            </button>

            <button className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
              <RotateCcw size={20} className="text-white" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
            onChange={handlePhotoCapture}
          />
        </div>
      )}

      {/* ── Step 2: Processing ── */}
      {step === 'processing' && (
        <div className="p-6 max-w-md mx-auto mt-8 space-y-6">
          {/* Photo preview */}
          {photoPreviews[0] ? (
            <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden shadow-lg">
              <img src={photoPreviews[0]} alt="Product" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-48 h-48 mx-auto rounded-2xl bg-[#F5EBDD] skeleton" />
          )}

          <div className="text-center">
            <h2 className="font-display font-bold text-2xl text-[#2A1F14]">Saheli AI is looking…</h2>
            <p className="text-[#2A1F14]/50 text-sm mt-1">This usually takes under 10 seconds</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e6d8cc] p-5 space-y-4">
            {processingSteps.map((s, i) => {
              const active = i === 0
              return (
                <div key={s.key} className="flex items-center gap-3">
                  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                    {active ? (
                      <Loader2 size={20} className="text-[#E27D60] animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[#e6d8cc]" />
                    )}
                  </div>
                  <p className={`text-sm ${active ? 'text-[#2A1F14] font-medium' : 'text-[#2A1F14]/40'}`}>
                    {s.label}
                  </p>
                </div>
              )
            })}
          </div>

          <p className="text-center text-xs text-[#2A1F14]/40">Powered by Google Gemini · vision</p>
        </div>
      )}

      {/* ── Step 3: Review ── */}
      {step === 'review' && aiResult && (
        <div className="p-4 max-w-lg mx-auto space-y-5 pb-32">
          {/* Photos */}
          <div className="flex gap-3 flex-wrap">
            {photoPreviews.length > 0 ? (
              photoPreviews.map((preview, index) => (
                <div key={`${preview}-${index}`} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#E27D60]">
                  <img src={preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreviews((prev) => prev.filter((_, idx) => idx !== index))
                      setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index))
                    }}
                    className="absolute top-1 right-1 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-[#2A1F14] shadow-sm"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="w-24 h-24 rounded-xl bg-[#F5EBDD]" />
            )}

            {selectedFiles.length < 3 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-[#e6d8cc] flex flex-col items-center justify-center gap-1 hover:border-[#1F7A8C] transition-colors"
              >
                <span className="text-2xl text-[#2A1F14]/30">+</span>
                <span className="text-xs text-[#2A1F14]/40">Add photo</span>
              </button>
            )}
          </div>
          <p className="text-xs text-[#2A1F14]/40 mt-2">Upload 1 to 3 product photos for best results.</p>

          {/* AI notice */}
          {(aiError || publishError) && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{publishError || aiError}</p>
            </div>
          )}
          {!aiError && !publishError && aiResult && (
            <div className="flex items-start gap-2 bg-[#E27D60]/5 border border-[#E27D60]/20 rounded-xl p-3">
              <AlertCircle size={16} className="text-[#E27D60] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#2A1F14]/70">AI generated this listing — review and edit anything before publishing.</p>
            </div>
          )}

          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider">Category</label>
              {aiResult && <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">AI suggested</span>}
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white border border-[#e6d8cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1F7A8C] appearance-none">
              <option value="">Select a category</option>
              {categoriesLoading ? (
                <option value="" disabled>Loading categories...</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))
              )}
            </select>
          </div>

          {/* Title English */}
          <div>
            <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider block mb-1.5">Title (English)</label>
            <input
              type="text"
              value={titleEn}
              onChange={e => setTitleEn(e.target.value)}
              className="w-full bg-white border border-[#e6d8cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1F7A8C]"
            />
          </div>

          {/* Title Urdu */}
          <div>
            <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider block mb-1.5">عنوان (اردو)</label>
            <textarea
              value={titleUr}
              onChange={e => setTitleUr(e.target.value)}
              className="w-full bg-white border border-[#e6d8cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1F7A8C] font-urdu text-right resize-none"
              rows={2}
            />
          </div>

          {/* Description English */}
          <div>
            <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider block mb-1.5">Description (English)</label>
            <textarea
              value={descEn}
              onChange={e => setDescEn(e.target.value)}
              className="w-full bg-white border border-[#e6d8cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1F7A8C] resize-none"
              rows={4}
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider block mb-1.5">Price (PKR)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#2A1F14]/50">PKR</span>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                min={1}
                step={1}
                className="w-full bg-white border border-[#e6d8cc] rounded-xl pl-14 pr-4 py-3 text-sm focus:outline-none focus:border-[#1F7A8C] font-semibold"
              />
            </div>
            <p className="text-xs text-[#2A1F14]/40 mt-1">AI suggested price based on similar listings</p>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider block mb-1.5">Quantity in stock</label>
            <input
              type="number"
              value={qty}
              onChange={e => {
                const value = Number(e.target.value)
                if (Number.isNaN(value)) {
                  setQty(1)
                } else {
                  setQty(Math.min(500, Math.max(1, value)))
                }
              }}
              min={1}
              max={500}
              step={1}
              className="w-full bg-white border border-[#e6d8cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1F7A8C]"
            />
          </div>

          {/* Sticky footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#f4ede3]/95 backdrop-blur-sm border-t border-[#e6d8cc] p-4 flex gap-3">
            <Button variant="secondary" size="md" className="flex-1">Save draft</Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? <Loader2 size={16} className="animate-spin" /> : null}
              {isPublishing ? 'Publishing…' : 'Publish'}
            </Button>
          </div>
        </div>
      )}

      {/* ── Published ── */}
      {step === 'published' && (
        <div className="p-6 max-w-md mx-auto mt-16 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <CheckCircle size={40} className="text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-3xl text-[#2A1F14]">Your product is live!</h2>
            <p className="text-[#2A1F14]/60 mt-2">Phulkari Dupatta is now visible to buyers. Share your storefront to reach more people.</p>
          </div>

          <div className="bg-white border border-[#e6d8cc] rounded-2xl p-4 flex items-center gap-3">
            <div className="flex-1 text-left">
              <p className="text-xs text-[#2A1F14]/50 uppercase tracking-wider font-medium">Your Storefront</p>
              <p className="text-[#E27D60] font-semibold text-sm mt-0.5">hunarmand.ai/fatima-aslam</p>
            </div>
            <button className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center text-white text-lg">
              📱
            </button>
          </div>

          <Button variant="secondary" size="lg">Copy link</Button>

          <Button variant="primary" size="lg" onClick={() => setStep('capture')}>
            <Camera size={18} />
            Add another product
          </Button>

          <Link href="/dashboard" className="block text-sm text-[#2A1F14]/50 hover:text-[#2A1F14]">
            Back to home
          </Link>
        </div>
      )}
    </div>
  )
}
