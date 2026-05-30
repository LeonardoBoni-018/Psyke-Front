import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-2.5 py-1.5 text-[11px]',
  md: 'px-3.5 py-2 text-[12px]',
  lg: 'px-4.5 py-2.5 text-[13px]',
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-teal text-bg-0 hover:bg-[#12dbb2] border border-transparent',
  ghost: 'bg-transparent border border-border text-text-2 hover:border-border-hi hover:text-text-1',
  danger: 'bg-[rgba(224,85,85,0.1)] border border-danger text-danger hover:bg-[rgba(224,85,85,0.16)]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={props.type ?? 'button'}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-sans font-medium transition-all duration-150 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  )
}
