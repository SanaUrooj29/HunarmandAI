// learning/hooks.ts — Micro-learning feature

import { useState } from 'react'
import { useAsync, fakeFetch } from '@/hooks/useAsync'
import { LESSONS, LESSON_CONTENT } from '@/lib/mock-data'

export function useLessons() {
  return useAsync(() => fakeFetch(LESSONS))
}

export function useLesson(id: string) {
  const lesson = LESSONS.find(l => l.id === id)
  const content = LESSON_CONTENT[id]
  return { lesson, content, found: !!lesson && !!content }
}

export function useLessonProgress(lessonId: string) {
  const [cardIdx, setCardIdx] = useState(0)
  const [completed, setCompleted] = useState(false)
  const content = LESSON_CONTENT[lessonId]
  const totalCards = content?.cards.length ?? 0

  const next = () => {
    if (cardIdx < totalCards - 1) setCardIdx(i => i + 1)
    else complete()
  }

  const prev = () => {
    if (cardIdx > 0) setCardIdx(i => i - 1)
  }

  const complete = async () => {
    // In production: POST /api/learning/complete { lessonId }
    await fakeFetch({ lessonId }, 400)
    setCompleted(true)
  }

  const reset = () => { setCardIdx(0); setCompleted(false) }

  return {
    cardIdx,
    totalCards,
    progress: totalCards > 0 ? ((cardIdx + 1) / totalCards) * 100 : 0,
    isFirst: cardIdx === 0,
    isLast: cardIdx === totalCards - 1,
    completed,
    next,
    prev,
    reset,
  }
}
