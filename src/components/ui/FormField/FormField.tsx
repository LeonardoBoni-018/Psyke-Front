import type { ReactNode, ComponentType } from 'react'

interface FormFieldProps {
  icon?: ComponentType<{ size?: number; className?: string }>
  label: string
  error?: string
  /** Extra hint shown under the control when there is no error. */
  hint?: string
  children: ReactNode
}

export const inputClass = 'w-full bg-transparent text-[14px] text-text-1 outline-none placeholder:text-text-3'

/**
 * Labelled control. The whole block is a <label>, so clicking the text focuses the input and screen readers
 * announce the name. Don't put another <label> inside (use a <div> with `htmlFor` for checkboxes).
 */
export function FormField({ icon: Icon, label, error, hint, children }: FormFieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[13px] font-medium text-text-2">{label}</span>
      <span
        className={`flex min-h-10 items-center gap-3 rounded-lg border bg-bg-1 px-3 shadow-sm transition focus-within:shadow-focus ${
          error ? 'border-danger' : 'border-border focus-within:border-brand'
        }`}
      >
        {Icon && <Icon size={17} className="shrink-0 text-text-3" />}
        {children}
      </span>
      {error ? (
        <span role="alert" className="block text-xs text-danger">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-text-3">{hint}</span>
      ) : null}
    </label>
  )
}
