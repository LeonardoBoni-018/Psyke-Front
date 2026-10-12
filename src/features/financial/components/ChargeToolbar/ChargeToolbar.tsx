import { Search } from 'lucide-react'
import type { InvoiceStatus } from '@/types/financial'

export type ChargeFilter = 'ALL' | InvoiceStatus

interface ChargeToolbarProps {
  status: ChargeFilter
  search: string
  onStatusChange: (status: ChargeFilter) => void
  onSearchChange: (value: string) => void
}

const options: { value: ChargeFilter; label: string }[] = [
  { value: 'ALL', label: 'Todas' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'PAID', label: 'Pagas' },
  { value: 'CANCELLED', label: 'Canceladas' },
]

export function ChargeToolbar({ status, search, onStatusChange, onSearchChange }: ChargeToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div role="tablist" aria-label="Filtrar por situação" className="inline-flex w-full gap-1 overflow-x-auto rounded-lg bg-bg-2 p-1 sm:w-auto">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={status === option.value}
            onClick={() => onStatusChange(option.value)}
            className={`h-8 shrink-0 rounded-md px-3.5 text-[13px] font-medium transition ${
              status === option.value ? 'bg-bg-1 text-text-1 shadow-sm' : 'text-text-2 hover:text-text-1'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <label className="relative block w-full sm:max-w-xs">
        <span className="sr-only">Buscar cobranças nesta página</span>
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por paciente ou observação"
          className="h-10 w-full rounded-lg border border-border bg-bg-1 pl-9 pr-3 text-[14px] text-text-1 shadow-sm outline-none transition placeholder:text-text-3 focus:border-brand focus:shadow-focus"
        />
      </label>
    </div>
  )
}
