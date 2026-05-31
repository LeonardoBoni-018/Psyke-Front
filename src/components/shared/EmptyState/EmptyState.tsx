import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: { label: string; onClick: () => void }
  icon?: React.ComponentType<{ size?: number; className?: string }>
}

export function EmptyState({
  title = 'Nenhum dado encontrado',
  description,
  action,
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-border bg-bg-1 py-16 px-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-bg-2">
        <Icon size={28} className="text-text-3" />
      </div>
      <h3 className="text-base font-medium text-text-1">{title}</h3>
      {description && <p className="mt-1 text-sm text-text-3 max-w-sm">{description}</p>}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal/90"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
