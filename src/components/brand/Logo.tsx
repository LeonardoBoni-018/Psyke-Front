interface LogoProps {
  size?: number
  className?: string
}

/** Psyke mark: a rounded tile with the Greek psi (ψ), drawn as strokes so it scales crisply. */
export function Logo({ size = 32, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} role="img" aria-label="Psyke">
      <rect width="64" height="64" rx="16" fill="var(--brand)" />
      <path
        d="M32 13v38M19.5 21c0 11.5 5.2 17 12.5 17s12.5-5.5 12.5-17"
        fill="none"
        stroke="var(--on-brand)"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}
