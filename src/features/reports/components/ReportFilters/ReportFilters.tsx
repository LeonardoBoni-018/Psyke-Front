interface ReportFiltersProps {
  from: string
  to: string
  onChange: (data: { from: string; to: string }) => void
}

export function ReportFilters({ from, to, onChange }: ReportFiltersProps) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-bg-2 p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm text-text-2">
          Período de
          <input
            type="date"
            value={from}
            onChange={(event) => onChange({ from: event.target.value, to })}
            className="mt-2 w-full rounded-xl border border-border bg-bg-1 px-4 py-3 text-text-1"
          />
        </label>
        <label className="block text-sm text-text-2">
          Período até
          <input
            type="date"
            value={to}
            onChange={(event) => onChange({ from, to: event.target.value })}
            className="mt-2 w-full rounded-xl border border-border bg-bg-1 px-4 py-3 text-text-1"
          />
        </label>
        <div className="flex items-end">
          <p className="text-sm text-text-3">
            Atualize o intervalo para filtrar os relatórios financeiros e clínicos.
          </p>
        </div>
      </div>
    </div>
  )
}
