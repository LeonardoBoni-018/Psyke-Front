interface StatusBadgeProps {
  status: string
  label?: string
  size?: 'sm' | 'md'
}

const statusColorMap: Record<string, string> = {
  ACTIVE: 'bg-brand/10 text-brand',
  INACTIVE: 'bg-text-3/10 text-text-3',
  WAITING: 'bg-amber/15 text-amber',
  DISCHARGED: 'bg-info/15 text-info',
  SCHEDULED: 'bg-amber/15 text-amber',
  CONFIRMED: 'bg-brand/10 text-brand',
  CANCELLED: 'bg-danger/15 text-danger',
  NO_SHOW: 'bg-danger/10 text-danger',
  DONE: 'bg-brand/10 text-brand',
  OPEN: 'bg-info/15 text-info',
  CLOSED: 'bg-text-3/10 text-text-3',
  ARCHIVED: 'bg-text-3/10 text-text-3',
  ACTIVE_RECORD: 'bg-brand/10 text-brand',
  PENDING: 'bg-amber/10 text-amber',
  PAID: 'bg-brand/10 text-brand',
  REFUNDED: 'bg-info/10 text-info',
}

const defaultLabels: Record<string, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  WAITING: 'Em espera',
  DISCHARGED: 'Alta',
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'Faltou',
  DONE: 'Realizado',
  OPEN: 'Aberto',
  CLOSED: 'Fechado',
  ARCHIVED: 'Arquivado',
  ACTIVE_RECORD: 'Ativo',
  PENDING: 'Pendente',
  PAID: 'Paga',
  REFUNDED: 'Estornada',
}

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const colorClass = statusColorMap[status] ?? 'bg-text-3/10 text-text-3'
  const displayLabel = label ?? defaultLabels[status] ?? status
  const sizeClass = size === 'sm' ? 'px-1.5 py-[1px] text-[11px]' : 'px-2.5 py-0.5 text-xs'

  return (
    <span className={`inline-flex rounded-full items-center gap-1.5 font-semibold ${colorClass} ${sizeClass}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {displayLabel}
    </span>
  )
}
