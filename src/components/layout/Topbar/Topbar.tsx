import { useCallback, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Search, Bell } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

function ApiStatus() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const check = () => setOnline(navigator.onLine)
    window.addEventListener('online', check)
    window.addEventListener('offline', check)
    return () => {
      window.removeEventListener('online', check)
      window.removeEventListener('offline', check)
    }
  }, [])
  if (online) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 20,
      background: 'rgba(224,85,85,0.1)', border: '1px solid rgba(224,85,85,0.2)' }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)' }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--danger)' }}>Offline</span>
    </div>
  )
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  const [search, setSearch] = useState('')

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }, [])

  return (
    <header className="flex h-[52px] items-center justify-between gap-4 border-b border-border bg-bg-1 px-6">
      <div>
        <div className="font-serif text-xl text-text-1">{title}</div>
        {subtitle && (
          <div className="font-mono text-[11px] text-text-3 -mt-0.5">{subtitle}</div>
        )}
      </div>
      <div className="flex flex-1 items-center justify-end gap-3">
        <ApiStatus />
        {actions}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3" />
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="Buscar..."
            className="w-[220px] rounded-lg border border-border bg-bg-2 py-2 pl-10 pr-3 text-sm text-text-1 outline-none transition focus:border-teal focus:ring-0"
          />
        </div>
        <button
          type="button"
          className="relative inline-flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-border bg-bg-2 text-text-2 transition hover:border-border-hi hover:text-text-1"
          aria-label="Notificações"
        >
          <Bell size={16} />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-teal" />
        </button>
      </div>
    </header>
  )
}
