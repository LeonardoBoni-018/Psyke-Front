import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Users, DollarSign, AlertCircle, CheckCircle2,
  CalendarPlus, UserPlus, Search, ChevronRight, RefreshCw,
  WifiOff } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/Button'
import { useDashboardSummary, useTodaySessions } from '../hooks/useDashboard'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { AppointmentResponse } from '@/types/appointment'
import type { AppointmentStatus } from '@/types/status'

function useCountUp(target: number, duration = 600) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!target && target !== 0) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

function fmtTime(iso: string) {
  return format(new Date(iso), 'HH:mm')
}

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; bg: string }> = {
  CONFIRMED: { label: 'Confirmado', color: 'var(--teal)', bg: 'rgba(14,196,160,0.1)' },
  SCHEDULED: { label: 'Pendente', color: 'var(--amber)', bg: 'rgba(245,166,35,0.1)' },
  DONE:      { label: 'Realizado', color: 'var(--text-3)', bg: 'rgba(74,100,120,0.1)' },
  CANCELLED: { label: 'Cancelado', color: 'var(--danger)', bg: 'rgba(224,85,85,0.1)' },
  NO_SHOW:   { label: 'Falta', color: 'var(--danger)', bg: 'rgba(224,85,85,0.1)' },
}

const BAR_COLORS: Record<AppointmentStatus, string> = {
  CONFIRMED: 'var(--teal)',
  SCHEDULED: 'var(--amber)',
  DONE:      'var(--text-3)',
  CANCELLED: 'var(--danger)',
  NO_SHOW:   'var(--danger)',
}

function MetricBlock({ label, value, sub, accent, countUp }: {
  label: string; value: string | number; sub?: string; accent?: string; countUp?: boolean
}) {
  const count = useCountUp(typeof value === 'number' ? value : 0)
  const display = countUp && typeof value === 'number' ? count : value
  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)',
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 36, color: accent ?? 'var(--text-1)',
        lineHeight: 1, marginBottom: 4 }}>
        {display}
      </div>
      {sub && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function SessionRow({ session, onClick }: { session: AppointmentResponse; onClick: () => void }) {
  const status = session.status as AppointmentStatus
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.SCHEDULED
  const barColor = BAR_COLORS[status] ?? 'var(--teal)'

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 20px', borderBottom: '1px solid var(--border)',
        cursor: 'pointer', transition: 'background 120ms',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(14,196,160,0.04)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)',
        width: 44, flexShrink: 0 }}>
        {fmtTime(session.startTime)}
      </div>

      <div style={{ width: 3, height: 36, borderRadius: 2, background: barColor, flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {session.notes || 'Sessão'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
          {fmtTime(session.startTime)} – {fmtTime(session.endTime)}
        </div>
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
        padding: '2px 8px', borderRadius: 10, flexShrink: 0,
        background: cfg.bg, color: cfg.color,
        border: `1px solid ${cfg.color}22`,
      }}>
        {cfg.label}
      </div>

      <ChevronRight size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
    </div>
  )
}

function ActionCard({ icon, label, description, onClick, accent }: {
  icon: React.ReactNode; label: string; description: string
  onClick: () => void; accent?: string
}) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1, padding: '18px 20px', cursor: 'pointer',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-1)', transition: 'all 150ms', display: 'flex',
        flexDirection: 'column', gap: 8,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = accent ?? 'var(--teal)'
        e.currentTarget.style.background = 'var(--bg-2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.background = 'var(--bg-1)'
      }}
    >
      <div style={{ color: accent ?? 'var(--teal)', display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon}
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{label}</span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-3)', margin: 0, lineHeight: 1.5 }}>
        {description}
      </p>
    </div>
  )
}

