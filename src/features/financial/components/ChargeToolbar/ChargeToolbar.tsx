import { useMemo } from 'react'

interface ChargeToolbarProps {
  status: 'all' | 'open' | 'paid' | 'overdue'
  search: string
  onStatusChange: (status: 'all' | 'open' | 'paid' | 'overdue') => void
  onSearchChange: (value: string) => void
}

const options = [
  { value: 'all', label: 'Todas' },
  { value: 'open', label: 'Abertas' },
  { value: 'paid', label: 'Pagas' },
  { value: 'overdue', label: 'Vencidas' },
] as const

export function ChargeToolbar({ status, search, onStatusChange, onSearchChange }: ChargeToolbarProps) {
  const statusButtons = useMemo(
    () =>
      options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`rounded-full border px-3 py-1 text-sm transition ${
            status === option.value
              ? 'border-teal bg-teal text-bg-0'
              : 'border-border bg-bg-2 text-text-2 hover:border-border-hi hover:text-text-1'
          }`}
          onClick={() => onStatusChange(option.value)}
        >
          {option.label}
        </button>
      )),
    [status],
  )

  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-border bg-bg-2 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">{statusButtons}</div>
      <label className="relative block w-full max-w-sm">
        <span className="sr-only">Buscar cobranças</span>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar paciente, descrição..."
          className="w-full rounded-full border border-border bg-bg-1 px-4 py-3 text-sm text-text-1 placeholder:text-text-3 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
        />
      </label>
    </div>
  )
}
