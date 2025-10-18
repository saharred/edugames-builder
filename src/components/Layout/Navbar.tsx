
import React from 'react'
import { useGameStore } from '@/store/useGameStore'
import { STRINGS } from '@/i18n/strings'

export default function Navbar() {
  const { lang, setLang, title } = useGameStore()
  const S = STRINGS[lang]
  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-bold text-lg">{S.appTitle}</div>
        <div className="flex items-center gap-2">
          <span className="badge">{title || '—'}</span>
          <button className="btn" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>
            {lang === 'ar' ? S.english : S.arabic}
          </button>
        </div>
      </div>
    </div>
  )
}
