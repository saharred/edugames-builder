
import React from 'react'
import Navbar from '@/components/Layout/Navbar'
import SettingsPanel from '@/components/Editor/SettingsPanel'
import QuizEditor from '@/components/Editor/QuizEditor'
import MatchingEditor from '@/components/Editor/MatchingEditor'
import FlashEditor from '@/components/Editor/FlashEditor'
import PreviewDialog from '@/components/Player/PreviewDialog'
import JsonIO from '@/components/Controls/JsonIO'
import { useGameStore } from '@/store/useGameStore'
import { STRINGS } from '@/i18n/strings'

export default function App() {
  const { lang, kind, loadDemo, clearAll } = useGameStore()
  const S = STRINGS[lang]

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="toolbar mb-4">
          <button className="btn" onClick={loadDemo}>{S.loadDemo}</button>
          <button className="btn" onClick={clearAll}>{S.clear}</button>
          <JsonIO />
        </div>

        <div className="grid-two">
          <div className="space-y-4">
            <SettingsPanel />
            {kind === 'quiz' && <QuizEditor />}
            {kind === 'matching' && <MatchingEditor />}
            {kind === 'flashcards' && <FlashEditor />}
          </div>
          <div className="space-y-4">
            <PreviewDialog />
            <div className="card">
              <div className="text-sm text-gray-600">Tip: {S.objectiveHint}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
