import { useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SidebarMemo } from '@/components/layout/Sidebar/Sidebar'
import { Topbar } from '@/components/layout/Topbar/Topbar'

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/agenda': 'Agenda',
  '/patients': 'Pacientes',
  '/medical-records': 'Prontuários',
  '/financial': 'Financeiro',
  '/professionals': 'Profissionais',
  '/reports': 'Relatórios',
  '/settings': 'Configurações',
}

export function AppLayout() {
  const location = useLocation()

  const pageTitle = useMemo(() => titles[location.pathname] ?? 'Psyke', [location.pathname])

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
