
import { create } from 'zustand'
import type { GameProject, QuizItem, MatchItem, FlashItem, GameKind, Lang } from '@/types/game'

const AUTO_KEY = 'edugames-builder:auto'

type State = GameProject & {
  setTitle: (v: string) => void
  setLang: (l: Lang) => void
  setGrade: (v: string) => void
  setSubject: (v: string) => void
  setObjective: (v: string) => void
  setCurriculumCode: (v: string) => void
  setKind: (k: GameKind) => void

  addQuiz: () => void
  updateQuiz: (id: string, patch: Partial<QuizItem>) => void
  removeQuiz: (id: string) => void

  addMatch: () => void
  updateMatch: (id: string, patch: Partial<MatchItem>) => void
  removeMatch: (id: string) => void

  addFlash: () => void
  updateFlash: (id: string, patch: Partial<FlashItem>) => void
  removeFlash: (id: string) => void

  loadDemo: () => void
  clearAll: () => void

  exportJSON: () => string
  importJSON: (raw: string) => void
}

const newId = () => Math.random().toString(36).slice(2, 10)

const initial: GameProject = {
  title: '',
  lang: 'ar',
  grade: '',
  subject: '',
  objective: '',
  curriculumCode: '',
  kind: 'quiz',
  quizItems: [],
  matchItems: [],
  flashItems: []
}

export const useGameStore = create<State>((set, get) => ({
  ...(() => {
    try {
      const raw = localStorage.getItem(AUTO_KEY)
      if (raw) return JSON.parse(raw) as GameProject
    } catch {}
    return initial
  })(),

  setTitle: (v) => set({ title: v }),
  setLang: (l) => set({ lang: l }),
  setGrade: (v) => set({ grade: v }),
  setSubject: (v) => set({ subject: v }),
  setObjective: (v) => set({ objective: v }),
  setCurriculumCode: (v) => set({ curriculumCode: v }),
  setKind: (k) => set({ kind: k }),

  addQuiz: () => set(s => ({ quizItems: [...s.quizItems, { id: newId(), question: '', answer: '' }] })),
  updateQuiz: (id, patch) => set(s => ({ quizItems: s.quizItems.map(it => it.id === id ? { ...it, ...patch } : it) })),
  removeQuiz: (id) => set(s => ({ quizItems: s.quizItems.filter(it => it.id !== id) })),

  addMatch: () => set(s => ({ matchItems: [...s.matchItems, { id: newId(), term: '', definition: '' }] })),
  updateMatch: (id, patch) => set(s => ({ matchItems: s.matchItems.map(it => it.id === id ? { ...it, ...patch } : it) })),
  removeMatch: (id) => set(s => ({ matchItems: s.matchItems.filter(it => it.id !== id) })),

  addFlash: () => set(s => ({ flashItems: [...s.flashItems, { id: newId(), textFront: '', textBack: '' }] })),
  updateFlash: (id, patch) => set(s => ({ flashItems: s.flashItems.map(it => it.id === id ? { ...it, ...patch } : it) })),
  removeFlash: (id) => set(s => ({ flashItems: s.flashItems.filter(it => it.id !== id) })),

  loadDemo: () => set({
    title: 'حقائق الجمع حتى 20 / Addition facts to 20',
    lang: 'ar',
    grade: 'الصف الأول',
    subject: 'رياضيات / Math',
    objective: 'تمييز حقائق الجمع حتى 20 وفق المنهج القطري',
    curriculumCode: 'MATH.G1.NBT.1',
    kind: 'quiz',
    quizItems: [
      { id: newId(), question: '8 + 7 = ?', answer: '15' },
      { id: newId(), question: '10 + 5 = ?', answer: '15' },
      { id: newId(), question: '12 + 8 = ?', answer: '20' }
    ],
    matchItems: [
      { id: newId(), term: 'مثلث', definition: 'شكل له ثلاث أضلاع' },
      { id: newId(), term: 'مربع', definition: 'شكل له أربع أضلاع متساوية' },
      { id: newId(), term: 'Triangle', definition: 'A shape with 3 sides' },
      { id: newId(), term: 'Square', definition: 'A shape with 4 equal sides' }
    ],
    flashItems: [
      { id: newId(), textFront: '2 + 3', textBack: '5' },
      { id: newId(), textFront: '5 + 5', textBack: '10' },
      { id: newId(), textFront: '9 + 1', textBack: '10' }
    ]
  }),

  clearAll: () => set(initial),

  exportJSON: () => {
    const data = get()
    const copy: GameProject = {
      title: data.title,
      lang: data.lang,
      grade: data.grade,
      subject: data.subject,
      objective: data.objective,
      curriculumCode: data.curriculumCode,
      kind: data.kind,
      quizItems: data.quizItems,
      matchItems: data.matchItems,
      flashItems: data.flashItems,
    }
    return JSON.stringify(copy, null, 2)
  },
  importJSON: (raw: string) => {
    const parsed = JSON.parse(raw) as GameProject
    set(parsed)
  }
}))

// autosave
useGameStore.subscribe((state) => {
  const { title, lang, grade, subject, objective, curriculumCode, kind, quizItems, matchItems, flashItems } = state
  const pack = { title, lang, grade, subject, objective, curriculumCode, kind, quizItems, matchItems, flashItems }
  try {
    localStorage.setItem(AUTO_KEY, JSON.stringify(pack))
  } catch {}
})
