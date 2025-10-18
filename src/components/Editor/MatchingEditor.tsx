
import React from 'react'
import { useGameStore } from '@/store/useGameStore'
import { STRINGS } from '@/i18n/strings'

export default function MatchingEditor() {
  const { lang, matchItems, addMatch, updateMatch, removeMatch } = useGameStore()
  const S = STRINGS[lang]
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">{S.items}</div>
        <button className="btn btn-primary" onClick={addMatch}>{S.addItem}</button>
      </div>
      <table className="simple">
        <thead>
          <tr><th>#</th><th>{S.term}</th><th>{S.definition}</th><th></th></tr>
        </thead>
        <tbody>
          {matchItems.map((it, idx) => (
            <tr key={it.id}>
              <td>{idx+1}</td>
              <td><input className="input" value={it.term} onChange={e => updateMatch(it.id, { term: e.target.value })} /></td>
              <td><input className="input" value={it.definition} onChange={e => updateMatch(it.id, { definition: e.target.value })} /></td>
              <td><button className="btn" onClick={() => removeMatch(it.id)}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