function ErrorBlock({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 20px', gap: 12 }}>
      <WifiOff size={28} style={{ color: 'var(--danger)', opacity: 0.6 }} />
      <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0, textAlign: 'center' }}>
        {message}
      </p>
      <button onClick={onRetry} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
        background: 'transparent', border: '1px solid var(--border)',
        color: 'var(--text-2)', fontSize: 12, fontFamily: 'var(--font-sans)',
        transition: 'all 150ms',
      }}>
        <RefreshCw size={13} /> Tentar novamente
      </button>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const {
    data: summary, isLoading: loadingSum, isError: errorSum,
  } = useDashboardSummary()

  const {
    data: sessions = [], isLoading: loadingSess, isError: errorSess, refetch: refetchSess,
  } = useTodaySessions()

  const today = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1)

  const confirmed = sessions.filter(s => s.status === 'CONFIRMED').length
  const pending = sessions.filter(s => s.status === 'SCHEDULED').length

  const firstName = user?.fullName?.split(' ')[0] ?? ''

  return (
    <div style={{ padding: '28px 28px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--text-1)',
            marginBottom: 2, lineHeight: 1.2 }}>
            {greeting()}{firstName ? `, ${firstName}.` : '.'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)' }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', margin: 0 }}>
              {todayCapitalized}
            </p>
          </div>
        </div>
        <Button size="md" icon={<CalendarPlus size={15} />} onClick={() => navigate('/agenda/new')}>
          Nova sessão
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, alignItems: 'start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{
            background: 'var(--bg-1)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={13} style={{ color: 'var(--teal)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)',
                textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hoje</span>
            </div>

            <div style={{ padding: '0 20px' }}>
              {loadingSum ? (
                <div style={{ padding: '20px 0' }}>
                  {[60, 40, 50].map((w, i) => (
                    <div key={i} style={{
                      height: 14, width: `${w}%`, borderRadius: 4, marginBottom: 12,
                      background: 'var(--bg-2)', position: 'relative', overflow: 'hidden',
                    }}>
                      <div className="animate-shimmer" style={{ position: 'absolute', inset: 0 }} />
                    </div>
                  ))}
                </div>
              ) : errorSum ? (
                <div style={{ padding: '20px 0', textAlign: 'center' }}>
                  <AlertCircle size={20} style={{ color: 'var(--danger)', opacity: 0.5, marginBottom: 8 }} />
                  <p style={{ fontSize: 11, color: 'var(--text-3)', margin: 0 }}>Sem conexão</p>
                </div>
              ) : (
                <>
                  <MetricBlock
                    label="Sessões"
                    value={summary?.todayAppointments ?? sessions.length}
                    sub={`${confirmed} confirmadas`}
                    accent="var(--text-1)"
                    countUp
                  />
                  <div style={{ height: 1, background: 'var(--border)' }} />
                  <MetricBlock
                    label="Pendentes"
                    value={summary?.appointmentsByStatus?.SCHEDULED ?? pending}
                    sub="aguardando conf."
                    accent={pending > 0 ? 'var(--amber)' : 'var(--text-1)'}
                    countUp
                  />
                  <div style={{ height: 1, background: 'var(--border)' }} />
                  <MetricBlock
                    label="Pacientes ativos"
                    value={summary?.totalPatients ?? '—'}
                    accent="var(--text-1)"
                    countUp={typeof summary?.totalPatients === 'number'}
                  />
                </>
              )}
            </div>
          </div>

          <div style={{ height: 12 }} />

          <div
            onClick={() => navigate('/patients')}
            style={{
              background: 'var(--bg-1)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '16px 20px', cursor: 'pointer',
              transition: 'all 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hi)'; e.currentTarget.style.background = 'var(--bg-2)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-1)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Users size={13} style={{ color: 'var(--info)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)',
                textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pacientes</span>
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--text-1)', lineHeight: 1 }}>
              {summary?.totalPatients ?? '—'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
              em tratamento ativo
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12,
              fontSize: 11, color: 'var(--info)' }}>
              Ver todos <ChevronRight size={12} />
            </div>
          </div>

          <div style={{ height: 12 }} />

          <div
            onClick={() => navigate('/financial')}
            style={{
              background: 'var(--bg-1)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '16px 20px', cursor: 'pointer',
              transition: 'all 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hi)'; e.currentTarget.style.background = 'var(--bg-2)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-1)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <DollarSign size={13} style={{ color: 'var(--teal)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)',
                textTransform: 'uppercase', letterSpacing: '0.1em' }}>Financeiro</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--teal)',
              marginBottom: 8, padding: '4px 8px', background: 'rgba(14,196,160,0.1)',
              borderRadius: 4, display: 'inline-block' }}>
              {(summary?.pendingAmount ?? 0) > 0
                ? `R$ ${Number(summary?.pendingAmount ?? 0).toFixed(2)} pendentes`
                : 'Em dia'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8,
              fontSize: 11, color: 'var(--info)' }}>
              Ver faturas <ChevronRight size={12} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: 'var(--bg-1)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>
                  Sessões de hoje
                </span>
                {!loadingSess && sessions.length > 0 && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11,
                    padding: '1px 7px', borderRadius: 10,
                    background: 'rgba(14,196,160,0.1)', color: 'var(--teal)',
                  }}>
                    {sessions.length}
                  </span>
                )}
              </div>
              <span onClick={() => navigate('/agenda')} style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--teal)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                transition: 'opacity 150ms',
              }} onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                Ver agenda <ChevronRight size={12} />
              </span>
            </div>

            {loadingSess ? (
              <div style={{ padding: '8px 0' }}>
                {[0.9, 0.7, 0.85, 0.6].map((op, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 20px',
                    borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 44, height: 14, borderRadius: 4, background: 'var(--bg-2)', position: 'relative', overflow: 'hidden' }}>
                      <div className="animate-shimmer" style={{ position: 'absolute', inset: 0 }} />
                    </div>
                    <div style={{ width: 3, height: 36, borderRadius: 2, background: 'var(--bg-2)', position: 'relative', overflow: 'hidden' }}>
                      <div className="animate-shimmer" style={{ position: 'absolute', inset: 0 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ width: `${op * 100}%`, height: 14, borderRadius: 4, marginBottom: 6, background: 'var(--bg-2)', position: 'relative', overflow: 'hidden' }}>
                        <div className="animate-shimmer" style={{ position: 'absolute', inset: 0 }} />
                      </div>
                      <div style={{ width: '40%', height: 10, borderRadius: 4, background: 'var(--bg-2)', position: 'relative', overflow: 'hidden' }}>
                        <div className="animate-shimmer" style={{ position: 'absolute', inset: 0 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : errorSess ? (
              <ErrorBlock
                message="Não foi possível carregar as sessões de hoje"
                onRetry={() => refetchSess()}
              />
            ) : sessions.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '48px 20px', gap: 12 }}>
                <CheckCircle2 size={32} style={{ color: 'var(--teal)', opacity: 0.3 }} />
                <p style={{ fontSize: 14, color: 'var(--text-3)', margin: 0 }}>
                  Nenhuma sessão agendada para hoje
                </p>
                <button
                  onClick={() => navigate('/agenda/new')}
                   style={{
                    display: 'flex', alignItems: 'center', gap: 6, marginTop: 4,
                    padding: '7px 14px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    background: 'rgba(14,196,160,0.1)', border: '1px solid rgba(14,196,160,0.3)',
                    color: 'var(--teal)', fontSize: 12, fontFamily: 'var(--font-sans)',
                    transition: 'all 150ms',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(14,196,160,0.18)'; e.currentTarget.style.borderColor = 'var(--teal)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(14,196,160,0.1)'; e.currentTarget.style.borderColor = 'rgba(14,196,160,0.3)' }}
                >
                  <CalendarPlus size={14} /> Agendar sessão
                </button>
              </div>
            ) : (
              <div>
                {sessions
                  .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                  .map((session, i) => (
                    <div key={session.id} className="item-enter" style={{ animationDelay: `${i * 40}ms` }}>
                      <SessionRow
                        session={session}
                        onClick={() => navigate('/agenda')}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--info)', opacity: 0.5 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)',
                textTransform: 'uppercase', letterSpacing: '0.1em' }}>Acesso rápido</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { icon: <CalendarPlus size={16} />, label: 'Agendar sessão', desc: 'Criar novo agendamento com slot disponível',                 path: '/agenda/new', accent: 'var(--teal)' },
                { icon: <UserPlus size={16} />, label: 'Novo paciente', desc: 'Cadastrar paciente e abrir prontuário', path: '/patients/new', accent: 'var(--info)' },
                { icon: <Search size={16} />, label: 'Buscar prontuário', desc: 'Acessar evoluções e anamnese', path: '/medical-records', accent: 'var(--amber)' },
              ].map((card, i) => (
                <div key={card.label} className="item-enter" style={{ flex: 1, animationDelay: `${i * 50}ms` }}>
                  <ActionCard
                    icon={card.icon}
                    label={card.label}
                    description={card.desc}
                    onClick={() => navigate(card.path)}
                    accent={card.accent}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
