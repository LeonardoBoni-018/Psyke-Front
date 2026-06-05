import type { ReactNode, ComponentType } from 'react'

interface FormFieldProps {
  icon?: ComponentType<{ size?: number; className?: string }>
  label: string
  error?: string
  children: ReactNode
}

export const inputClass = "w-full bg-transparent text-text-1 outline-none placeholder:text-text-3"

export function FormField({ icon: Icon, label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-text-2">{label}</label>
      <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-2 px-3 py-2 transition focus-within:border-teal focus-within:shadow-[0_0_0_3px_var(--teal-10)]">
        {Icon && <Icon size={18} className="shrink-0 text-text-3" />}
        {children}
      </div>
      {error && (
        <p className="mt-1 flex items-center gap-1 text-[11px] text-danger font-mono">
          <span className="inline-block h-1 w-1 rounded-full bg-danger" />
          {error}
        </p>
      )}
    </div>
  )
}
