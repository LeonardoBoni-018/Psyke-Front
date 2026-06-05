# Psyke UI — Skill de Componentes Prontos

Copie e adapte os componentes abaixo. Todos seguem o design system do AGENTS.md.

---

## StatCard

```tsx
interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  deltaPositive?: boolean
  icon: React.ReactNode
  onClick?: () => void
}

export function StatCard({ label, value, delta, deltaPositive, icon, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        padding: '20px', cursor: onClick ? 'pointer' : 'default', position: 'relative', overflow: 'hidden',
        transition: 'border-color 150ms, background 150ms',
      }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.borderColor = 'var(--border-hi)'; e.currentTarget.style.background = 'var(--bg-2)' }}}
      onMouseLeave={e => { if (onClick) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-1)' }}}
    >
      <div style={{ position: 'absolute', top: 16, right: 16, opacity: 0.15, color: 'var(--teal)' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 36, color: 'var(--text-1)', lineHeight: 1, marginBottom: 6 }}>{value}</div>
      {delta && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: deltaPositive ? 'var(--teal)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4 }}>{deltaPositive ? '↑' : '↓'} {delta}</div>}
    </div>
  )
}
```

## Badge (status genérico)

```tsx
const STATUS_MAP = {
  CONFIRMED: { label: 'Confirmado', color: 'var(--teal)',   bg: 'rgba(14,196,160,.12)' },
  SCHEDULED: { label: 'Agendado',   color: 'var(--amber)',  bg: 'rgba(245,166,35,.12)' },
  CANCELLED: { label: 'Cancelado',  color: 'var(--danger)', bg: 'rgba(224,85,85,.12)' },
  DONE:      { label: 'Realizado',  color: 'var(--text-3)', bg: 'rgba(74,100,120,.12)' },
  NO_SHOW:   { label: 'Falta',      color: 'var(--danger)', bg: 'rgba(224,85,85,.12)' },
  PAID:      { label: 'Pago',       color: 'var(--teal)',   bg: 'rgba(14,196,160,.12)' },
  PENDING:   { label: 'Pendente',   color: 'var(--amber)',  bg: 'rgba(245,166,35,.12)' },
  ACTIVE:    { label: 'Ativo',      color: 'var(--teal)',   bg: 'rgba(14,196,160,.12)' },
  INACTIVE:  { label: 'Inativo',    color: 'var(--text-3)', bg: 'rgba(74,100,120,.12)' },
}

export function Badge({ status }: { status: keyof typeof STATUS_MAP }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.PENDING
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
      padding: '2px 8px', borderRadius: 10, background: s.bg, color: s.color,
      border: `1px solid ${s.color}30`,
    }}>
      {s.label}
    </span>
  )
}
```

## SessionRow

```tsx
export function SessionRow({ session, index, onClick }: {
  session: { id: string; startTime: string; endTime: string; status: string; notes?: string }
  index: number; onClick: () => void
}) {
  const barColor = { CONFIRMED: 'var(--teal)', SCHEDULED: 'var(--amber)', DONE: 'var(--text-3)', CANCELLED: 'var(--danger)', NO_SHOW: 'var(--danger)' }[session.status] ?? 'var(--teal)'
  return (
    <div className="item-enter" onClick={onClick} style={{
      animationDelay: `${index * 40}ms`, display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 100ms',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(14,196,160,0.04)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)', width: 46, flexShrink: 0 }}>
        {format(new Date(session.startTime), 'HH:mm')}
      </div>
      <div style={{ width: 3, height: 34, borderRadius: 2, flexShrink: 0, background: barColor }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {session.notes ?? 'Sessão'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
          até {format(new Date(session.endTime), 'HH:mm')}
        </div>
      </div>
      <Badge status={session.status as any} />
      <ChevronRight size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
    </div>
  )
}
```

## ActionCard

```tsx
export function ActionCard({ icon, label, description, onClick, accentColor = 'var(--teal)' }: {
  icon: React.ReactNode; label: string; description: string; onClick: () => void; accentColor?: string
}) {
  return (
    <div onClick={onClick} style={{
      flex: 1, padding: '18px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8,
      border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-1)',
      transition: 'border-color 150ms, background 150ms',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.background = 'var(--bg-2)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: accentColor }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{label}</span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-3)', margin: 0, lineHeight: 1.5 }}>{description}</p>
    </div>
  )
}
```

## PageHeader

```tsx
export function PageHeader({ title, subtitle, actions }: {
  title: string; subtitle?: string; actions?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--text-1)', lineHeight: 1.2, marginBottom: 4 }}>
          {title}
        </h1>
        {subtitle && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)', margin: 0 }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </div>
  )
}
```

