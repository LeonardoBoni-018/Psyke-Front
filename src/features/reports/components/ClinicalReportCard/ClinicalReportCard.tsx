import type { ClinicalReportSummary } from '@/types/reports'

interface ClinicalReportCardProps {
  report: ClinicalReportSummary
}

export function ClinicalReportCard({ report }: ClinicalReportCardProps) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-1">Resumo clínico</h2>
          <p className="mt-1 text-sm text-text-3">Desempenho de adesão e evolução dos prontuários.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-lg)] border border-border bg-bg-2 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-text-3">Aderência</p>
          <p className="mt-3 text-2xl font-semibold text-text-1">{report.adherenceRate.toFixed(0)}%</p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-border bg-bg-2 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-text-3">Prontuários ativos</p>
          <p className="mt-3 text-2xl font-semibold text-text-1">{report.activeRecords}</p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-border bg-bg-2 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-text-3">Novos pacientes</p>
          <p className="mt-3 text-2xl font-semibold text-text-1">{report.newPatients}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-bg-2 p-4">
        <p className="text-sm font-semibold text-text-1">Principais diagnósticos</p>
        <div className="mt-4 space-y-3">
          {report.topDiagnoses.map((diagnosis) => (
            <div key={diagnosis.name} className="flex items-center justify-between gap-4">
              <span className="text-sm text-text-2">{diagnosis.name}</span>
              <span className="text-sm font-semibold text-text-1">{diagnosis.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
