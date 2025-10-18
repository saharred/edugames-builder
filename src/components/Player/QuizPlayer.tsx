
import React, { useMemo, useState } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { STRINGS } from '@/i18n/strings'

export default function QuizPlayer() {
  const { lang, quizItems } = useGameStore()
  const S = STRINGS[lang]
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const item = quizItems[idx]
  const finished = idx >= quizItems.length

  const check = () => {
    if (!item) return
    setAttempts(a => a + 1)
    if (input.trim() === item.answer.trim()) {
      setScore(s => s + 1)
      setIdx(i => i + 1)
      setInput('')
      alert(S.correct)
    } else {
      alert(S.wrong)
    }
  }

  if (!quizItems.length) return <div className="text-gray-500">No quiz items.</div>
  if (finished) {
    return (
      <div className="text-center">
        <div className="text-2xl font-bold mb-2">{S.score}: {score}/{attempts}</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-2">{item.question}</div>
      <div className="flex gap-2">
        <input className="input" value={input} onChange={e => setInput(e.target.value)} placeholder={S.answer} />
        <button className="btn btn-primary" onClick={check}>{S.next}</button>
      </div>
      <div className="mt-2 text-sm text-gray-600">{S.attempts}: {attempts} • {S.score}: {score}</div>
    </div>
  )
}
