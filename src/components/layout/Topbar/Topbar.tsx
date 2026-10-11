import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Menu } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  /** Opens the mobile navigation drawer (button is hidden on lg+). */
  onMenuClick?: () => void
}

function OfflineBadge() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])
  if (online) return null
  return (
    <div
      role="status"
      className="flex items-center gap-1.5 rounded-full border border-danger/30 bg-danger/10 px-2.5 py-1"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-danger" />
      <span className="font-mono text-[10px] text-danger">Offline</span>
    </div>
  )
}

export function Topbar({ title, subtitle, actions, onMenuClick }: TopbarProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Ctrl/⌘+K focuses the global search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const q = search.trim()
    navigate(q ? `/patients?q=${encodeURIComponent(q)}` : '/patients')
    setSearch('')
    inputRef.current?.blur()
  }

  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between gap-3 border-b border-border bg-bg-1 px-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menu"
          aria-controls="app-sidebar"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text-2 transition hover:bg-bg-2 hover:text-text-1 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <div className="truncate font-serif text-xl text-text-1">{title}</div>
          {subtitle && (
            <div className="-mt-0.5 truncate font-mono text-[11px] text-text-3">{subtitle}</div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <OfflineBadge />
        {actions}
        <form onSubmit={submit} role="search" className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3" aria-hidden="true" />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar paciente…"
            aria-label="Buscar paciente"
            maxLength={100}
            className="w-[200px] rounded-lg border border-border bg-bg-2 py-2 pl-10 pr-12 text-sm text-text-1 outline-none transition placeholder:text-text-3 focus:w-[260px] focus:border-teal focus:shadow-focus"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border px-1.5 py-px font-mono text-[10px] text-text-3 md:block">
            Ctrl K
          </kbd>
        </form>
        <button
          type="button"
          onClick={() => navigate('/patients')}
          aria-label="Buscar paciente"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text-2 transition hover:bg-bg-2 hover:text-text-1 sm:hidden"
        >
          <Search size={18} />
        </button>
      </div>
    </header>
  )
}
