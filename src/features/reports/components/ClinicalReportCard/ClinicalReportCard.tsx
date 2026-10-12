import { useCountUp } from '@/hooks/useCountUp'
import type { ReportSummary } from '@/types/reports'

const statusLabels: Record<string, string> = {
  DONE: 'Realizadas',
  CONFIRMED: 'Confirmadas',
  SCHEDULED: 'Agendadas',
  CANCELLED: 'Canceladas',
  NO_SHOW: 'Faltas',
}

const statusTone: Record<string, string> = {
  DONE: 'bg-brand',
  CONFIRMED: 'bg-brand/60',
  SCHEDULED: 'bg-amber',
  CANCELLED: 'bg-text-3/60',
  NO_SHOW: 'bg-danger',
}

function Stat({ label, value, suffix, hint }: { label: string; value: number; suffix?: string; hint?: string }) {
  const animated = useCountUp(value)
  return (
    <div>
      <p className="text-[13px] text-text-2">{label}</p>
      <p className="mt-1 font-display text-[30px] font-semibold leading-none tracking-tight text-text-1 tabular">
        {suffix === '%' ? animated.toFixed(1).replace('.', ',') : Math.round(animated)}
        {suffix && <span className="ml-0.5 text-[18px] text-text-2">{suffix}</span>}
      </p>
      {hint && <p className="mt-1.5 text-xs text-text-3">{hint}</p>}
    </div>
  )
}

export function ClinicalReportCard({ report }: { report: ReportSummary }) {
  const statuses = Object.entries(report.appointmentsByStatus).sort((a, b) => b[1] - a[1])
  const professionals = [...report.sessionsByProfessional].sort((a, b) => b.sessions - a.sessions)
  const maxSessions = Math.max(1, ...professionals.map((p) => p.sessions))

  return (
    <section className="surface p-5 sm:p-6" aria-labelledby="clin-title">
      <h2 id="clin-title" className="text-[17px] text-text-1">Atendimentos</h2>
      <p className="mt-0.5 text-[13px] text-text-2">{report.totalAppointments} sessões no período</p>

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5">
        <Stat label="Comparecimento" value={report.attendanceRate} suffix="%" hint="realizadas ÷ (realizadas + faltas)" />
        <Stat label="Cancelamentos" value={report.cancellationRate} suffix="%" hint="canceladas ÷ total" />
        <Stat label="Novos pacientes" value={report.newPatients} />
        <Stat label="Pacientes ativos" value={report.activePatients} />
      </div>

      {statuses.length > 0 && (
        <div className="mt-7">
          <p className="mb-2.5 text-[13px] font-medium text-text-2">Situação das sessões</p>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-bg-2" role="img" aria-label="Distribuição das sessões por situação">
            {statuses.map(([status, count]) => (
              <span
                key={status}
                className={`${statusTone[status] ?? 'bg-text-3/40'} transition-[width] duration-700`}
                style={{ width: `${(count / Math.max(1, report.totalAppointments)) * 100}%` }}
              />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {statuses.map(([status, count]) => (
              <li key={status} className="flex items-center gap-1.5 text-xs text-text-2">
                <span className={`h-2 w-2 rounded-full ${statusTone[status] ?? 'bg-text-3/40'}`} />
                {statusLabels[status] ?? status} <span className="font-semibold text-text-1 tabular">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {professionals.length > 0 && (
        <div className="mt-7">
          <p className="mb-3 text-[13px] font-medium text-text-2">Sessões por profissional</p>
          <ul className="space-y-3">
            {professionals.map((p, i) => (
              <li key={p.professionalId}>
                <div className="mb-1 flex items-baseline justify-between gap-3 text-[13px]">
                  <span className="truncate text-text-1">{p.name}</span>
                  <span className="font-semibold text-text-1 tabular">{p.sessions}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-bg-2">
                  <span
                    className="rise-in block h-full rounded-full bg-brand"
                    style={{ width: `${(p.sessions / maxSessions) * 100}%`, animationDelay: `${i * 80}ms` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
