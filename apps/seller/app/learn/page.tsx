'use client'

import { CheckCircle, ChevronRight, Clock, Lock } from 'lucide-react'
import { Badge, SkeletonCard } from '@/components/seller/ui'
import { useAsync, fakeFetch } from '@/hooks/useAsync'
import { LESSONS } from '@/lib/mock-data'
import Link from 'next/link'

export default function LearnPage() {
  const { data: lessons, loading } = useAsync(() => fakeFetch(LESSONS))

  const done = (lessons ?? []).filter(l => l.done).length
  const total = (lessons ?? []).length
  const badges = (lessons ?? []).filter(l => l.done && l.badge).length
  const minutes = (lessons ?? []).reduce((sum, l) => l.done ? sum + parseInt(l.duration) : sum, 0)
  const suggested = (lessons ?? []).find(l => !l.done && !l.locked && l.isNew) ?? (lessons ?? []).find(l => !l.done && !l.locked)

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 space-y-4 max-w-content mx-auto">
        <div className="skeleton rounded-2xl h-36" />
        <SkeletonCard />
        {[1,2,3].map(i => <SkeletonCard key={i} />)}
      </div>
    )
  }

  return (
    <div className="max-w-content mx-auto p-4 md:p-6 lg:p-8 space-y-5 lg:max-w-3xl">
      {/* Progress card */}
      <div className="bg-[#E27D60] rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
        <p className="text-xs font-medium uppercase tracking-wider text-white/70">Your Progress</p>
        <div className="flex items-end justify-between mt-1">
          <div>
            <p className="font-display font-bold text-3xl">{done} of {total} lessons</p>
            <p className="text-white/70 text-sm mt-1">🏅 {badges} badge{badges !== 1 ? 's' : ''} · ⏱ {minutes} min total</p>
          </div>
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="white" strokeWidth="3"
                strokeDasharray={`${(done / Math.max(total, 1)) * 100} 100`} strokeLinecap="round" />
            </svg>
            <p className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
              {Math.round((done / Math.max(total, 1)) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Suggested */}
      {suggested && (
        <div>
          <h2 className="font-semibold text-[#2A1F14] mb-3">Suggested for you</h2>
          <div className="bg-[#F5EBDD] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge>{suggested.isNew ? 'NEW · UNLOCKED' : 'SUGGESTED'}</Badge>
              <span className="text-xs text-[#2A1F14]/50 flex items-center gap-1"><Clock size={10} />{suggested.duration}</span>
            </div>
            <h3 className="font-display font-bold text-xl text-[#2A1F14]">{suggested.title}</h3>
            <p className="text-sm text-[#2A1F14]/60 mt-1 leading-relaxed">{suggested.sub}</p>
            <div className="flex gap-3 mt-4">
              <Link href={`/learn/${suggested.id}`}
                className="flex-1 bg-[#E27D60] text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-[#c85c3a] transition-colors text-center">
                Start lesson
              </Link>
              <button className="px-4 text-sm text-[#2A1F14]/50 font-medium hover:text-[#2A1F14] transition-colors">Later</button>
            </div>
          </div>
        </div>
      )}

      {/* All lessons */}
      <div>
        <h2 className="font-semibold text-[#2A1F14] mb-3">All lessons</h2>
        <div className="space-y-2">
          {lessons!.map(lesson => (
            <div key={lesson.id}
              className={`flex items-center gap-4 bg-white rounded-xl border p-4 transition-all ${
                lesson.locked ? 'border-[#e6d8cc] opacity-60 cursor-not-allowed' :
                'border-[#e6d8cc] hover:border-[#1F7A8C] hover:shadow-sm cursor-pointer'
              }`}>
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                {lesson.done ? (
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <CheckCircle size={20} className="text-emerald-500" />
                  </div>
                ) : lesson.locked ? (
                  <div className="w-10 h-10 bg-[#F5EBDD] rounded-xl flex items-center justify-center">
                    <Lock size={16} className="text-[#2A1F14]/40" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-[#1F7A8C]/10 rounded-xl flex items-center justify-center text-xl">📖</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-[#2A1F14] text-sm">{lesson.title}</p>
                  {lesson.isNew && !lesson.done && <Badge>NEW</Badge>}
                </div>
                <p className="text-xs text-[#2A1F14]/50 mt-0.5">{lesson.sub}</p>
                {lesson.badge && lesson.done && (
                  <p className="text-xs text-emerald-600 font-medium mt-1">🏅 {lesson.badge} earned</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-[#2A1F14]/40">{lesson.duration}</span>
                {!lesson.locked && (
                  lesson.done
                    ? <Link href={`/learn/${lesson.id}`} className="text-xs text-[#1F7A8C] font-medium hover:underline">Review</Link>
                    : <Link href={`/learn/${lesson.id}`}><ChevronRight size={16} className="text-[#2A1F14]/30" /></Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
