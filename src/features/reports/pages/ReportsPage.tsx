import { useMemo, useState } from 'react'
import { BarChart2, AlertCircle } from 'lucide-react'
import { FinancialReportCard } from '@/features/reports/components/FinancialReportCard/FinancialReportCard'
import { ClinicalReportCard } from '@/features/reports/components/ClinicalReportCard/ClinicalReportCard'
import { ReportFilters } from '@/features/reports/components/ReportFilters/ReportFilters'
import { useClinicalReport, useFinancialReport } from '@/features/reports/hooks/useReports'

function getInitialPeriod(days = 30) {
  const now = new Date()
  const end = now.toISOString().split('T')[0]
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  return { start, end }
}

export default function ReportsPage() {
  const initialPeriod = useMemo(() => getInitialPeriod(), [])
  const [dates, setDates] = useState({ from: initialPeriod.start, to: initialPeriod.end })

  const financialReportQuery = useFinancialReport({ from: dates.from, to: dates.to })
  const clinicalReportQuery = useClinicalReport({ from: dates.from, to: dates.to })

  const isLoading = financialReportQuery.isLoading || clinicalReportQuery.isLoading

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6">
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal">
          <BarChart2 size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-serif text-text-1">Relatórios</h1>
          <p className="mt-1 text-sm text-text-3">Acompanhe desempenho financeiro e resultados de tratamento em um único painel.</p>
        </div>
      </div>

      <ReportFilters from={dates.from} to={dates.to} onChange={(value) => setDates(value)} />

      {isLoading ? (
        <div className="page-enter grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6">
            <div className="animate-shimmer h-4 w-1/3 rounded" />
            <div className="animate-shimmer h-8 w-1/2 rounded" />
            <div className="animate-shimmer mt-2 h-3 w-2/3 rounded" />
            <div className="animate-shimmer mt-4 h-24 w-full rounded" />
          </div>
          <div className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6">
            <div className="animate-shimmer h-4 w-1/3 rounded" />
            <div className="animate-shimmer h-8 w-1/2 rounded" />
            <div className="animate-shimmer mt-2 h-3 w-2/3 rounded" />
            <div className="animate-shimmer mt-4 h-24 w-full rounded" />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {financialReportQuery.data ? (
            <FinancialReportCard report={financialReportQuery.data} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-border bg-bg-1 py-14 gap-3">
              <AlertCircle size={22} className="text-text-3 opacity-50" />
              <p className="text-sm text-text-3">Não foi possível carregar o relatório financeiro</p>
            </div>
          )}

          {clinicalReportQuery.data ? (
            <ClinicalReportCard report={clinicalReportQuery.data} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-border bg-bg-1 py-14 gap-3">
              <AlertCircle size={22} className="text-text-3 opacity-50" />
              <p className="text-sm text-text-3">Não foi possível carregar o relatório clínico</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
