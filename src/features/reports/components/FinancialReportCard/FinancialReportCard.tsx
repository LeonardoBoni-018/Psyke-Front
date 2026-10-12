import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useCountUp } from '@/hooks/useCountUp'
import { formatCurrency } from '@/lib/currency'
import type { ReportSummary } from '@/types/reports'

export function FinancialReportCard({ report }: { report: ReportSummary }) {
  const revenue = useCountUp(report.revenue)
  const pending = useCountUp(report.pendingAmount)
  const months = report.revenueByMonth
  const max = Math.max(1, ...months.map((m) => Number(m.amount)))
  const paidCount = report.invoicesByStatus.PAID ?? 0
  const pendingCount = report.invoicesByStatus.PENDING ?? 0

  return (
    <section className="surface p-5 sm:p-6" aria-labelledby="fin-title">
      <h2 id="fin-title" className="text-[17px] text-text-1">Financeiro</h2>
      <p className="mt-0.5 text-[13px] text-text-2">Receita recebida e valores ainda em aberto no período</p>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[13px] text-text-2">Receita</p>
          <p className="mt-1 font-display text-[30px] font-semibold leading-none tracking-tight text-text-1 tabular">{formatCurrency(revenue)}</p>
          <p className="mt-1.5 text-xs text-text-3">{paidCount} {paidCount === 1 ? 'cobrança paga' : 'cobranças pagas'}</p>
        </div>
        <div>
          <p className="text-[13px] text-text-2">A receber</p>
          <p className="mt-1 font-display text-[30px] font-semibold leading-none tracking-tight text-text-1 tabular">{formatCurrency(pending)}</p>
          <p className="mt-1.5 text-xs text-text-3">{pendingCount} {pendingCount === 1 ? 'cobrança pendente' : 'cobranças pendentes'}</p>
        </div>
      </div>

      <div className="mt-7">
        <p className="mb-3 text-[13px] font-medium text-text-2">Receita por mês</p>
        {months.length === 0 ? (
          <p className="rounded-lg bg-bg-2 px-4 py-6 text-center text-[13px] text-text-3">Sem receita registrada neste período.</p>
        ) : (
          <div className="flex h-[140px] items-end gap-2" role="img" aria-label="Receita por mês">
            {months.map((m, i) => (
              <div key={m.month} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5" title={`${m.month}: ${formatCurrency(m.amount)}`}>
                <span className="text-xs font-medium text-text-2 opacity-0 transition-opacity group-hover:opacity-100 tabular">{formatCurrency(m.amount)}</span>
                <span
                  className="animate-grow w-full max-w-[44px] rounded-t-md bg-brand/80 transition-colors group-hover:bg-brand"
                  style={{ height: `${Math.max(4, (Number(m.amount) / max) * 100)}%`, animationDelay: `${i * 60}ms` }}
                />
                <span className="text-xs text-text-3">{format(parseISO(`${m.month}-01`), 'MMM', { locale: ptBR }).replace('.', '')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
