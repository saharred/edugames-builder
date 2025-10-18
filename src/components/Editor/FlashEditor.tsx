
import React from 'react'
import { useGameStore } from '@/store/useGameStore'
import { STRINGS } from '@/i18n/strings'

export default function FlashEditor() {
  const { lang, flashItems, addFlash, updateFlash, removeFlash } = useGameStore()
  const S = STRINGS[lang]
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">{S.items}</div>
        <button className="btn btn-primary" onClick={addFlash}>{S.addItem}</button>
      </div>
      <table className="simple">
        <thead>
          <tr><th>#</th><th>{S.prompt}</th><th>Back</th><th></th></tr>
        </thead>
        <tbody>
          {flashItems.map((it, idx) => (
            <tr key={it.id}>
              <td>{idx+1}</td>
              <td><input className="input" value={it.textFront} onChange={e => updateFlash(it.id, { textFront: e.target.value })} /></td>
              <td><input className="input" value={it.textBack||''} onChange={e => updateFlash(it.id, { textBack: e.target.value })} /></td>
              <td><button className="btn" onClick={() => removeFlash(it.id)}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