## SectionLabel / InfoRow / Divider

```tsx
export function SectionLabel({ children }: { children: string }) {
  return <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)',
    textTransform: 'uppercase', letterSpacing: '0.12em', padding: '10px 0 6px',
    borderBottom: '1px solid var(--border)', marginBottom: 12 }}>{children}</div>
}

export function InfoRow({ label, value, mono = false }: {
  label: string; value: string | number | React.ReactNode; mono?: boolean
}) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '5px 0' }}>
    <span style={{ fontSize: 11, color: 'var(--text-3)', flexShrink: 0, marginRight: 12 }}>{label}</span>
    <span style={{ fontSize: 11, color: 'var(--text-1)', textAlign: 'right', fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)' }}>{value}</span>
  </div>
}

export function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
}
```

## Avatar

```tsx
const AVATAR_COLORS = ['#0ec4a0', '#4a9eff', '#f5a623', '#e05555', '#a855f7', '#ec4899']

export function Avatar({ name, size = 30 }: { name: string; size?: number }) {
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
  const initials = name.split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join('')
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `${color}30`, border: `1.5px solid ${color}60`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: size * 0.37, color,
    }}>
      {initials}
    </div>
  )
}
```

## Button

```tsx
type ButtonVariant = 'primary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: 'var(--teal)', color: 'var(--bg-0)', border: 'none' },
  ghost:   { background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border)' },
  danger:  { background: 'rgba(224,85,85,.1)', color: 'var(--danger)', border: '1px solid rgba(224,85,85,.3)' },
}

const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '5px 10px', fontSize: 11 },
  md: { padding: '8px 16px', fontSize: 13 },
  lg: { padding: '10px 20px', fontSize: 14 },
}

const HOVER_BG: Record<ButtonVariant, string> = {
  primary: '#12dbb2', ghost: 'var(--bg-3)', danger: 'rgba(224,85,85,.18)',
}

export function Button({ variant = 'primary', size = 'md', icon, loading, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant; size?: ButtonSize; icon?: React.ReactNode; loading?: boolean
}) {
  return (
    <button {...props} disabled={loading || props.disabled} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 'var(--radius-md)',
      cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500, outline: 'none',
      transition: 'all 150ms', opacity: (loading || props.disabled) ? 0.6 : 1,
      ...VARIANT_STYLES[variant], ...SIZE_STYLES[size], ...props.style,
    }}
      onMouseEnter={e => { if (!loading && !props.disabled) (e.currentTarget as HTMLButtonElement).style.background = HOVER_BG[variant] }}
      onMouseLeave={e => { if (!loading && !props.disabled) (e.currentTarget as HTMLButtonElement).style.background = VARIANT_STYLES[variant].background as string }}>
      {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
      {children}
    </button>
  )
}
```

## Skeleton

```tsx
export function Skeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{
          display: 'flex', gap: 12, padding: '12px 18px',
          borderBottom: '1px solid var(--border)', opacity: 1 - i * 0.12,
        }}>
          <div className="animate-shimmer" style={{ width: 44, height: 13, borderRadius: 4, flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="animate-shimmer" style={{ height: 13, width: `${60 + i * 5}%`, borderRadius: 4 }} />
            <div className="animate-shimmer" style={{ height: 10, width: '35%', borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </>
  )
}
```

## EmptyState / ErrorState

```tsx
export function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode; title: string; description?: string; action?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '52px 20px', gap: 14 }}>
      <div style={{ position: 'relative' }}>
        {icon}
        <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: 'radial-gradient(var(--teal-10), transparent 70%)' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-2)', margin: '0 0 4px' }}>{title}</p>
        {description && <p style={{ fontSize: 12, color: 'var(--text-3)', margin: 0 }}>{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '44px 20px', gap: 12 }}>
      <WifiOff size={28} style={{ color: 'var(--danger)', opacity: 0.5 }} />
      <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0, textAlign: 'center' }}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
          borderRadius: 'var(--radius-md)', background: 'transparent',
          border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 12,
          cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 150ms',
        }}>
          <RefreshCw size={13} /> Tentar novamente
        </button>
      )}
    </div>
  )
}
```

## Input

```tsx
export function Field({ label, icon, error, children }: { label: string; icon?: React.ReactNode; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none', display: 'flex' }}>{icon}</span>}
        {children}
      </div>
      {error && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--danger)' }}>{error}</span>}
    </div>
  )
}
// Input style: background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius-md);
// padding: 9px 12px; color: var(--text-1); outline: none; width: 100%;
// Se tiver ícone: padding-left: 34px
// focus: border-color: var(--teal); box-shadow: 0 0 0 3px var(--teal-10);
```
