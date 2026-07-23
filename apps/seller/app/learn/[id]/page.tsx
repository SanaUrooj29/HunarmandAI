'use client'

import Link from 'next/link'
import { ArrowLeft, ChevronRight, CheckCircle, Lock } from 'lucide-react'
import { useLesson, useLessonProgress } from '@/features/learning/hooks'
import { Button } from '@/components/seller/ui'
import { useToast } from '@/components/seller/Toast'

export default function LessonPage({ params }: { params: { id: string } }) {
  const { lesson, content, found } = useLesson(params.id)
  const progress = useLessonProgress(params.id)
  const { toast } = useToast()

  if (!found) {
    return (
      <div className="p-6 text-center mt-12">
        <p className="text-5xl mb-4">📚</p>
        <h2 className="font-display font-bold text-xl text-[#2A1F14]">Lesson not found</h2>
        <p className="text-sm text-[#2A1F14]/50 mt-2">This lesson may not be available yet.</p>
        <Link href="/learn" className="inline-block mt-6 text-[#E27D60] font-semibold text-sm hover:underline">
          ← Back to Learn
        </Link>
      </div>
    )
  }

  if (lesson!.locked) {
    return (
      <div className="p-6 text-center mt-12 max-w-sm mx-auto">
        <div className="w-16 h-16 bg-[#F5EBDD] rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={28} className="text-[#2A1F14]/40" />
        </div>
        <h2 className="font-display font-bold text-2xl text-[#2A1F14]">Lesson locked</h2>
        <p className="text-sm text-[#2A1F14]/50 mt-2 leading-relaxed">
          Complete earlier lessons to unlock <strong>{lesson!.title}</strong>.
        </p>
        <Link href="/learn">
          <Button variant="primary" size="lg" className="mt-6">Back to lessons</Button>
        </Link>
      </div>
    )
  }

  const card = content!.cards[progress.cardIdx]
  const cardEmojis = ['💡', '📝', '🎯', '✨', '🌟', '🔑']

  if (progress.completed) {
    return (
      <div className="max-w-sm mx-auto p-6 text-center space-y-5 mt-10">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
          <CheckCircle size={40} className="text-white" />
        </div>
        <div>
          <h2 className="font-display font-bold text-3xl text-[#2A1F14]">Lesson complete!</h2>
          <p className="text-[#2A1F14]/60 mt-2">
            You finished <strong>{lesson!.title}</strong>.
          </p>
        </div>
        {lesson!.badge && (
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold px-5 py-2.5 rounded-full">
            🏅 {lesson!.badge} earned
          </div>
        )}
        <div className="space-y-3 pt-2">
          <Link href="/learn">
            <Button variant="primary" size="lg">Back to lessons</Button>
          </Link>
          <button
            onClick={() => { progress.reset(); toast('Lesson restarted', 'info') }}
            className="block w-full text-sm text-[#2A1F14]/40 hover:text-[#2A1F14] py-2"
          >
            Review again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col" style={{ minHeight: 'calc(100vh - 57px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e6d8cc]">
        <Link href="/learn" className="w-8 h-8 flex items-center justify-center hover:bg-[#F5EBDD] rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-[#2A1F14]" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[#2A1F14]/50 truncate">{lesson!.title}</p>
          <p className="text-xs font-semibold text-[#E27D60]">
            Card {progress.cardIdx + 1} of {progress.totalCards} · {lesson!.duration}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[#e8ddd0]">
        <div
          className="h-full bg-[#E27D60] transition-all duration-500 ease-out"
          style={{ width: `${progress.progress}%` }}
        />
      </div>

      {/* Card dots */}
      <div className="flex gap-1.5 px-6 pt-4">
        {content!.cards.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= progress.cardIdx ? '#E27D60' : '#e8ddd0' }}
          />
        ))}
      </div>

      {/* Card content */}
      <div className="flex-1 px-4 py-5 flex flex-col">
        <div className="bg-white rounded-2xl border border-[#e6d8cc] p-5 shadow-sm flex-1 flex flex-col">
          <div className="w-12 h-12 bg-[#1F7A8C]/10 rounded-2xl flex items-center justify-center mb-4 text-2xl">
            {cardEmojis[progress.cardIdx % cardEmojis.length]}
          </div>
          <h2 className="font-display font-bold text-2xl text-[#2A1F14] leading-tight mb-3">
            {card.title}
          </h2>
          <p className="text-[#2A1F14]/70 leading-relaxed flex-1">{card.body}</p>
          {card.tip && (
            <div className="mt-5 flex gap-2.5 bg-[#F5EBDD] rounded-xl p-3.5">
              <span className="text-lg flex-shrink-0">💬</span>
              <p className="text-sm text-[#2A1F14]/80 italic leading-relaxed">{card.tip}</p>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="mt-5 flex gap-3">
          {!progress.isFirst && (
            <Button variant="secondary" size="md" className="flex-shrink-0 px-4" onClick={progress.prev}>
              ← Back
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={progress.next}
          >
            {progress.isLast ? 'Complete lesson ✓' : (
              <>Next <ChevronRight size={16} /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
