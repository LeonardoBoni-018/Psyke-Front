import { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { Building2, DoorOpen, Users, Plus, Inbox } from 'lucide-react'

function EmptySection({ icon, title, buttonLabel, onClick }: { icon: React.ReactNode; title: string; buttonLabel?: string; onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-border bg-bg-1 px-6 py-14 transition hover:border-border-hi">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-2 text-text-3">
        {icon}
      </div>
      <p className="text-sm text-text-3">{title}</p>
      {buttonLabel && onClick && (
        <button
          type="button"
          onClick={onClick}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-2 px-3 py-1.5 text-[12px] text-text-2 transition hover:border-border-hi hover:text-text-1"
        >
          <Plus size={13} /> {buttonLabel}
        </button>
      )}
    </div>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState('clinic')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif text-text-1">Configurações</h1>

      <Tabs.Root value={tab} onValueChange={setTab} className="space-y-6">
        <Tabs.List className="flex gap-1 rounded-xl border border-border bg-bg-2 p-1">
          <Tabs.Trigger
            value="clinic"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-text-3 transition data-[state=active]:bg-bg-1 data-[state=active]:text-text-1 data-[state=active]:shadow-sm"
          >
            <Building2 size={16} /> Clínica
          </Tabs.Trigger>
          <Tabs.Trigger
            value="rooms"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-text-3 transition data-[state=active]:bg-bg-1 data-[state=active]:text-text-1 data-[state=active]:shadow-sm"
          >
            <DoorOpen size={16} /> Salas
          </Tabs.Trigger>
          <Tabs.Trigger
            value="users"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-text-3 transition data-[state=active]:bg-bg-1 data-[state=active]:text-text-1 data-[state=active]:shadow-sm"
          >
            <Users size={16} /> Usuários
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="clinic" className="space-y-4">
          <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 shadow-sm">
            <h2 className="text-lg font-serif text-text-1">Dados da clínica</h2>
            <p className="mt-1 text-sm text-text-3">Informações do tenant serão exibidas aqui quando a API estiver integrada.</p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="rooms" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif text-text-1">Salas</h2>
            <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal/90">
              <Plus size={16} /> Nova sala
            </button>
          </div>
          <EmptySection icon={<DoorOpen size={20} />} title="Nenhuma sala cadastrada" buttonLabel="Nova sala" onClick={() => {}} />
        </Tabs.Content>

        <Tabs.Content value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif text-text-1">Usuários</h2>
            <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal/90">
              <Plus size={16} /> Novo usuário
            </button>
          </div>
          <EmptySection icon={<Inbox size={20} />} title="Nenhum usuário cadastrado" buttonLabel="Novo usuário" onClick={() => {}} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
