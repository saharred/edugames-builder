
import React from 'react'
import { useGameStore } from '@/store/useGameStore'
import { STRINGS } from '@/i18n/strings'

export default function SettingsPanel() {
  const {
    lang, setLang, title, setTitle, grade, setGrade, subject, setSubject,
    objective, setObjective, curriculumCode, setCurriculumCode, kind, setKind
  } = useGameStore()
  const S = STRINGS[lang]

  return (
    <div className="card">
      <div className="grid-two">
        <div>
          <label className="label">{S.gameTitle}</label>
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder={lang==='ar'?'مثال: جمع حتى 20':'e.g., Addition to 20'} />
        </div>
        <div>
          <label className="label">{S.language}</label>
          <select className="input" value={lang} onChange={e => setLang(e.target.value as any)}>
            <option value="ar">{S.arabic}</option>
            <option value="en">{S.english}</option>
          </select>
        </div>
        <div>
          <label className="label">{S.grade}</label>
          <input className="input" value={grade} onChange={e => setGrade(e.target.value)} />
        </div>
        <div>
          <label className="label">{S.subject}</label>
          <input className="input" value={subject} onChange={e => setSubject(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="label">{S.objective}</label>
          <textarea className="input" rows={2} value={objective} onChange={e => setObjective(e.target.value)} placeholder={S.objectiveHint}></textarea>
          <div className="text-xs text-gray-500 mt-1">{S.objectiveHint}</div>
        </div>
        <div>
          <label className="label">{S.curriculumCode}</label>
          <input className="input" value={curriculumCode} onChange={e => setCurriculumCode(e.target.value)} placeholder="MATH.G1.NBT.1" />
        </div>
        <div>
          <label className="label">{S.gameType}</label>
          <select className="input" value={kind} onChange={e => setKind(e.target.value as any)}>
            <option value="quiz">{S.quiz}</option>
            <option value="matching">{S.match}</option>
            <option value="flashcards">{S.flash}</option>
          </select>
        </div>
      </div>
    </div>
  )
}
