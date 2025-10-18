
import React from 'react'

type Props = {
  label: string
  children: React.ReactNode
  hint?: string
}

export default function Field({ label, children, hint }: Props) {
  return (
    <div className="mb-3">
      <label className="label">{label}</label>
      {children}
      {hint ? <div className="text-xs text-gray-500 mt-1">{hint}</div> : null}
    </div>
  )
}
