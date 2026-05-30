import type { FinancialReportSummary } from '@/types/reports'

interface FinancialReportCardProps {
  report: FinancialReportSummary
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function FinancialReportCard({ report }: FinancialReportCardProps) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-1">Resumo financeiro</h2>
          <p className="mt-1 text-sm text-text-3">Visão geral das receitas e recebíveis no período.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[var(--radius-lg)] border border-border bg-bg-2 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-text-3">Receita</p>
          <p className="mt-3 text-2xl font-semibold text-text-1">{formatCurrency(report.totalRevenue)}</p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-border bg-bg-2 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-text-3">A receber</p>
          <p className="mt-3 text-2xl font-semibold text-text-1">{formatCurrency(report.totalReceivables)}</p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-border bg-bg-2 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-text-3">Pago</p>
          <p className="mt-3 text-2xl font-semibold text-teal">{formatCurrency(report.totalPaid)}</p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-border bg-bg-2 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-text-3">Vencido</p>
          <p className="mt-3 text-2xl font-semibold text-amber">{formatCurrency(report.overdueAmount)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-bg-2 p-4">
        <p className="text-sm font-semibold text-text-1">Receita mensal</p>
        <div className="mt-4 space-y-3">
          {report.revenueSeries.map((item) => (
            <div key={item.month} className="flex items-center justify-between gap-4">
              <span className="text-sm text-text-2">{item.month}</span>
              <span className="text-sm font-semibold text-text-1">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
