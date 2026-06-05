import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  deltaPositive?: boolean
  icon?: ReactNode
  onClick?: () => void
}

export function StatCard({ label, value, delta, deltaPositive, icon, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 150ms, background 150ms',
      }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.borderColor = 'var(--border-hi)'; e.currentTarget.style.background = 'var(--bg-2)' }}}
      onMouseLeave={e => { if (onClick) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-1)' }}}
    >
      {icon && <div style={{ position: 'absolute', top: 16, right: 16, opacity: 0.15, color: 'var(--teal)', pointerEvents: 'none' }}>{icon}</div>}
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: 36, color: 'var(--text-1)', lineHeight: 1, marginBottom: delta ? 6 : 0 }}>{value}</p>
      {delta && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: deltaPositive ? 'var(--teal)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4, margin: 0 }}>{deltaPositive ? '↑' : '↓'} {delta}</p>}
    </div>
  )
}
