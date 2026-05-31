interface StatusBadgeProps {
  status: string
  label?: string
  size?: 'sm' | 'md'
}

const statusColorMap: Record<string, string> = {
  ACTIVE: 'bg-teal/15 text-teal',
  INACTIVE: 'bg-text-3/10 text-text-3',
  WAITING: 'bg-amber/15 text-amber',
  DISCHARGED: 'bg-info/15 text-info',
  SCHEDULED: 'bg-amber/15 text-amber',
  CONFIRMED: 'bg-teal/15 text-teal',
  CANCELLED: 'bg-danger/15 text-danger',
  NO_SHOW: 'bg-danger/10 text-danger',
  DONE: 'bg-teal/15 text-teal',
  OPEN: 'bg-info/15 text-info',
  CLOSED: 'bg-text-3/10 text-text-3',
  ARCHIVED: 'bg-text-3/10 text-text-3',
  ACTIVE_RECORD: 'bg-teal/15 text-teal',
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
}

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const colorClass = statusColorMap[status] ?? 'bg-text-3/10 text-text-3'
  const displayLabel = label ?? defaultLabels[status] ?? status
  const sizeClass = size === 'sm' ? 'px-1.5 py-[1px] text-[10px]' : 'px-2.5 py-0.5 text-[11px]'

  return (
    <span className={`inline-flex rounded-full font-medium font-mono ${colorClass} ${sizeClass}`}>
      {displayLabel}
    </span>
  )
}
