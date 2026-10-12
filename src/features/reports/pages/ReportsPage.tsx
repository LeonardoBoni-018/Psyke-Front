import { useState } from 'react'
import { format, subDays } from 'date-fns'
import { RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader/PageHeader'
import { FinancialReportCard } from '@/features/reports/components/FinancialReportCard/FinancialReportCard'
import { ClinicalReportCard } from '@/features/reports/components/ClinicalReportCard/ClinicalReportCard'
import { ReportFilters } from '@/features/reports/components/ReportFilters/ReportFilters'
import { useExportReport, useReportSummary } from '@/features/reports/hooks/useReports'
import type { ReportExport } from '@/types/reports'

const iso = (d: Date) => format(d, 'yyyy-MM-dd')

export default function ReportsPage() {
  const [dates, setDates] = useState(() => ({ from: iso(subDays(new Date(), 29)), to: iso(new Date()) }))
  const [exporting, setExporting] = useState<ReportExport | null>(null)

  const validPeriod = dates.from !== '' && dates.to !== '' && dates.to >= dates.from
  const report = useReportSummary(validPeriod ? dates : { from: iso(subDays(new Date(), 29)), to: iso(new Date()) })
  const exportReport = useExportReport()

  const handleExport = (kind: ReportExport) => {
    setExporting(kind)
    exportReport.mutate(
      { kind, params: dates },
      {
        onSuccess: (blob) => {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${kind === 'appointments' ? 'sessoes' : 'cobrancas'}_${dates.from}_${dates.to}.csv`
          document.body.appendChild(link)
          link.click()
          link.remove()
          URL.revokeObjectURL(url)
        },
        onSettled: () => setExporting(null),
      },
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Relatórios" description="Resultados financeiros e de atendimento do período escolhido." />

      <ReportFilters from={dates.from} to={dates.to} onChange={setDates} onExport={handleExport} exporting={exporting} />

      {report.isLoading ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="surface space-y-4 p-6">
              <div className="animate-shimmer h-4 w-1/3 rounded" />
              <div className="animate-shimmer h-9 w-1/2 rounded" />
              <div className="animate-shimmer h-28 w-full rounded" />
            </div>
          ))}
        </div>
      ) : report.isError || !report.data ? (
        <div className="surface flex flex-col items-center gap-3 px-6 py-14 text-center">
          <p className="text-[15px] text-text-1">Não foi possível carregar os relatórios.</p>
          <button
            type="button"
            onClick={() => void report.refetch()}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-bg-1 px-4 text-[13px] font-semibold text-text-1 shadow-sm transition hover:bg-bg-2"
          >
            <RefreshCw size={14} /> Tentar novamente
          </button>
        </div>
      ) : (
        <div className={`grid gap-6 transition-opacity xl:grid-cols-2 ${report.isFetching ? 'opacity-70' : ''}`}>
          <FinancialReportCard report={report.data} />
          <ClinicalReportCard report={report.data} />
        </div>
      )}
    </div>
  )
}
