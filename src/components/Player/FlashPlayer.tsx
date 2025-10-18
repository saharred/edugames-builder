
import React, { useState } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { STRINGS } from '@/i18n/strings'

export default function FlashPlayer() {
  const { lang, flashItems } = useGameStore()
  const S = STRINGS[lang]
  const [idx, setIdx] = useState(0)
  const [flip, setFlip] = useState(false)

  if (!flashItems.length) return <div className="text-gray-500">No flashcards.</div>
  const it = flashItems[idx]

  return (
    <div className="text-center">
      <div className="card cursor-pointer" onClick={() => setFlip(f => !f)}>
        <div className="text-2xl min-h-[80px] flex items-center justify-center">{flip ? (it.textBack || '—') : it.textFront}</div>
        <div className="text-xs text-gray-500">{flip ? 'back' : 'front'}</div>
      </div>
      <div className="mt-3 flex justify-center gap-2">
        <button className="btn" onClick={() => { setFlip(false); setIdx(i => Math.max(0, i-1)) }}>{S.back}</button>
        <button className="btn btn-primary" onClick={() => { setFlip(false); setIdx(i => Math.min(flashItems.length-1, i+1)) }}>{S.next}</button>
      </div>
    </div>
  )
}
