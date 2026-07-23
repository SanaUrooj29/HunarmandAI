'use client'

import { useState } from 'react'
import { Camera, ChevronRight, Shield, Globe, Bell, Lock } from 'lucide-react'
import { Button } from '@/components/seller/ui'
import { useToast } from '@/components/seller/Toast'
import { useAsync } from '@/hooks/useAsync'
import { getProfile, updateProfile } from '@/lib/api/seller-profile'
import Link from 'next/link'
import clsx from 'clsx'
import { useEffect } from 'react'

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Multan', 'Faisalabad', 'Peshawar', 'Quetta', 'Other']
const CATEGORIES = [
  'Jewellery', 'Handicrafts', 'Food Items (Preservable)', 'Food Items (Instant Delivery)', 
  'Seeds', 'Vegetables', 'Fruits', 'Fragrances', 'Flowers', 
  'Clothing (Shawls, Kurtas, Dresses)', 'Stones'
]

export default function ProfilePage() {
  const { toast } = useToast()
  const { data: seller, loading, error, refetch } = useAsync(async () => {
    try {
      const res = await getProfile()
      console.log('[profile page] getProfile response:', res)
      return res
    } catch (err) {
      console.error('[profile page] getProfile error:', err)
      throw err
    }
  })

  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [cats, setCats] = useState<string[]>([])
  const [shopDesc, setShopDesc] = useState('')
  const [socialLinks, setSocialLinks] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (seller) {
      setName(seller.username || '')
      setCity(seller.city || '')
      setCats(seller.productCategory ? [seller.productCategory] : [])
      setShopDesc(seller.shopDescription || '')
      setSocialLinks(Array.isArray(seller.socialMediaLinks) ? seller.socialMediaLinks.join(', ') : '')
    }
  }, [seller])

  const toggleCat = (cat: string) => {
    setIsDirty(true)
    setCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : prev.length < 3 ? [...prev, cat] : prev
    )
  }

  const handleSave = async () => {
    if (!name.trim()) { toast('Please enter your name', 'error'); return }
    setIsSaving(true)
    try {
      await updateProfile({ fullName: name })
      await updateStoreProfile({ city, productCategories: cats, shopDescription: shopDesc, socialLinks })
      toast('Profile saved successfully!', 'success')
      setIsDirty(false)
      refetch()
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to update profile', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading profile...</div>

  if (error) return <div className="p-8 text-center text-red-600">Error loading profile: {error.message}</div>

  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'FA'

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-4 border-b border-[#e6d8cc] flex items-center justify-between">
        <h1 className="font-display font-bold text-xl text-[#2A1F14]">My account</h1>
        <Link href="/settings"
          className="w-9 h-9 bg-white border border-[#e6d8cc] rounded-xl flex items-center justify-center hover:border-[#1F7A8C] transition-colors">
          <ChevronRight size={16} className="text-[#2A1F14]/50" />
        </Link>
      </div>

      <div className="p-4 space-y-6 pb-32">
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-[#e6d8cc] p-5">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1F7A8C] to-[#E27D60] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#1F7A8C] rounded-full flex items-center justify-center shadow-sm border-2 border-white hover:bg-[#17606f] transition-colors">
                <Camera size={12} className="text-white" />
              </button>
            </div>
            <div>
              <p className="font-semibold text-[#2A1F14]">{name || 'Your name'}</p>
              <p className="text-sm text-[#2A1F14]/50">{seller?.phone} · {city}</p>
              <p className="text-sm text-[#2A1F14]/50">CNIC: {seller?.cnicMasked || '••••••••••••'}</p>
              {seller?.verificationStatus === 'verified' && (
                <p className="text-xs text-[#1F7A8C] font-medium mt-0.5 flex items-center gap-1">
                  <Shield size={10} />Verified seller
                </p>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5 mb-4">
            <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider">Your Name</label>
            <input type="text" value={name}
              onChange={e => { setName(e.target.value); setIsDirty(true) }}
              className="w-full bg-[#f4ede3] border border-[#e6d8cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1F7A8C] focus:ring-1 focus:ring-[#1F7A8C]/10 transition-all" />
          </div>

          {/* City */}
          <div className="space-y-2 mb-4">
            <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider">City</label>
            <div className="flex flex-wrap gap-2">
              {CITIES.map(c => (
                <button key={c} onClick={() => { setCity(c); setIsDirty(true) }}
                  className={clsx(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                    city === c ? 'bg-[#E27D60] text-white' : 'bg-[#F5EBDD] text-[#2A1F14] hover:bg-[#E27D60]/20'
                  )}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider">
              What do you make? <span className="normal-case font-normal">(up to 3)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => toggleCat(cat)}
                  className={clsx(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                    cats.includes(cat)
                      ? 'bg-[#1F7A8C] text-white'
                      : cats.length >= 3
                      ? 'bg-[#F5EBDD] text-[#2A1F14]/40 cursor-not-allowed'
                      : 'bg-[#F5EBDD] text-[#2A1F14] hover:bg-[#1F7A8C]/20'
                  )}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Shop Description */}
          <div className="space-y-1.5 mt-4">
            <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider">Shop Description</label>
            <textarea value={shopDesc}
              onChange={e => { setShopDesc(e.target.value); setIsDirty(true) }}
              rows={3}
              className="w-full bg-[#f4ede3] border border-[#e6d8cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1F7A8C] focus:ring-1 focus:ring-[#1F7A8C]/10 transition-all resize-none" />
          </div>

          {/* Social Media Links */}
          <div className="space-y-1.5 mt-4">
            <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider">Social Media Links (Optional)</label>
            <input type="text" value={socialLinks}
              onChange={e => { setSocialLinks(e.target.value); setIsDirty(true) }}
              placeholder="e.g. instagram.com/myshop"
              className="w-full bg-[#f4ede3] border border-[#e6d8cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1F7A8C] focus:ring-1 focus:ring-[#1F7A8C]/10 transition-all" />
          </div>
        </div>

        {/* Wallet section */}
        <div className="bg-white rounded-2xl border border-[#e6d8cc] p-5">
          <h2 className="font-semibold text-[#2A1F14] mb-4">Wallet & payouts</h2>
          <div className="space-y-3">
            {[
              { abbr: 'JC', name: 'JazzCash', last4: '7890', verified: true, color: 'bg-red-500' },
              { abbr: 'EP', name: 'EasyPaisa', last4: null, verified: false, color: 'bg-emerald-500' },
              { abbr: 'CC', name: 'Credit Card', last4: null, verified: false, color: 'bg-blue-500' },
            ].map(w => (
              <div key={w.name} className="flex items-center justify-between p-3 bg-[#f4ede3] rounded-xl border border-[#e6d8cc]">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${w.color} rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {w.abbr}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2A1F14]">{w.name}</p>
                    <p className="text-xs text-[#2A1F14]/40">{w.last4 ? `···· ${w.last4} · Verified` : 'Not linked'}</p>
                  </div>
                </div>
                {w.verified
                  ? <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">● Active</span>
                  : <button onClick={() => toast(`Opening ${w.name} linking flow…`, 'info')}
                      className="text-xs font-semibold border border-[#e6d8cc] px-3 py-1.5 rounded-lg hover:border-[#1F7A8C] hover:text-[#1F7A8C] transition-colors">
                      Link
                    </button>
                }
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm text-[#2A1F14]/60">Pending payout</p>
                <p className="font-display font-bold text-xl text-[#2A1F14]">PKR 4,200</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#2A1F14]/50">Next payout</p>
                <p className="text-sm font-semibold text-[#2A1F14]">Tue, 6 May</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-[#e6d8cc] overflow-hidden">
          {[
            { icon: Globe, label: 'Language', value: 'English', href: '/settings' },
            { icon: Bell, label: 'Notifications', value: 'On', href: '/settings' },
            { icon: Lock, label: 'Privacy & data', value: '', href: '/settings' },
          ].map(({ icon: Icon, label, value, href }) => (
            <Link key={label} href={href}
              className="flex items-center gap-4 w-full px-4 py-3.5 border-b border-[#e6d8cc] last:border-0 hover:bg-[#f4ede3] transition-colors">
              <Icon size={16} className="text-[#2A1F14]/40 flex-shrink-0" />
              <span className="flex-1 text-sm text-[#2A1F14] font-medium">{label}</span>
              <span className="text-sm text-[#2A1F14]/40">{value}</span>
              <ChevronRight size={14} className="text-[#2A1F14]/30 flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#f4ede3]/95 backdrop-blur-sm border-t border-[#e6d8cc] p-4">
        <Button variant="primary" size="lg" onClick={handleSave} disabled={isSaving || !isDirty}
          className={!isDirty ? 'opacity-50' : ''}>
          {isSaving ? 'Saving…' : isDirty ? 'Save changes' : 'Up to date ✓'}
        </Button>
      </div>
    </div>
  )
}
