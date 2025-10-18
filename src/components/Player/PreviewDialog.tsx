
import React, { useState } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { STRINGS } from '@/i18n/strings'
import QuizPlayer from './QuizPlayer'
import MatchingPlayer from './MatchingPlayer'
import FlashPlayer from './FlashPlayer'

export default function PreviewDialog() {
  const { lang, kind } = useGameStore()
  const S = STRINGS[lang]
  const [open, setOpen] = useState(false)

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{S.playArea}</div>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>{S.preview}</button>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">{S.playArea}</div>
              <button className="btn" onClick={() => setOpen(false)}>{S.done}</button>
            </div>
            {kind === 'quiz' && <QuizPlayer />}
            {kind === 'matching' && <MatchingPlayer />}
            {kind === 'flashcards' && <FlashPlayer />}
          </div>
        </div>
      )}
    </div>
  )
}
