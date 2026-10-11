import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SidebarMemo } from '@/components/layout/Sidebar/Sidebar'
import { Topbar } from '@/components/layout/Topbar/Topbar'

const titleRules: Array<{ pattern: RegExp; title: string }> = [
  { pattern: /^\/dashboard$/, title: 'Dashboard' },
  { pattern: /^\/agenda\/new$/, title: 'Novo agendamento' },
  { pattern: /^\/agenda$/, title: 'Agenda' },
  { pattern: /^\/patients\/new$/, title: 'Novo paciente' },
  { pattern: /^\/patients\/[^/]+\/record$/, title: 'Prontuário' },
  { pattern: /^\/medical-records\/[^/]+$/, title: 'Prontuário' },
  { pattern: /^\/patients\/[^/]+$/, title: 'Detalhes do paciente' },
  { pattern: /^\/patients$/, title: 'Pacientes' },
  { pattern: /^\/financial$/, title: 'Financeiro' },
  { pattern: /^\/professionals\/new$/, title: 'Novo profissional' },
  { pattern: /^\/professionals$/, title: 'Profissionais' },
  { pattern: /^\/reports$/, title: 'Relatórios' },
  { pattern: /^\/settings$/, title: 'Configurações' },
]

export function AppLayout() {
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)
  const closeNav = useCallback(() => setNavOpen(false), [])

  const pageTitle = useMemo(
    () => titleRules.find((r) => r.pattern.test(location.pathname))?.title ?? 'Psyke',
    [location.pathname],
  )

  useEffect(() => {
    document.title = pageTitle === 'Psyke' ? 'Psyke — Clinic OS' : `${pageTitle} · Psyke`
  }, [pageTitle])

  // The sidebar closes itself on link clicks; Escape also dismisses the mobile drawer.
  useEffect(() => {
    if (!navOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navOpen])

  return (
    <div className="flex h-dvh overflow-hidden bg-bg-0 text-text-1">
      <a href="#main" className="skip-link">Ir para o conteúdo</a>
      <SidebarMemo open={navOpen} onClose={closeNav} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar title={pageTitle} onMenuClick={() => setNavOpen(true)} />
        <main
          id="main"
          key={location.pathname + location.search}
          tabIndex={-1}
          className="page-enter flex-1 overflow-y-auto px-4 py-5 outline-none sm:px-6 sm:py-6"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
