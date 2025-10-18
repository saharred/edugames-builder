
import React, { useRef } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { STRINGS } from '@/i18n/strings'

export default function JsonIO() {
  const { lang, exportJSON, importJSON } = useGameStore()
  const S = STRINGS[lang]
  const fileRef = useRef<HTMLInputElement>(null)

  const onExport = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' })
    const name = 'game-project.json'
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }

  const onImport = async (f: File) => {
    const text = await f.text()
    importJSON(text)
  }

  return (
    <div className="toolbar">
      <button className="btn" onClick={onExport}>{S.export}</button>
      <input ref={fileRef} type="file" hidden accept=".json,application/json" onChange={(e) => {
        const f = e.target.files?.[0]
        if (f) onImport(f)
        e.currentTarget.value = ''
      }} />
      <button className="btn" onClick={() => fileRef.current?.click()}>{S.import}</button>
    </div>
  )
}
