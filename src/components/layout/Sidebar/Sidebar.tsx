import { memo, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Clock,
  Users,
  DollarSign,
  BarChart2,
  UserCheck,
  Settings,
} from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/authStore'

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
      { label: 'Agenda', icon: Clock, path: '/agenda', badge: '4' },
      { label: 'Pacientes', icon: Users, path: '/patients' },
    ],
  },
  {
    section: 'Gestão',
    items: [
      { label: 'Financeiro', icon: DollarSign, path: '/financial', badge: '1', badgeWarning: true },
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

export function Sidebar() {
  const user = useAuthStore((state) => state.user)

  const userInitials = useMemo(() => getInitials(user?.fullName ?? 'Dra. Ana Silva'), [user])
  const userName = user?.fullName ?? 'Dra. Ana Silva'
  const userRole = user?.crp ?? 'CRP 06/12345'

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
            <div className="px-4 pb-1 text-[10px] uppercase tracking-[0.12em] text-text-3">{section.section}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between gap-3 rounded-xl px-4 py-2 text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-teal-20 border-l-2 border-teal text-teal'
                      : 'border-l-2 border-transparent text-text-2 hover:bg-teal-10'
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
        ))}
      </div>

      <div className="border-t border-border px-4 py-4">
        <div className="rounded-2xl border border-border bg-bg-2 p-3 transition-colors duration-150 hover:bg-bg-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal to-info text-bg-0 font-sans text-[12px] font-bold">
              {userInitials}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[12px] font-medium text-text-1">{userName}</div>
              <div className="truncate text-[10px] text-text-3">{userRole}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export const SidebarMemo = memo(Sidebar)
