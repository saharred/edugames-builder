
import React from 'react'
import { useGameStore } from '@/store/useGameStore'
import { STRINGS } from '@/i18n/strings'

export default function QuizEditor() {
  const { lang, quizItems, addQuiz, updateQuiz, removeQuiz } = useGameStore()
  const S = STRINGS[lang]
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">{S.items}</div>
        <button className="btn btn-primary" onClick={addQuiz}>{S.addItem}</button>
      </div>
      <table className="simple">
        <thead>
          <tr><th>#</th><th>{S.question}</th><th>{S.answer}</th><th></th></tr>
        </thead>
        <tbody>
          {quizItems.map((it, idx) => (
            <tr key={it.id}>
              <td>{idx+1}</td>
              <td><input className="input" value={it.question} onChange={e => updateQuiz(it.id, { question: e.target.value })} /></td>
              <td><input className="input" value={it.answer} onChange={e => updateQuiz(it.id, { answer: e.target.value })} /></td>
              <td><button className="btn" onClick={() => removeQuiz(it.id)}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
