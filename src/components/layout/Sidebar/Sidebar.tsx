import { memo, useMemo } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Clock,
  Users,
  DollarSign,
  BarChart2,
  UserCheck,
  Settings,
  LogOut,
  X,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useLogout } from '@/features/auth/hooks/useAuth'

interface NavItem {
  label: string
  icon: typeof LayoutDashboard
  path: string
}

const navItems: { section: string; items: NavItem[] }[] = [
  {
    section: 'Principal',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { label: 'Agenda', icon: Clock, path: '/agenda' },
      { label: 'Pacientes', icon: Users, path: '/patients' },
    ],
  },
  {
    section: 'Gestão',
    items: [
      { label: 'Financeiro', icon: DollarSign, path: '/financial' },
      { label: 'Relatórios', icon: BarChart2, path: '/reports' },
      { label: 'Profissionais', icon: UserCheck, path: '/professionals' },
      { label: 'Configurações', icon: Settings, path: '/settings' },
    ],
  },
]

function getInitials(nomeCompleto: string): string {
  return nomeCompleto
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('')
}

function SidebarFooter() {
  const user = useAuthStore((s) => s.user)
  const { mutate: logout } = useLogout()
  const navigate = useNavigate()

  const initials = useMemo(
    () => getInitials(user?.fullName ?? 'Usuário'),
    [user],
  )
  const roleLabel = user?.roles?.[0]?.replace('ROLE_', '') ?? 'Usuário'

  return (
    <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            aria-label="Menu da conta"
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
              border: 'none', background: 'transparent', color: 'inherit',
              fontFamily: 'inherit', fontSize: 'inherit',
              transition: 'background 150ms', textAlign: 'left',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              background: 'var(--teal)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, fontSize: 12, color: 'var(--bg-0)',
            }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.fullName ?? 'Usuário'}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>
                {roleLabel}
              </div>
            </div>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="top"
            align="start"
            sideOffset={8}
            style={{
              background: 'var(--bg-2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '4px', minWidth: 180,
              boxShadow: 'var(--shadow-md)', zIndex: 100,
            }}
          >
            {[
              { icon: <Settings size={13} />, label: 'Configurações', action: () => navigate('/settings') },
              { icon: <LogOut size={13} />, label: 'Sair', action: () => logout(), danger: true },
            ].map(({ icon, label, action, danger }) => (
              <DropdownMenu.Item
                key={label}
                onClick={action}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
                  fontSize: 13, color: danger ? 'var(--danger)' : 'var(--text-1)',
                  outline: 'none', transition: 'background 100ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = danger ? 'var(--danger-10)' : 'var(--bg-3)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {icon} {label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}

interface SidebarProps {
  /** Mobile drawer state; on lg+ the sidebar is always visible. */
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        id="app-sidebar"
        aria-label="Navegação principal"
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-bg-1 text-text-2 transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-[220px] lg:min-w-[220px] lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 pb-4 pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal font-serif text-xl italic text-bg-0">ψ</div>
            <div>
              <div className="font-serif text-lg text-text-1">Psyke</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-3">Clinic OS v2</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-3 transition hover:bg-bg-2 hover:text-text-1 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((section) => (
            <div key={section.section} className="mb-3">
              <div className="px-4 pb-1.5">
                <span className="text-[10px] uppercase tracking-[0.12em] text-text-3">{section.section}</span>
              </div>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 border-l-2 px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 lg:py-2 ${
                      isActive
                        ? 'border-teal bg-teal/10 text-teal'
                        : 'border-transparent text-text-2 hover:bg-bg-2 hover:text-text-1'
                    }`
                  }
                >
                  <item.icon size={16} aria-hidden="true" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <SidebarFooter />
      </aside>
    </>
  )
}

export const SidebarMemo = memo(Sidebar)
