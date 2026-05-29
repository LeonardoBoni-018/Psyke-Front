import { StatCard } from '../components/StatCard/StatCard'

export function DashboardPage() {
  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Visão geral dos principais indicadores da clínica.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Pacientes ativos" value="128" />
        <StatCard label="Sessões hoje" value="18" />
        <StatCard label="Faturamento" value="R$ 24.800" />
      </div>
    </section>
  )
}
