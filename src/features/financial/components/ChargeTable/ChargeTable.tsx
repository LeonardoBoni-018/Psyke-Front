import { Check, FileDown, Loader2, Receipt, XCircle } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/date'
import type { Invoice } from '@/types/financial'

interface ChargeTableProps {
  charges: Invoice[]
  onMarkPaid: (id: string) => void
  onCancel: (id: string) => void
  onExport: (id: string) => void
  busyId?: string
}

export function ChargeTable({ charges, onMarkPaid, onCancel, onExport, busyId }: ChargeTableProps) {
  if (charges.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-2 text-text-3">
          <Receipt size={22} />
        </span>
        <p className="text-[15px] text-text-1">Nenhuma cobrança encontrada</p>
        <p className="max-w-xs text-[13px] text-text-3">Ajuste o filtro ou crie uma nova cobrança para um paciente.</p>
      </div>
    )
  }

  return (
    <div className="table-scroll">
      <table className="w-full text-left text-[14px]">
        <thead>
          <tr className="border-b border-border text-[13px] text-text-3">
            <th className="px-5 py-3 font-medium">Paciente</th>
            <th className="px-3 py-3 font-medium">Observação</th>
            <th className="px-3 py-3 font-medium">Emitida em</th>
            <th className="px-3 py-3 text-right font-medium">Valor</th>
            <th className="px-3 py-3 font-medium">Situação</th>
            <th className="px-5 py-3 text-right font-medium">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {charges.map((charge, i) => {
            const busy = busyId === charge.id
            return (
              <tr
                key={charge.id}
                className="item-enter border-b border-border/70 last:border-0 hover:bg-bg-2/60"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <td className="px-5 py-3.5">
                  <span className="font-medium text-text-1">{charge.patientName ?? 'Paciente'}</span>
                  {charge.professionalName && <span className="block text-xs text-text-3">{charge.professionalName}</span>}
                </td>
                <td className="max-w-[240px] truncate px-3 py-3.5 text-text-2">{charge.notes || 'Sessão'}</td>
                <td className="px-3 py-3.5 text-text-2 tabular">
                  {formatDate(charge.createdAt)}
                  {charge.status === 'PAID' && charge.paymentDate && (
                    <span className="block text-xs text-text-3">paga em {formatDate(charge.paymentDate)}</span>
                  )}
                </td>
                <td className="px-3 py-3.5 text-right font-semibold text-text-1 tabular">{formatCurrency(charge.amount)}</td>
                <td className="px-3 py-3.5">
                  <StatusBadge status={charge.status} label={charge.status === 'CANCELLED' ? 'Cancelada' : undefined} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    {busy && <Loader2 size={15} className="animate-spin text-text-3" aria-label="Processando" />}
                    {charge.status === 'PENDING' && (
                      <>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onMarkPaid(charge.id)}
                          className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md border border-border bg-bg-1 px-2.5 text-[13px] font-semibold text-text-1 shadow-sm transition hover:border-brand hover:text-brand disabled:opacity-50"
                        >
                          <Check size={14} /> Marcar paga
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onCancel(charge.id)}
                          aria-label="Cancelar cobrança"
                          title="Cancelar cobrança"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-3 transition hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onExport(charge.id)}
                      aria-label="Baixar PDF da cobrança"
                      title="Baixar PDF"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-3 transition hover:bg-bg-2 hover:text-text-1 disabled:opacity-50"
                    >
                      <FileDown size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
