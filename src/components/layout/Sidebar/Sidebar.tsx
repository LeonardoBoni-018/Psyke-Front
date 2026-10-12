import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  BarChart3,
  Stethoscope,
  Settings,
  LogOut,
  ChevronsUpDown,
  X,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Logo } from '@/components/brand/Logo'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useLogout } from '@/features/auth/hooks/useAuth'

interface NavItem {
  label: string
  icon: typeof LayoutDashboard
  path: string
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: 'Clínica',
    items: [
      { label: 'Painel', icon: LayoutDashboard, path: '/dashboard' },
      { label: 'Agenda', icon: CalendarDays, path: '/agenda' },
      { label: 'Pacientes', icon: Users, path: '/patients' },
    ],
  },
  {
    title: 'Gestão',
    items: [
      { label: 'Financeiro', icon: Wallet, path: '/financial' },
      { label: 'Relatórios', icon: BarChart3, path: '/reports' },
      { label: 'Profissionais', icon: Stethoscope, path: '/professionals' },
      { label: 'Configurações', icon: Settings, path: '/settings' },
    ],
  },
]

const allPaths = navGroups.flatMap((g) => g.items.map((i) => i.path))

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('')
}

/** Finds which nav entry owns the current URL (e.g. /patients/123/record -> /patients). */
function activePathFor(pathname: string) {
  return allPaths.find((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function UserMenu() {
  const user = useAuthStore((s) => s.user)
  const { mutate: logout } = useLogout()
  const navigate = useNavigate()
  const initials = useMemo(() => getInitials(user?.fullName ?? 'Usuário'), [user])
  const roleLabels: Record<string, string> = {
    ROLE_ADMIN: 'Administração',
    ROLE_PROFESSIONAL: 'Profissional',
    ROLE_RECEPTIONIST: 'Recepção',
  }
  const roleLabel = roleLabels[user?.roles?.[0] ?? ''] ?? 'Equipe'

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Menu da conta"
          className="group flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-bg-1 hover:shadow-sm data-[state=open]:bg-bg-1 data-[state=open]:shadow-sm"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[13px] font-bold text-brand">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-text-1">{user?.fullName ?? 'Usuário'}</span>
            <span className="block truncate text-xs text-text-3">{roleLabel}</span>
          </span>
          <ChevronsUpDown size={15} className="shrink-0 text-text-3 transition group-hover:text-text-2" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="top"
          align="start"
          sideOffset={8}
          className="animate-pop-in z-[100] min-w-[210px] rounded-lg border border-border bg-bg-1 p-1.5 shadow-lg"
        >
          <div className="px-2.5 pb-2 pt-1.5">
            <p className="truncate text-[13px] font-semibold text-text-1">{user?.fullName}</p>
            <p className="truncate text-xs text-text-3">{user?.email}</p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item
            onSelect={() => navigate('/settings')}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-text-1 outline-none data-[highlighted]:bg-bg-2"
          >
            <Settings size={15} className="text-text-3" /> Configurações
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => logout()}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-danger outline-none data-[highlighted]:bg-danger/10"
          >
            <LogOut size={15} /> Sair
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

interface SidebarProps {
  /** Mobile drawer state; on lg+ the sidebar is always visible. */
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const { pathname } = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null)
  const activePath = activePathFor(pathname)

  // The active "pill" slides between items instead of jumping. It is re-measured when web fonts finish
  // loading and whenever the nav is resized, because both change the items' positions.
  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const measure = () => {
      const el = nav.querySelector<HTMLElement>('[data-active="true"]')
      setIndicator(el ? { top: el.offsetTop, height: el.offsetHeight } : null)
    }
    measure()
    void document.fonts?.ready.then(measure)
    const ro = new ResizeObserver(measure)
    ro.observe(nav)
    nav.querySelectorAll('a').forEach((a) => ro.observe(a))
    return () => ro.disconnect()
  }, [activePath, open])

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-[var(--scrim)] backdrop-blur-[2px] transition-opacity duration-200 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        id="app-sidebar"
        aria-label="Navegação principal"
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-bg-0 px-3 pb-3 pt-4 shadow-lg transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-[248px] lg:min-w-[248px] lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-2 pb-5">
          <div className="flex items-center gap-2.5">
            <Logo size={34} />
            <span className="font-display text-[21px] font-semibold tracking-tight text-text-1">Psyke</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-3 transition hover:bg-bg-1 hover:text-text-1 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav ref={navRef} className="relative flex-1 space-y-5 overflow-y-auto">
          {indicator && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 rounded-lg border border-border bg-bg-1 shadow-sm transition-[transform,height] duration-300 ease-[var(--ease-out)]"
              style={{ top: 0, height: indicator.height, transform: `translateY(${indicator.top}px)` }}
            />
          )}
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 pb-1.5 text-xs font-medium text-text-3">{group.title}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = activePath === item.path
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      viewTransition
                      onClick={onClose}
                      data-active={active}
                      className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors duration-150 lg:py-2 ${
                        active ? 'text-text-1' : 'text-text-2 hover:text-text-1'
                      }`}
                    >
                      <item.icon
                        size={18}
                        strokeWidth={active ? 2.2 : 1.9}
                        aria-hidden="true"
                        className={`transition-colors ${active ? 'text-brand' : ''}`}
                      />
                      {item.label}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border pt-3">
          <UserMenu />
        </div>
      </aside>
    </>
  )
}

export const SidebarMemo = memo(Sidebar)
