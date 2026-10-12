import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import {
  BarChart3,
  CalendarDays,
  CalendarPlus,
  CornerDownLeft,
  LayoutDashboard,
  Moon,
  Search,
  Settings,
  Stethoscope,
  Sun,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react'
import { usePatients } from '@/features/patients/hooks/usePatients'
import { useDebounce } from '@/hooks/useDebounce'
import { useTheme } from '@/hooks/useTheme'

interface Command {
  id: string
  label: string
  group: 'Ir para' | 'Criar' | 'Aparência' | 'Pacientes'
  icon: ReactNode
  hint?: string
  keywords?: string
  run: () => void
}

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()
  const { setPreference } = useTheme()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const debounced = useDebounce(query.trim(), 200)

  const { data: patientData } = usePatients(
    debounced.length >= 2 ? { q: debounced, size: 6 } : { page: 0, size: 1, q: '__none__' },
  )

  const close = () => onOpenChange(false)
  const go = (path: string) => () => {
    close()
    navigate(path, { viewTransition: true })
  }

  const staticCommands: Command[] = useMemo(
    () => [
      { id: 'go-dashboard', group: 'Ir para', label: 'Painel', icon: <LayoutDashboard size={16} />, run: go('/dashboard'), keywords: 'inicio home dashboard' },
      { id: 'go-agenda', group: 'Ir para', label: 'Agenda', icon: <CalendarDays size={16} />, run: go('/agenda'), keywords: 'calendario sessoes' },
      { id: 'go-patients', group: 'Ir para', label: 'Pacientes', icon: <Users size={16} />, run: go('/patients') },
      { id: 'go-financial', group: 'Ir para', label: 'Financeiro', icon: <Wallet size={16} />, run: go('/financial'), keywords: 'cobrancas faturas pagamentos' },
      { id: 'go-reports', group: 'Ir para', label: 'Relatórios', icon: <BarChart3 size={16} />, run: go('/reports') },
      { id: 'go-professionals', group: 'Ir para', label: 'Profissionais', icon: <Stethoscope size={16} />, run: go('/professionals'), keywords: 'psicologos equipe' },
      { id: 'go-settings', group: 'Ir para', label: 'Configurações', icon: <Settings size={16} />, run: go('/settings') },
      { id: 'new-appointment', group: 'Criar', label: 'Novo agendamento', icon: <CalendarPlus size={16} />, run: go('/agenda/new'), keywords: 'sessao marcar consulta' },
      { id: 'new-patient', group: 'Criar', label: 'Novo paciente', icon: <UserPlus size={16} />, run: go('/patients/new'), keywords: 'cadastrar' },
      { id: 'new-professional', group: 'Criar', label: 'Novo profissional', icon: <Stethoscope size={16} />, run: go('/professionals/new'), keywords: 'cadastrar' },
      { id: 'theme-light', group: 'Aparência', label: 'Tema claro', icon: <Sun size={16} />, run: () => { setPreference('light'); close() } },
      { id: 'theme-dark', group: 'Aparência', label: 'Tema escuro', icon: <Moon size={16} />, run: () => { setPreference('dark'); close() } },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate, setPreference],
  )

  const items: Command[] = useMemo(() => {
    const q = normalize(query.trim())
    const filtered = q
      ? staticCommands.filter((c) => normalize(`${c.label} ${c.keywords ?? ''}`).includes(q))
      : staticCommands.filter((c) => c.group !== 'Aparência')
    const patients: Command[] =
      debounced.length >= 2
        ? (patientData?.content ?? []).map((p) => ({
            id: `patient-${p.id}`,
            group: 'Pacientes' as const,
            label: p.fullName,
            hint: p.email ?? undefined,
            icon: <Users size={16} />,
            run: go(`/patients/${p.id}`),
          }))
        : []
    return [...patients, ...filtered]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, debounced, patientData, staticCommands])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (items.length ? (i + 1) % items.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (items.length ? (i - 1 + items.length) % items.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      items[active]?.run()
    }
  }

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const grouped = items.reduce<Record<string, { cmd: Command; index: number }[]>>((acc, cmd, index) => {
    ;(acc[cmd.group] ??= []).push({ cmd, index })
    return acc
  }, {})

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          setQuery('')
          setActive(0)
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="animate-fade-in fixed inset-0 z-[90] bg-[var(--scrim)] backdrop-blur-[2px]" />
        <Dialog.Content
          aria-describedby={undefined}
          onKeyDown={onKeyDown}
          className="animate-pop-in fixed left-1/2 top-[12vh] z-[91] w-[calc(100vw-24px)] max-w-[560px] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-bg-1 shadow-lg"
        >
          <Dialog.Title className="sr-only">Buscar ou ir para</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search size={18} className="shrink-0 text-text-3" aria-hidden="true" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActive(0)
              }}
              role="combobox"
              aria-expanded="true"
              aria-controls="command-list"
              aria-activedescendant={items[active] ? `cmd-${items[active].id}` : undefined}
              placeholder="Buscar paciente, página ou ação…"
              maxLength={100}
              className="h-14 flex-1 bg-transparent text-[15px] text-text-1 outline-none placeholder:text-text-3"
            />
            <kbd className="rounded border border-border px-1.5 py-px text-[11px] text-text-3">Esc</kbd>
          </div>

          <div ref={listRef} id="command-list" role="listbox" className="max-h-[min(380px,55vh)] overflow-y-auto p-2">
            {items.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-text-3">Nada encontrado para “{query}”.</p>
            )}
            {Object.entries(grouped).map(([group, entries]) => (
              <div key={group} className="pb-1">
                <p className="px-3 pb-1 pt-2 text-xs font-medium text-text-3">{group}</p>
                {entries.map(({ cmd, index }) => (
                  <button
                    key={cmd.id}
                    id={`cmd-${cmd.id}`}
                    type="button"
                    role="option"
                    aria-selected={index === active}
                    data-active={index === active}
                    onMouseMove={() => setActive(index)}
                    onClick={cmd.run}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] text-text-1 transition-colors data-[active=true]:bg-bg-2"
                  >
                    <span className="text-text-3">{cmd.icon}</span>
                    <span className="flex-1 truncate">{cmd.label}</span>
                    {cmd.hint && <span className="hidden truncate text-xs text-text-3 sm:block">{cmd.hint}</span>}
                    {index === active && <CornerDownLeft size={14} className="text-text-3" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
