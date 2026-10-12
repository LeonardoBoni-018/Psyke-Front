import { Check, Monitor, Moon, Sun } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useTheme, type ThemePreference } from '@/hooks/useTheme'

const options: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Escuro', icon: Moon },
  { value: 'system', label: 'Automático', icon: Monitor },
]

export function ThemeToggle() {
  const { preference, resolved, setPreference } = useTheme()
  const Icon = resolved === 'dark' ? Moon : Sun

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Alterar tema"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text-2 transition hover:bg-bg-1 hover:text-text-1 hover:shadow-sm sm:h-9 sm:w-9"
        >
          <Icon size={18} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="animate-pop-in z-[100] min-w-[160px] rounded-lg border border-border bg-bg-1 p-1.5 shadow-lg"
        >
          {options.map(({ value, label, icon: OptionIcon }) => (
            <DropdownMenu.Item
              key={value}
              onSelect={() => setPreference(value)}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-text-1 outline-none data-[highlighted]:bg-bg-2"
            >
              <OptionIcon size={15} className="text-text-3" />
              <span className="flex-1">{label}</span>
              {preference === value && <Check size={14} className="text-brand" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
