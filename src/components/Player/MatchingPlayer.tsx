
import React, { useMemo, useState } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { STRINGS } from '@/i18n/strings'

type Card = { id: string; side: 'term' | 'definition'; text: string; pairId: string }

function shuffle<T>(arr: T[]) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MatchingPlayer() {
  const { lang, matchItems } = useGameStore()
  const S = STRINGS[lang]
  const cards = useMemo<Card[]>(() => {
    const list: Card[] = []
    matchItems.forEach(it => {
      list.push({ id: it.id + 't', side: 'term', text: it.term, pairId: it.id })
      list.push({ id: it.id + 'd', side: 'definition', text: it.definition, pairId: it.id })
    })
    return shuffle(list)
  }, [matchItems])
  const [opened, setOpened] = useState<Card[]>([])
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [attempts, setAttempts] = useState(0)

  const onCard = (c: Card) => {
    if (matched.has(c.pairId)) return
    const next = [...opened, c].slice(-2)
    setOpened(next)
    if (next.length === 2) {
      setAttempts(a => a + 1)
      if (next[0].pairId === next[1].pairId && next[0].side !== next[1].side) {
        setMatched(new Set([...matched, c.pairId]))
        setOpened([])
      }
    }
  }

  if (!matchItems.length) return <div className="text-gray-500">No matching items.</div>

  const done = matched.size >= matchItems.length

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {cards.map(c => {
          const isOpen = opened.some(o => o.id === c.id)
          const isDone = matched.has(c.pairId)
        return (
          <button key={c.id} className={`card !p-3 ${isDone ? 'bg-green-100' : ''}`} onClick={() => onCard(c)} disabled={isDone}>
            <div className="text-sm">{(isOpen || isDone) ? c.text : '•••'}</div>
            <div className="text-xs text-gray-500 mt-1">{c.side}</div>
          </button>
        )})}
      </div>
      <div className="mt-3 text-sm text-gray-600">{S.attempts}: {attempts}</div>
      {done && <div className="mt-2 font-semibold">✔ {S.done}</div>}
    </div>
  )
}
