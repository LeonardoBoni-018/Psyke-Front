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
  User,
  LogOut,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useLogout } from '@/features/auth/hooks/useAuth'

interface NavItem {
  label: string
  icon: typeof LayoutDashboard
  path: string
  badge?: string
  badgeWarning?: boolean
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
  const roleLabel = user?.roles?.[0]?.replace('ROLE_', '') ?? 'Admin'

  return (
    <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
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
              background: 'linear-gradient(135deg, var(--teal), var(--info))',
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
              { icon: <User size={13} />, label: 'Meu perfil', action: () => navigate('/settings') },
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
                onMouseEnter={e => (e.currentTarget.style.background = danger ? 'rgba(224,85,85,0.1)' : 'var(--bg-3)')}
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

export function Sidebar() {
  return (
    <aside className="flex min-h-screen w-[220px] min-w-[220px] flex-col border-r border-border bg-bg-1 text-text-2">
      <div className="border-b border-border px-4 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal text-bg-0 font-serif text-xl italic">ψ</div>
          <div>
            <div className="font-serif text-lg text-text-1">Psyke</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-3">Clinic OS v2</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {navItems.map((section) => (
          <div key={section.section} className="space-y-2">
              <div className="px-4 pb-2">
              <span className="text-[10px] uppercase tracking-[0.12em] text-text-3">{section.section}</span>
            </div>
            <div className="pt-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between gap-3 rounded-xl px-4 py-2 text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal/15 to-transparent border-l-2 border-teal text-teal'
                        : 'border-l-2 border-transparent text-text-2 hover:bg-teal/5'
                    }`
                  }
                >
                  <span className="flex items-center gap-2">
                    <item.icon size={16} />
                    <span className="font-sans text-[13px] font-medium">{item.label}</span>
                  </span>
                  {item.badge ? (
                    <span className={`rounded-full px-2 py-[2px] text-[10px] font-mono font-medium ${
                      item.badgeWarning ? 'bg-amber text-bg-0' : 'bg-teal text-bg-0'
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SidebarFooter />
    </aside>
  )
}

export const SidebarMemo = memo(Sidebar)
