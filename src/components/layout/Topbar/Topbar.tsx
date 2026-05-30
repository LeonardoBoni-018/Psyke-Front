import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { Search, Bell } from 'lucide-react'

interface TopbarProps {
  title: string
  actions?: ReactNode
}

export function Topbar({ title, actions }: TopbarProps) {
  const [search, setSearch] = useState('')

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }, [])

  return (
    <header className="flex h-[52px] items-center justify-between gap-4 border-b border-border bg-bg-1 px-6">
      <div className="font-serif text-xl text-text-1">{title}</div>
      <div className="flex flex-1 items-center justify-end gap-3">
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
