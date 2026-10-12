import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SidebarMemo } from '@/components/layout/Sidebar/Sidebar'
import { Topbar } from '@/components/layout/Topbar/Topbar'
import { CommandPalette } from '@/components/layout/CommandPalette/CommandPalette'

const titleRules: Array<{ pattern: RegExp; title: string }> = [
  { pattern: /^\/dashboard$/, title: 'Painel' },
  { pattern: /^\/agenda\/new$/, title: 'Novo agendamento' },
  { pattern: /^\/agenda$/, title: 'Agenda' },
  { pattern: /^\/patients\/new$/, title: 'Novo paciente' },
  { pattern: /^\/patients\/[^/]+\/record$/, title: 'Prontuário' },
  { pattern: /^\/medical-records\/[^/]+$/, title: 'Prontuário' },
  { pattern: /^\/patients\/[^/]+$/, title: 'Paciente' },
  { pattern: /^\/patients$/, title: 'Pacientes' },
  { pattern: /^\/financial$/, title: 'Financeiro' },
  { pattern: /^\/professionals\/new$/, title: 'Novo profissional' },
  { pattern: /^\/professionals\/[^/]+\/edit$/, title: 'Editar profissional' },
  { pattern: /^\/professionals$/, title: 'Profissionais' },
  { pattern: /^\/reports$/, title: 'Relatórios' },
  { pattern: /^\/settings$/, title: 'Configurações' },
]

export function AppLayout() {
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const closeNav = useCallback(() => setNavOpen(false), [])

  const pageTitle = useMemo(
    () => titleRules.find((r) => r.pattern.test(location.pathname))?.title ?? 'Psyke',
    [location.pathname],
  )

  useEffect(() => {
    document.title = pageTitle === 'Psyke' ? 'Psyke' : `${pageTitle} · Psyke`
  }, [pageTitle])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setNavOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex h-dvh overflow-hidden bg-bg-0 text-text-1">
      <a href="#main" className="skip-link">Ir para o conteúdo</a>
      <SidebarMemo open={navOpen} onClose={closeNav} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setNavOpen(true)} onSearchClick={() => setPaletteOpen(true)} />
        <main
          id="main"
          key={location.pathname + location.search}
          tabIndex={-1}
          className="page-enter flex-1 overflow-y-auto px-4 pb-10 pt-2 outline-none sm:px-6"
        >
          <div className="mx-auto w-full max-w-[1280px]">
            <Outlet />
          </div>
        </main>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  )
}
