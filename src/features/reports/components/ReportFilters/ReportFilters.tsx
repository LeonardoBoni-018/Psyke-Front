import { useState } from 'react'
import { differenceInCalendarDays, endOfYear, format, startOfYear, subDays } from 'date-fns'
import { Download, Loader2 } from 'lucide-react'
import type { ReportExport } from '@/types/reports'

interface ReportFiltersProps {
  from: string
  to: string
  onChange: (data: { from: string; to: string }) => void
  onExport: (kind: ReportExport) => void
  exporting?: ReportExport | null
}

const iso = (d: Date) => format(d, 'yyyy-MM-dd')

const presets = [
  { id: '30', label: '30 dias', range: () => ({ from: iso(subDays(new Date(), 29)), to: iso(new Date()) }) },
  { id: '90', label: '90 dias', range: () => ({ from: iso(subDays(new Date(), 89)), to: iso(new Date()) }) },
  { id: 'year', label: 'Este ano', range: () => ({ from: iso(startOfYear(new Date())), to: iso(endOfYear(new Date())) }) },
] as const

const dateClass =
  'mt-1 h-10 w-full rounded-lg border border-border bg-bg-1 px-3 text-[14px] text-text-1 shadow-sm outline-none transition focus:border-brand focus:shadow-focus'

export function ReportFilters({ from, to, onChange, onExport, exporting }: ReportFiltersProps) {
  const [custom, setCustom] = useState(false)
  const activePreset = custom ? null : presets.find((p) => {
    const r = p.range()
    return r.from === from && r.to === to
  })?.id
  const tooLong = differenceInCalendarDays(new Date(to), new Date(from)) > 366
  const invalid = to < from

  return (
    <div className="surface space-y-4 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Período" className="inline-flex gap-1 rounded-lg bg-bg-2 p-1">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={activePreset === p.id}
              onClick={() => {
                setCustom(false)
                onChange(p.range())
              }}
              className={`h-8 rounded-md px-3.5 text-[13px] font-medium transition ${
                activePreset === p.id ? 'bg-bg-1 text-text-1 shadow-sm' : 'text-text-2 hover:text-text-1'
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            role="tab"
            aria-selected={custom || !activePreset}
            onClick={() => setCustom(true)}
            className={`h-8 rounded-md px-3.5 text-[13px] font-medium transition ${
              custom || !activePreset ? 'bg-bg-1 text-text-1 shadow-sm' : 'text-text-2 hover:text-text-1'
            }`}
          >
            Personalizado
          </button>
        </div>

        <div className="flex items-center gap-2">
          {(['appointments', 'invoices'] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              disabled={!!exporting || invalid || tooLong}
              onClick={() => onExport(kind)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-bg-1 px-3 text-[13px] font-semibold text-text-1 shadow-sm transition hover:border-border-hi hover:bg-bg-2 disabled:opacity-50"
            >
              {exporting === kind ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              {kind === 'appointments' ? 'Sessões (CSV)' : 'Cobranças (CSV)'}
            </button>
          ))}
        </div>
      </div>

      {(custom || !activePreset) && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-[13px] font-medium text-text-2">
            De
            <input type="date" value={from} max={to} onChange={(e) => onChange({ from: e.target.value, to })} className={dateClass} />
          </label>
          <label className="block text-[13px] font-medium text-text-2">
            Até
            <input type="date" value={to} min={from} onChange={(e) => onChange({ from, to: e.target.value })} className={dateClass} />
          </label>
        </div>
      )}
      {(invalid || tooLong) && (
        <p role="alert" className="text-[13px] text-danger">
          {invalid ? 'A data final precisa ser depois da inicial.' : 'O período máximo é de 366 dias.'}
        </p>
      )}
    </div>
  )
}
