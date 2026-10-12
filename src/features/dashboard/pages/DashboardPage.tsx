import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDays, endOfDay, format, isBefore, isSameDay, isWithinInterval, parseISO, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowUpRight, CalendarPlus, Check, ChevronRight, RefreshCw, UserPlus, Wallet } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useUpdateStatus } from '@/features/agenda/hooks/useAppointments'
import { useAgendaWindow, useDashboardSummary } from '../hooks/useDashboard'
import { useCountUp } from '@/hooks/useCountUp'
import { formatCurrency } from '@/lib/currency'
import type { AppointmentResponse } from '@/types/appointment'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

const upper1 = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** "Seg, 12 out às 09:30" */
function whenLabel(iso: string) {
  const d = parseISO(iso)
  const weekday = upper1(format(d, 'EEEE', { locale: ptBR }).slice(0, 3))
  return `${weekday}, ${format(d, 'd MMM', { locale: ptBR }).replace('.', '')} às ${format(d, 'HH:mm')}`
}

/* ---------- metrics ---------- */

function Metric({ label, value, format: fmt, hint, delay }: {
  label: string
  value: number
  format?: (n: number) => string
  hint?: string
  delay: number
}) {
  const animated = useCountUp(value)
  return (
    <div className="item-enter min-w-0 px-4 py-4 sm:px-6 sm:py-5" style={{ animationDelay: `${delay}ms` }}>
      <p className="text-[13px] text-text-2">{label}</p>
      <p className="mt-1.5 font-display text-[26px] font-semibold leading-none tracking-tight text-text-1 tabular sm:text-[34px]">
        {fmt ? fmt(animated) : Math.round(animated)}
      </p>
      {hint && <p className="mt-2 text-xs text-text-3">{hint}</p>}
    </div>
  )
}

function MetricsSkeleton() {
  return (
    <div className="surface grid grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3 px-6 py-5">
          <div className="animate-shimmer h-3 w-20 rounded" />
          <div className="animate-shimmer h-8 w-16 rounded" />
        </div>
      ))}
    </div>
  )
}

/* ---------- agenda timeline ---------- */

function TimelineRow({ session, index, onOpen, now, showDate }: {
  session: AppointmentResponse
  index: number
  onOpen: () => void
  now: Date
  /** Show the weekday/day above the time (used when the list spans several days). */
  showDate?: boolean
}) {
  const start = parseISO(session.startTime)
  const end = parseISO(session.endTime)
  const live = session.status === 'CONFIRMED' && isWithinInterval(now, { start, end })
  const done = session.status === 'DONE'
  const cancelled = session.status === 'CANCELLED' || session.status === 'NO_SHOW'

  return (
    <li className="item-enter relative" style={{ animationDelay: `${index * 55}ms` }}>
      <button
        type="button"
        onClick={onOpen}
        className="group flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left transition-colors hover:bg-bg-2"
      >
        <span className="w-14 shrink-0 text-right">
          {showDate && (
            <span className="block text-xs font-medium text-brand">{`${upper1(format(start, 'EEEE', { locale: ptBR }).slice(0, 3))} ${format(start, 'd')}`}</span>
          )}
          <span className="block text-[15px] font-semibold text-text-1 tabular">{format(start, 'HH:mm')}</span>
          {!showDate && <span className="block text-xs text-text-3 tabular">{format(end, 'HH:mm')}</span>}
        </span>

        <span className="relative flex h-full w-3 shrink-0 justify-center self-stretch" aria-hidden="true">
          <span className="absolute inset-y-[-12px] w-px bg-border" />
          <span
            className={`relative mt-2 h-3 w-3 rounded-full border-2 ${
              live
                ? 'animate-pulse-live border-brand bg-brand'
                : done
                  ? 'border-brand bg-brand'
                  : cancelled
                    ? 'border-border-hi bg-bg-1'
                    : 'border-brand bg-bg-1'
            }`}
          />
        </span>

        <span className="min-w-0 flex-1">
          <span className={`block truncate text-[15px] font-medium ${cancelled ? 'text-text-3 line-through' : 'text-text-1'}`}>
            {session.patientName ?? 'Paciente'}
          </span>
          <span className="block truncate text-[13px] text-text-3">
            {[session.professionalName, session.roomName].filter(Boolean).join(' · ') || 'Sessão'}
          </span>
          <span className="mt-1 inline-flex sm:hidden">
            {live ? (
              <span className="rounded-full bg-brand px-2 py-px text-[11px] font-semibold text-on-brand">Em andamento</span>
            ) : (
              <StatusBadge status={session.status} size="sm" />
            )}
          </span>
        </span>

        <span className="hidden sm:inline-flex">
          {live ? (
            <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-on-brand">Em andamento</span>
          ) : (
            <StatusBadge status={session.status} size="md" />
          )}
        </span>
        <ChevronRight size={16} className="hidden shrink-0 text-text-3 transition group-hover:translate-x-0.5 group-hover:text-text-2 sm:block" />
      </button>
    </li>
  )
}

