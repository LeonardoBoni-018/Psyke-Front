import type { FinancialSummary } from '@/features/financial/services/financialApi'
import { useCountUp } from '@/hooks/useCountUp'
import { formatCurrency } from '@/lib/currency'

interface BalanceSummaryProps {
  summary: FinancialSummary
}

function Block({ label, value, format, hint, delay }: {
  label: string
  value: number
  format?: (n: number) => string
  hint: string
  delay: number
}) {
  const animated = useCountUp(value)
  return (
    <div className="item-enter px-5 py-4 sm:px-6 sm:py-5" style={{ animationDelay: `${delay}ms` }}>
      <p className="text-[13px] text-text-2">{label}</p>
      <p className="mt-1.5 font-display text-[28px] font-semibold sm:text-[32px] leading-none tracking-tight text-text-1 tabular">
        {format ? format(animated) : Math.round(animated)}
      </p>
      <p className="mt-2 text-xs text-text-3">{hint}</p>
    </div>
  )
}

export function BalanceSummary({ summary }: BalanceSummaryProps) {
  return (
    <section className="surface grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0" aria-label="Resumo financeiro">
      <Block label="Recebido no mês" value={summary.monthlyRevenue} format={formatCurrency} hint={`${summary.paidCount} cobranças pagas no total`} delay={0} />
      <Block label="A receber" value={summary.pendingAmount} format={formatCurrency} hint={`${summary.pendingCount} ${summary.pendingCount === 1 ? 'cobrança pendente' : 'cobranças pendentes'}`} delay={60} />
      <Block label="Cobranças pagas" value={summary.paidCount} hint="desde o início" delay={120} />
    </section>
  )
}
