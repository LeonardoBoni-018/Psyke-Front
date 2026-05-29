import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white/90 px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="text-lg font-semibold">Psyke</div>
          <nav className="flex flex-wrap gap-3 text-sm text-slate-600">
            <Link to="/" className="hover:text-slate-900">Dashboard</Link>
            <Link to="/agenda" className="hover:text-slate-900">Agenda</Link>
            <Link to="/patients" className="hover:text-slate-900">Pacientes</Link>
            <Link to="/medical-records" className="hover:text-slate-900">Prontuários</Link>
            <Link to="/financial" className="hover:text-slate-900">Financeiro</Link>
            <Link to="/professionals" className="hover:text-slate-900">Profissionais</Link>
            <Link to="/reports" className="hover:text-slate-900">Relatórios</Link>
            <Link to="/settings" className="hover:text-slate-900">Configurações</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  )
}