/* ---------- 14-day chart ---------- */

function SessionsChart({ appointments, today }: { appointments: AppointmentResponse[]; today: Date }) {
  const days = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const date = addDays(startOfDay(today), i - 6)
      const count = appointments.filter(
        (a) => a.status !== 'CANCELLED' && isSameDay(parseISO(a.startTime), date),
      ).length
      return { date, count }
    })
  }, [appointments, today])

  const max = Math.max(4, ...days.map((d) => d.count))
  const total = days.reduce((n, d) => n + d.count, 0)

  return (
    <div className="surface p-5 sm:p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-[17px] text-text-1">Ritmo da agenda</h2>
          <p className="mt-0.5 text-[13px] text-text-2">Sessões por dia, uma semana atrás e uma à frente</p>
        </div>
        <p className="text-right text-[13px] text-text-3">
          <span className="font-display text-[22px] font-semibold text-text-1 tabular">{total}</span> sessões
        </p>
      </div>

      <div className="flex h-[150px] items-end gap-1.5 sm:gap-2" role="img" aria-label={`${total} sessões nos últimos 7 e próximos 7 dias`}>
        {days.map(({ date, count }, i) => {
          const isToday = isSameDay(date, today)
          const future = isBefore(today, startOfDay(date)) && !isToday
          return (
            <div key={date.toISOString()} className="group flex h-full flex-1 flex-col items-center justify-end gap-2" title={`${format(date, "EEE, d 'de' MMM", { locale: ptBR })}: ${count} sessões`}>
              <span className="text-xs font-medium text-text-2 opacity-0 transition-opacity group-hover:opacity-100 tabular">{count || ''}</span>
              <span
                className={`animate-grow w-full rounded-t-md ${
                  isToday ? 'bg-brand' : future ? 'bg-brand/30 group-hover:bg-brand/45' : 'bg-text-3/35 group-hover:bg-text-3/55'
                }`}
                style={{ height: `${Math.max(count ? 8 : 3, (count / max) * 100)}%`, animationDelay: `${i * 35}ms` }}
              />
              <span className={`text-xs ${isToday ? 'font-semibold text-brand' : 'text-text-3'}`}>
                {format(date, 'EEEEE', { locale: ptBR }).toUpperCase()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- page ---------- */

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const confirm = useUpdateStatus()

  const summary = useDashboardSummary()
  const windowQuery = useAgendaWindow()

  const now = new Date()
  const today = startOfDay(now)
  const appointments = useMemo(() => windowQuery.data ?? [], [windowQuery.data])

  const { todays, upcoming, toConfirm } = useMemo(() => {
    const sorted = [...appointments].sort((a, b) => a.startTime.localeCompare(b.startTime))
    const todays = sorted.filter((a) => isSameDay(parseISO(a.startTime), today))
    const upcoming = sorted.filter(
      (a) => parseISO(a.startTime) > endOfDay(today) && (a.status === 'SCHEDULED' || a.status === 'CONFIRMED'),
    )
    const toConfirm = sorted.filter((a) => a.status === 'SCHEDULED' && parseISO(a.startTime) >= today)
    return { todays, upcoming, toConfirm }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments])

  const firstName = user?.fullName?.split(' ')[0] ?? ''
  const dateLabel = upper1(format(now, "EEEE, d 'de' MMMM", { locale: ptBR }))
  const active = todays.filter((a) => a.status !== 'CANCELLED' && a.status !== 'NO_SHOW')
  const remaining = active.filter((a) => a.status === 'SCHEDULED' || a.status === 'CONFIRMED').length

  const headline =
    todays.length === 0
      ? 'Sem sessões marcadas para hoje.'
      : remaining === 0
        ? 'Todas as sessões de hoje foram concluídas.'
        : `${remaining} ${remaining === 1 ? 'sessão ainda por vir' : 'sessões ainda por vir'} hoje.`

  const loadingMetrics = summary.isLoading || windowQuery.isLoading

  return (
    <div className="space-y-6 pt-2 sm:pt-4">
      <header>
        <h1 className="text-[28px] leading-tight text-text-1 sm:text-[34px]">
          {greeting()}
          {firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="mt-1 text-[15px] text-text-2">
          {dateLabel} <span className="text-text-3">—</span> {headline}
        </p>
      </header>

      {summary.isError && windowQuery.isError ? (
        <div className="surface flex flex-col items-center gap-3 px-6 py-14 text-center">
          <p className="text-[15px] text-text-1">Não foi possível carregar o painel.</p>
          <p className="max-w-sm text-[13px] text-text-3">Verifique sua conexão. Se a API estava ociosa, ela pode levar alguns segundos para acordar.</p>
          <button
            type="button"
            onClick={() => { void summary.refetch(); void windowQuery.refetch() }}
            className="mt-1 inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-bg-1 px-4 text-[13px] font-semibold text-text-1 shadow-sm transition hover:bg-bg-2"
          >
            <RefreshCw size={14} /> Tentar novamente
          </button>
        </div>
      ) : (
        <>
          {loadingMetrics ? (
            <MetricsSkeleton />
          ) : (
            <section className="surface grid grid-cols-2 divide-border max-lg:[&>*:nth-child(n+3)]:border-t max-lg:[&>*:nth-child(even)]:border-l lg:grid-cols-4 lg:divide-x [&>*]:border-border" aria-label="Resumo">
              <Metric label="Sessões hoje" value={active.length} hint={`${active.filter((a) => a.status === 'CONFIRMED').length} confirmadas`} delay={0} />
              <Metric label="Aguardando confirmação" value={toConfirm.length} hint="nos próximos 7 dias" delay={60} />
              <Metric label="Pacientes ativos" value={summary.data?.totalPatients ?? 0} hint={`${summary.data?.totalProfessionals ?? 0} profissionais`} delay={120} />
              <Metric
                label="Receita do mês"
                value={summary.data?.monthlyRevenue ?? 0}
                format={formatCurrency}
                hint={`${formatCurrency(summary.data?.pendingAmount ?? 0)} a receber`}
                delay={180}
              />
            </section>
          )}

          <div className="dash-grid">
            <div className="min-w-0 space-y-6">
              <section className="surface p-3 sm:p-4" aria-labelledby="today-title">
                <div className="flex items-center justify-between px-3 pb-2 pt-2">
                  <h2 id="today-title" className="text-[17px] text-text-1">
                    {todays.length > 0 ? 'Agenda de hoje' : 'Próximas sessões'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => navigate('/agenda', { viewTransition: true })}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[13px] font-medium text-brand transition hover:bg-brand/10"
                  >
                    Abrir agenda <ArrowUpRight size={14} />
                  </button>
                </div>

                {windowQuery.isLoading ? (
                  <div className="space-y-3 p-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="animate-shimmer h-12 rounded-lg" style={{ opacity: 1 - i * 0.2 }} />
                    ))}
                  </div>
                ) : (todays.length > 0 ? todays : upcoming.slice(0, 6)).length === 0 ? (
                  <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                    <p className="text-[15px] text-text-1">Nada agendado por enquanto.</p>
                    <p className="max-w-xs text-[13px] text-text-3">Marque a próxima sessão para ver a agenda do dia aqui.</p>
                    <button
                      type="button"
                      onClick={() => navigate('/agenda/new', { viewTransition: true })}
                      className="mt-1 inline-flex h-9 items-center gap-2 rounded-lg bg-brand px-4 text-[13px] font-semibold text-on-brand shadow-sm transition hover:bg-brand-hi"
                    >
                      <CalendarPlus size={15} /> Agendar sessão
                    </button>
                  </div>
                ) : (
                  <ul className="py-1">
                    {(todays.length > 0 ? todays : upcoming.slice(0, 6)).map((s, i) => (
                      <TimelineRow
                        key={s.id}
                        session={s}
                        index={i}
                        now={now}
                        showDate={todays.length === 0}
                        onOpen={() => navigate('/agenda', { viewTransition: true })}
                      />
                    ))}
                  </ul>
                )}
              </section>

              <SessionsChart appointments={appointments} today={today} />
            </div>

            <aside className="min-w-0 space-y-6">
              <section className="surface p-5" aria-labelledby="attention-title">
                <h2 id="attention-title" className="text-[17px] text-text-1">Precisa de atenção</h2>
                <p className="mt-0.5 text-[13px] text-text-2">Sessões que ainda não foram confirmadas</p>

                {windowQuery.isLoading ? (
                  <div className="mt-4 space-y-2">
                    {[0, 1, 2].map((i) => <div key={i} className="animate-shimmer h-12 rounded-lg" />)}
                  </div>
                ) : toConfirm.length === 0 ? (
                  <div className="mt-4 flex items-center gap-3 rounded-lg bg-brand/10 px-3.5 py-3 text-[13px] text-brand">
                    <Check size={16} className="shrink-0" /> Tudo confirmado nos próximos dias.
                  </div>
                ) : (
                  <ul className="mt-3 divide-y divide-border">
                    {toConfirm.slice(0, 5).map((s, i) => (
                      <li key={s.id} className="item-enter flex items-center gap-3 py-3" style={{ animationDelay: `${i * 50}ms` }}>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-medium text-text-1">{s.patientName ?? 'Paciente'}</p>
                          <p className="text-xs text-text-3 tabular">
                            {whenLabel(s.startTime)}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={confirm.isPending && confirm.variables?.id === s.id}
                          onClick={() => confirm.mutate({ id: s.id, data: { status: 'CONFIRMED' } })}
                          className="inline-flex h-8 shrink-0 items-center rounded-md border border-border bg-bg-1 px-3 text-[13px] font-semibold text-text-1 shadow-sm transition hover:border-brand hover:text-brand disabled:opacity-50"
                        >
                          Confirmar
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="surface p-2" aria-label="Atalhos">
                {[
                  { icon: <CalendarPlus size={18} />, label: 'Agendar sessão', desc: 'Escolha paciente, profissional e horário', path: '/agenda/new' },
                  { icon: <UserPlus size={18} />, label: 'Novo paciente', desc: 'Cadastre e abra o prontuário', path: '/patients/new' },
                  { icon: <Wallet size={18} />, label: 'Cobranças', desc: `${formatCurrency(summary.data?.pendingAmount ?? 0)} em aberto`, path: '/financial' },
                ].map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path, { viewTransition: true })}
                    className="group flex w-full items-center gap-3.5 rounded-lg px-3 py-3 text-left transition-colors hover:bg-bg-2"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-2 text-text-2 transition-colors group-hover:bg-brand/10 group-hover:text-brand">
                      {item.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-medium text-text-1">{item.label}</span>
                      <span className="block truncate text-xs text-text-3">{item.desc}</span>
                    </span>
                    <ChevronRight size={16} className="text-text-3 transition group-hover:translate-x-0.5" />
                  </button>
                ))}
              </section>
            </aside>
          </div>
        </>
      )}
    </div>
  )
}
