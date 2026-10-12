import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

/** Consistent page title block: heading on the left, primary actions on the right (wraps on phones). */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pb-1 pt-2 sm:pt-4">
      <div className="min-w-0">
        <h1 className="text-[28px] leading-tight text-text-1 sm:text-[32px]">{title}</h1>
        {description && <p className="mt-1 max-w-xl text-[15px] text-text-2">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
