import { useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SidebarMemo } from '@/components/layout/Sidebar/Sidebar'
import { Topbar } from '@/components/layout/Topbar/Topbar'

const titleRules: Array<{ pattern: RegExp; getTitle: () => string }> = [
  { pattern: /^\/dashboard$/, getTitle: () => 'Dashboard' },
  { pattern: /^\/agenda$/, getTitle: () => 'Agenda' },
  { pattern: /^\/patients\/[^/]+\/record$/, getTitle: () => 'Prontuário' },
  { pattern: /^\/patients\/[^/]+$/, getTitle: () => 'Detalhes do paciente' },
  { pattern: /^\/patients$/, getTitle: () => 'Pacientes' },
  { pattern: /^\/financial$/, getTitle: () => 'Financeiro' },
  { pattern: /^\/professionals$/, getTitle: () => 'Profissionais' },
  { pattern: /^\/reports$/, getTitle: () => 'Relatórios' },
  { pattern: /^\/settings$/, getTitle: () => 'Configurações' },
]

export function AppLayout() {
  const location = useLocation()

  const pageTitle = useMemo(
    () => titleRules.find((r) => r.pattern.test(location.pathname))?.getTitle() ?? 'Psyke',
    [location.pathname],
  )

  return (
    <div className="flex h-screen overflow-hidden bg-bg-0 text-text-1">
      <SidebarMemo />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={pageTitle} />
        <div className="flex-1 overflow-y-auto px-6 py-6 page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
