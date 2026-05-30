import { useMemo, useState } from 'react'
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
      <div className="rounded-[var(--radius-xl)] border border-border bg-bg-2 p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.18em] text-text-3">Relatórios</p>
        <h1 className="mt-2 text-3xl font-semibold text-text-1">Análise clínica e financeira</h1>
        <p className="mt-2 text-sm text-text-3">Acompanhe desempenho financeiro e resultados de tratamento em um único painel.</p>
      </div>

      <ReportFilters from={dates.from} to={dates.to} onChange={(value) => setDates(value)} />

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-72 rounded-[var(--radius-xl)] bg-bg-2" />
          <div className="h-72 rounded-[var(--radius-xl)] bg-bg-2" />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {financialReportQuery.data ? (
            <FinancialReportCard report={financialReportQuery.data} />
          ) : (
            <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 text-text-3">
              Não foi possível carregar o relatório financeiro.
            </div>
          )}

          {clinicalReportQuery.data ? (
            <ClinicalReportCard report={clinicalReportQuery.data} />
          ) : (
            <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 text-text-3">
              Não foi possível carregar o relatório clínico.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
