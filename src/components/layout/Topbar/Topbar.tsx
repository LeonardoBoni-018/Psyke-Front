import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarPlus, Menu, Search } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface TopbarProps {
  /** Opens the mobile navigation drawer (button is hidden on lg+). */
  onMenuClick?: () => void
  /** Opens the command palette. */
  onSearchClick?: () => void
  actions?: ReactNode
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
    <div role="status" className="flex items-center gap-1.5 rounded-full border border-danger/30 bg-danger/10 px-2.5 py-1">
      <span className="h-1.5 w-1.5 rounded-full bg-danger" />
      <span className="text-xs font-medium text-danger">Sem conexão</span>
    </div>
  )
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

export function Topbar({ onMenuClick, onSearchClick, actions }: TopbarProps) {
  const navigate = useNavigate()

  return (
    <header className="flex h-[60px] shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menu"
        aria-controls="app-sidebar"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text-2 transition hover:bg-bg-1 hover:text-text-1 lg:hidden"
      >
        <Menu size={20} />
      </button>

      <button
        type="button"
        onClick={onSearchClick}
        aria-label="Buscar ou ir para"
        className="group flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-border bg-bg-1 px-3 text-left text-[13px] text-text-3 shadow-sm transition hover:border-border-hi sm:h-9 sm:max-w-[420px]"
      >
        <Search size={16} aria-hidden="true" className="shrink-0" />
        <span className="flex-1 truncate">Buscar paciente ou ir para…</span>
        <kbd className="hidden rounded border border-border bg-bg-0 px-1.5 py-px text-[11px] font-medium text-text-3 sm:block">
          {isMac ? '⌘ K' : 'Ctrl K'}
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <OfflineBadge />
        {actions}
        <ThemeToggle />
        <button
          type="button"
          onClick={() => navigate('/agenda/new')}
          className="hidden h-9 items-center gap-2 rounded-lg bg-brand px-3.5 text-[13px] font-semibold text-on-brand shadow-sm transition hover:bg-brand-hi active:translate-y-px sm:inline-flex"
        >
          <CalendarPlus size={16} aria-hidden="true" />
          Nova sessão
        </button>
      </div>
    </header>
  )
}
