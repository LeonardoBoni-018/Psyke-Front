import { useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { format, isAfter, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeft, ArrowUpRight, CalendarPlus, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { usePatient } from '@/features/patients/hooks/usePatient'
import { usePatientAppointments, usePatientInvoices } from '@/features/patients/hooks/usePatientHistory'
import { formatCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/date'

const initials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')

const upper1 = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-text-3">{label}</dt>
      <dd className="mt-0.5 break-words text-[14px] text-text-1">{value || '—'}</dd>
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <p className="text-xs text-text-3">{label}</p>
      <p className="mt-0.5 font-display text-[22px] font-semibold leading-tight tracking-tight text-text-1 tabular">{value}</p>
      {hint && <p className="text-xs text-text-3">{hint}</p>}
    </div>
  )
}

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: patient, isLoading, isError } = usePatient(id!)
  const appointments = usePatientAppointments(id!)
  const invoices = usePatientInvoices(id!)

  const history = useMemo(
    () => [...(appointments.data ?? [])].sort((a, b) => b.startTime.localeCompare(a.startTime)),
    [appointments.data],
  )

  const summary = useMemo(() => {
    const now = new Date()
    const done = history.filter((a) => a.status === 'DONE')
    const upcoming = history
      .filter((a) => (a.status === 'SCHEDULED' || a.status === 'CONFIRMED') && isAfter(parseISO(a.startTime), now))
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
    const pending = (invoices.data?.content ?? []).filter((i) => i.status === 'PENDING')
    return {
      sessions: done.length,
      last: done[0],
      next: upcoming[0],
      pendingAmount: pending.reduce((sum, i) => sum + Number(i.amount), 0),
      pendingCount: pending.length,
    }
  }, [history, invoices.data])

  if (isLoading) {
    return (
      <div className="space-y-5 pt-4">
        <div className="animate-shimmer h-5 w-24 rounded" />
        <div className="animate-shimmer h-28 rounded-xl" />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="animate-shimmer h-72 rounded-xl" />
          <div className="animate-shimmer h-72 rounded-xl" />
        </div>
      </div>
    )
  }

  if (isError || !patient) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-[15px] text-text-1">Não foi possível carregar este paciente.</p>
        <Button variant="ghost" size="md" onClick={() => navigate('/patients', { viewTransition: true })} icon={<ArrowLeft size={14} />}>
          Voltar para pacientes
        </Button>
      </div>
    )
  }

  const statusLabel = patient.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'

  return (
    <div className="space-y-5 pt-2 sm:pt-4">
      <Link to="/patients" viewTransition className="inline-flex items-center gap-1.5 text-[13px] text-text-2 transition hover:text-text-1">
        <ArrowLeft size={14} /> Pacientes
      </Link>

      <header className="surface flex flex-wrap items-center gap-x-5 gap-y-4 p-5 sm:p-6">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-[24px] font-semibold text-brand">
          {initials(patient.fullName)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-[26px] leading-tight text-text-1 sm:text-[30px]">{patient.fullName}</h1>
            <StatusBadge status={statusLabel} />
          </div>
          <p className="mt-1 text-[14px] text-text-2">
            Paciente desde {formatDate(patient.createdAt)}
            {summary.sessions > 0 && <> · {summary.sessions} {summary.sessions === 1 ? 'sessão realizada' : 'sessões realizadas'}</>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="md" icon={<CalendarPlus size={15} />} onClick={() => navigate('/agenda/new', { viewTransition: true })}>
            Agendar sessão
          </Button>
          <Button size="md" icon={<FileText size={15} />} onClick={() => navigate(`/patients/${patient.id}/record`, { viewTransition: true })}>
            Prontuário
          </Button>
        </div>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-5">
          <section className="surface p-5 sm:p-6" aria-labelledby="data-title">
            <h2 id="data-title" className="text-[17px] text-text-1">Dados pessoais</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <Info label="Nascimento" value={formatDate(patient.birthDate)} />
              <Info label="CPF" value={patient.cpf} />
              <Info label="E-mail" value={patient.email} />
              <Info label="Telefone" value={patient.phone} />
              <Info label="Gênero" value={patient.gender} />
              <Info label="Estado civil" value={patient.maritalStatus} />
              <Info label="Profissão" value={patient.occupation} />
              <Info label="Indicado por" value={patient.referredBy} />
              {patient.insurance && (
                <Info label="Convênio" value={`${patient.insurance}${patient.insuranceNumber ? ` · ${patient.insuranceNumber}` : ''}`} />
              )}
            </dl>
          </section>

          <section className="surface p-3 sm:p-4" aria-labelledby="history-title">
            <div className="flex items-center justify-between px-3 pb-2 pt-2">
              <h2 id="history-title" className="text-[17px] text-text-1">Histórico de sessões</h2>
              <span className="text-[13px] text-text-3 tabular">{history.length} no total</span>
            </div>
            {appointments.isLoading ? (
              <div className="space-y-2 p-3">
                {[0, 1, 2].map((i) => <div key={i} className="animate-shimmer h-12 rounded-lg" />)}
              </div>
            ) : history.length === 0 ? (
              <p className="px-3 py-10 text-center text-[14px] text-text-3">Nenhuma sessão registrada ainda.</p>
            ) : (
              <ul>
                {history.slice(0, 8).map((a, i) => (
                  <li key={a.id} className="item-enter flex items-center gap-4 rounded-lg px-3 py-3 hover:bg-bg-2" style={{ animationDelay: `${i * 40}ms` }}>
                    <span className="w-24 shrink-0">
                      <span className="block text-[14px] font-semibold text-text-1 tabular">{format(parseISO(a.startTime), 'dd/MM/yyyy')}</span>
                      <span className="block text-xs text-text-3 tabular">{upper1(format(parseISO(a.startTime), "EEE · HH:mm", { locale: ptBR }))}</span>
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[14px] text-text-2">
                      {a.professionalName ?? 'Profissional'}{a.roomName ? ` · ${a.roomName}` : ''}
                    </span>
                    <StatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="min-w-0 space-y-5">
          <section className="surface grid grid-cols-2 gap-x-4 gap-y-5 p-5" aria-label="Resumo">
            <Stat label="Sessões realizadas" value={String(summary.sessions)} />
            <Stat label="Em aberto" value={formatCurrency(summary.pendingAmount)} hint={summary.pendingCount ? `${summary.pendingCount} cobrança(s)` : undefined} />
            <Stat label="Última sessão" value={summary.last ? formatDate(summary.last.startTime) : '—'} />
            <Stat label="Próxima" value={summary.next ? format(parseISO(summary.next.startTime), 'dd/MM HH:mm') : '—'} />
          </section>

          <section className="surface p-3 sm:p-4" aria-labelledby="inv-title">
            <div className="flex items-center justify-between px-3 pb-2 pt-2">
              <h2 id="inv-title" className="text-[17px] text-text-1">Cobranças</h2>
              <Link
                to={`/financial?patientId=${patient.id}`}
                viewTransition
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[13px] font-medium text-brand transition hover:bg-brand/10"
              >
                Ver todas <ArrowUpRight size={14} />
              </Link>
            </div>
            {invoices.isLoading ? (
              <div className="space-y-2 p-3">
                {[0, 1].map((i) => <div key={i} className="animate-shimmer h-11 rounded-lg" />)}
              </div>
            ) : (invoices.data?.content ?? []).length === 0 ? (
              <p className="px-3 py-8 text-center text-[14px] text-text-3">Sem cobranças.</p>
            ) : (
              <ul>
                {invoices.data?.content.slice(0, 5).map((inv) => (
                  <li key={inv.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-bg-2">
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold text-text-1 tabular">{formatCurrency(inv.amount)}</span>
                      <span className="block text-xs text-text-3 tabular">{formatDate(inv.createdAt)}</span>
                    </span>
                    <StatusBadge status={inv.status} label={inv.status === 'CANCELLED' ? 'Cancelada' : undefined} size="sm" />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}
