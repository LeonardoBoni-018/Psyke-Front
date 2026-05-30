import type { FinancialSummary } from '@/features/financial/services/financialApi'

interface BalanceSummaryProps {
  summary: FinancialSummary
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function BalanceSummary({ summary }: BalanceSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-[var(--radius-lg)] border border-border bg-bg-1 p-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-text-3">Receita total</div>
        <div className="mt-3 text-2xl font-semibold text-text-1">{formatCurrency(summary.totalRevenue)}</div>
      </div>
      <div className="rounded-[var(--radius-lg)] border border-border bg-bg-1 p-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-text-3">A receber</div>
        <div className="mt-3 text-2xl font-semibold text-text-1">{formatCurrency(summary.totalReceivables)}</div>
      </div>
      <div className="rounded-[var(--radius-lg)] border border-border bg-bg-1 p-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-text-3">Pago</div>
        <div className="mt-3 text-2xl font-semibold text-teal">{formatCurrency(summary.totalPaid)}</div>
      </div>
      <div className="rounded-[var(--radius-lg)] border border-border bg-bg-1 p-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-text-3">Vencido</div>
        <div className="mt-3 text-2xl font-semibold text-amber">{formatCurrency(summary.overdueAmount)}</div>
      </div>
    </div>
  )
}
