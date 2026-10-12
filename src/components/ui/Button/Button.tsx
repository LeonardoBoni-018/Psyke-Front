import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-9 px-4 text-[13px]',
  lg: 'h-11 px-5 text-sm',
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-brand text-on-brand border border-transparent shadow-sm hover:bg-brand-hi active:translate-y-px',
  ghost:
    'bg-bg-1 border border-border text-text-1 shadow-sm hover:border-border-hi hover:bg-bg-2 active:translate-y-px',
  danger:
    'bg-danger/10 border border-danger/30 text-danger hover:bg-danger/15 active:translate-y-px',
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
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-sans font-semibold transition-[background-color,border-color,box-shadow,transform] duration-150 disabled:cursor-not-allowed disabled:opacity-55 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  )
}
