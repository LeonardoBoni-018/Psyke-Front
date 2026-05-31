import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Clock, Users, DollarSign, CheckCircle, XCircle, AlertCircle, Plus, FileText, Search } from 'lucide-react'
import { useDashboardSummary, useTodaySessions } from '@/features/dashboard/hooks/useDashboard'

type SessionStatus = 'SCHEDULED' | 'CONFIRMED' | 'DONE' | 'CANCELLED' | 'NO_SHOW'

interface StatusConfig {
  label: string
  className: string
  icon: typeof CheckCircle
}

const statusConfig: Record<SessionStatus, StatusConfig> = {
  CONFIRMED: { label: 'Confirmado', className: 'bg-teal/15 text-teal', icon: CheckCircle },
  DONE: { label: 'Realizado', className: 'bg-teal/15 text-teal', icon: CheckCircle },
  SCHEDULED: { label: 'Agendado', className: 'bg-amber/15 text-amber', icon: Clock },
  CANCELLED: { label: 'Cancelado', className: 'bg-danger/15 text-danger', icon: XCircle },
  NO_SHOW: { label: 'Não compareceu', className: 'bg-danger/15 text-danger', icon: AlertCircle },
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

function SummarySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 shadow-sm">
          <div className="h-3 w-20 rounded bg-bg-2" />
          <div className="mt-3 h-7 w-16 rounded bg-bg-2" />
        </div>
      ))}
    </div>
  )
}

function TimelineSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-[var(--radius-xl)] border border-border bg-bg-1 p-4 shadow-sm">
          <div className="h-4 w-12 rounded bg-bg-2" />
          <div className="h-4 flex-1 rounded bg-bg-2" />
          <div className="h-5 w-24 rounded-full bg-bg-2" />
        </div>
      ))}
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, bgClass }: { icon: typeof Calendar; label: string; value: string; bgClass: string }) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-5 shadow-sm transition hover:border-border-hi">
      <div className="flex items-center justify-between">
        <p className="text-[12px] uppercase tracking-[0.1em] text-text-3">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bgClass}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold text-text-1 font-mono">{value}</p>
    </div>
  )
}

function TimelineCard({ session }: { session: { id: string; patientName: string; startTime: string; endTime: string; status: string; approach?: string } }) {
  const status = (session.status || 'SCHEDULED') as SessionStatus
  const config = statusConfig[status] || statusConfig.SCHEDULED
  const StatusIcon = config.icon

  return (
    <div className="group rounded-[var(--radius-xl)] border border-border bg-bg-1 p-4 shadow-sm transition hover:border-border-hi hover:bg-bg-2">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center font-mono text-[13px] leading-tight">
          <span className="font-medium text-text-1">{session.startTime}</span>
          <span className="text-text-3">{session.endTime}</span>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-1 truncate">{session.patientName}</p>
          {session.approach && (
            <p className="text-[12px] text-text-3 mt-0.5">{session.approach}</p>
          )}
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium font-mono ${config.className}`}>
          <StatusIcon size={11} />
          {config.label}
        </span>
      </div>
    </div>
  )
}

function QuickActionButton({ icon: Icon, label, onClick }: { icon: typeof Plus; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-[var(--radius-xl)] border border-border bg-bg-1 p-4 shadow-sm text-sm text-text-2 transition hover:border-teal hover:bg-teal/5 hover:text-text-1"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal/10 text-teal">
        <Icon size={17} />
      </div>
      <span className="font-medium">{label}</span>
    </button>
  )
}

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading, isError: summaryError, refetch: refetchSummary } = useDashboardSummary()
  const { data: sessions, isLoading: sessionsLoading, isError: sessionsError, refetch: refetchSessions } = useTodaySessions()

  const todayFormatted = format(new Date(), "d MMM yyyy", { locale: ptBR })
  const isMorning = new Date().getHours() < 12
  const greeting = isMorning ? 'Bom dia' : 'Boa tarde'

  return (
    <div className="space-y-8 page-enter">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif text-text-1">{greeting}, Dr(a).</h1>
          <p className="mt-1 text-sm text-text-3">{todayFormatted}</p>
        </div>
      </div>

      {summaryLoading ? (
        <SummarySkeleton />
      ) : summaryError ? (
        <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10 text-danger">
            <AlertCircle size={22} />
          </div>
          <p className="mt-4 text-text-2">Erro ao carregar resumo do dashboard</p>
          <button
            type="button"
            onClick={() => refetchSummary()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-bg-2 px-4 py-2 text-sm text-text-2 transition hover:border-border-hi"
          >
            Tentar novamente
          </button>
        </div>
      ) : summary ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard icon={Calendar} label="Sessões hoje" value={String(summary.sessionsToday)} bgClass="bg-teal/10 text-teal" />
          <SummaryCard icon={Clock} label="Pendentes confirmação" value={String(summary.pendingConfirmations)} bgClass="bg-amber/10 text-amber" />
          <SummaryCard icon={Users} label="Pacientes ativos" value={String(summary.activePatients)} bgClass="bg-info/10 text-info" />
          <SummaryCard icon={DollarSign} label="Receita do mês" value={formatBRL(summary.revenueMonth)} bgClass="bg-teal/10 text-teal" />
        </div>
      ) : null}

      <section>
        <h2 className="mb-4 text-base font-semibold text-text-1">Timeline do dia</h2>

        {sessionsLoading ? (
          <TimelineSkeleton />
        ) : sessionsError ? (
          <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <AlertCircle size={22} />
            </div>
            <p className="mt-4 text-text-2">Erro ao carregar sessões do dia</p>
            <button
              type="button"
              onClick={() => refetchSessions()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-bg-2 px-4 py-2 text-sm text-text-2 transition hover:border-border-hi"
            >
              Tentar novamente
            </button>
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session) => (
              <TimelineCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-bg-2 text-text-3">
              <Calendar size={22} />
            </div>
            <p className="mt-4 text-text-2">Nenhuma sessão agendada para hoje</p>
          </div>
        )}
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <QuickActionButton icon={Plus} label="Novo agendamento" />
        <QuickActionButton icon={FileText} label="Novo paciente" />
        <QuickActionButton icon={Search} label="Buscar prontuário" />
      </div>
    </div>
  )
}
