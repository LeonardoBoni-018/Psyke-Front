import { useEffect, useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { Building2, DoorOpen, Loader2, Plus, Trash2, Users, Video } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/layout/PageHeader/PageHeader'
import {
  useClinic,
  useCreateRoom,
  useDeleteRoom,
  useRooms,
  useTenant,
  useUpdateClinic,
  useUsers,
} from '@/features/settings/hooks/useSettings'
import type { ClinicResponse } from '@/features/settings/services/clinicApi'
import type { RoomType } from '@/types/room'

const fieldClass =
  'mt-1.5 h-10 w-full rounded-lg border border-border bg-bg-1 px-3 text-[14px] text-text-1 shadow-sm outline-none transition placeholder:text-text-3 focus:border-brand focus:shadow-focus'

const tabClass =
  'flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-[14px] font-medium text-text-2 transition hover:text-text-1 data-[state=active]:bg-bg-1 data-[state=active]:text-text-1 data-[state=active]:shadow-sm'

const planLabels: Record<string, string> = { BASIC: 'Básico', PRO: 'Profissional', ENTERPRISE: 'Empresarial' }
const roleLabels: Record<string, string> = {
  ROLE_ADMIN: 'Administrador',
  ROLE_PROFESSIONAL: 'Profissional',
  ROLE_RECEPTIONIST: 'Recepção',
  ROLE_PATIENT: 'Paciente',
}
const palette = ['#1d6a57', '#2c5bcf', '#a5660a', '#8a4fbf', '#c0392f', '#4f6b7a']

function Skeleton() {
  return (
    <div className="surface space-y-4 p-6">
      {[0, 1, 2].map((i) => <div key={i} className="animate-shimmer h-10 rounded-lg" style={{ opacity: 1 - i * 0.2 }} />)}
    </div>
  )
}

/* ---------- clinic ---------- */

function ClinicForm({ clinic }: { clinic: ClinicResponse }) {
  const tenant = useTenant()
  const update = useUpdateClinic()
  const [form, setForm] = useState({
    name: clinic.name ?? '',
    legalName: clinic.legalName ?? '',
    cnpj: clinic.cnpj ?? '',
    crp: clinic.crp ?? '',
    phone: clinic.phone ?? '',
    address: clinic.address ?? '',
  })
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const dirty = (Object.keys(form) as Array<keyof typeof form>).some((k) => form[k] !== (clinic[k] ?? ''))

  return (
    <form
      className="surface space-y-5 p-5 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault()
        update.mutate({ id: clinic.id, data: form })
      }}
    >
      <div>
        <h2 className="text-[17px] text-text-1">Dados da clínica</h2>
        {tenant.data && (
          <p className="mt-0.5 text-[13px] text-text-2">
            ID de acesso <span className="font-semibold text-text-1">{tenant.data.slug}</span> · plano {planLabels[tenant.data.plan] ?? tenant.data.plan}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-[13px] font-medium text-text-2">
          Nome da clínica
          <input value={form.name} onChange={set('name')} className={fieldClass} maxLength={200} required />
        </label>
        <label className="block text-[13px] font-medium text-text-2">
          Razão social
          <input value={form.legalName} onChange={set('legalName')} className={fieldClass} maxLength={200} />
        </label>
        <label className="block text-[13px] font-medium text-text-2">
          CNPJ
          <input value={form.cnpj} onChange={set('cnpj')} className={fieldClass} maxLength={18} placeholder="00.000.000/0000-00" />
        </label>
        <label className="block text-[13px] font-medium text-text-2">
          CRP da clínica
          <input value={form.crp} onChange={set('crp')} className={fieldClass} maxLength={20} placeholder="06/00000" />
        </label>
        <label className="block text-[13px] font-medium text-text-2">
          Telefone
          <input value={form.phone} onChange={set('phone')} className={fieldClass} maxLength={20} inputMode="tel" />
        </label>
        <label className="block text-[13px] font-medium text-text-2">
          Endereço
          <input value={form.address} onChange={set('address')} className={fieldClass} />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" size="md" loading={update.isPending} disabled={!dirty || !form.name.trim()}>
          Salvar alterações
        </Button>
        {!dirty && !update.isPending && <span className="text-[13px] text-text-3">Nenhuma alteração pendente</span>}
      </div>
    </form>
  )
}

/* ---------- rooms ---------- */

function RoomsPanel() {
  const rooms = useRooms()
  const create = useCreateRoom()
  const remove = useDeleteRoom()
  const [name, setName] = useState('')
  const [type, setType] = useState<RoomType>('PHYSICAL')
  const [color, setColor] = useState(palette[0])
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => {
    if (!confirmId) return
    const t = window.setTimeout(() => setConfirmId(null), 4000)
    return () => window.clearTimeout(t)
  }, [confirmId])

  return (
    <div className="space-y-5">
      <form
        className="surface flex flex-wrap items-end gap-4 p-5"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim()) return
          create.mutate({ name: name.trim(), type, color, capacity: type === 'VIRTUAL' ? 1 : 2 }, { onSuccess: () => setName('') })
        }}
      >
        <label className="block min-w-[200px] flex-1 text-[13px] font-medium text-text-2">
          Nova sala
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Sala Ipê" maxLength={100} className={fieldClass} />
        </label>
        <label className="block text-[13px] font-medium text-text-2">
          Tipo
          <select value={type} onChange={(e) => setType(e.target.value as RoomType)} className={fieldClass}>
            <option value="PHYSICAL">Presencial</option>
            <option value="VIRTUAL">Online</option>
          </select>
        </label>
        <fieldset>
          <legend className="text-[13px] font-medium text-text-2">Cor na agenda</legend>
          <div className="mt-1.5 flex h-10 items-center gap-1.5">
            {palette.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Cor ${c}`}
                aria-pressed={color === c}
                onClick={() => setColor(c)}
                className={`h-6 w-6 rounded-full transition ${color === c ? 'scale-110 ring-2 ring-brand ring-offset-2 ring-offset-bg-1' : 'hover:scale-110'}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </fieldset>
        <Button type="submit" size="md" icon={<Plus size={15} />} loading={create.isPending} disabled={!name.trim()}>
          Adicionar
        </Button>
      </form>

      {rooms.isLoading ? (
        <Skeleton />
      ) : (rooms.data ?? []).length === 0 ? (
        <div className="surface px-6 py-12 text-center">
          <p className="text-[15px] text-text-1">Nenhuma sala cadastrada</p>
          <p className="mt-1 text-[13px] text-text-3">Adicione uma sala acima para usá-la nos agendamentos.</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.data?.map((room, i) => (
            <li key={room.id} className="item-enter surface flex items-center gap-3 p-4" style={{ animationDelay: `${i * 45}ms` }}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: room.color || palette[0] }}>
                {room.type === 'VIRTUAL' ? <Video size={18} /> : <DoorOpen size={18} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-text-1">{room.name}</p>
                <p className="text-xs text-text-3">{room.type === 'VIRTUAL' ? 'Online' : `Presencial · ${room.capacity} ${room.capacity === 1 ? 'pessoa' : 'pessoas'}`}</p>
              </div>
              {confirmId === room.id ? (
                <button
                  type="button"
                  onClick={() => remove.mutate(room.id, { onSettled: () => setConfirmId(null) })}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md bg-danger/10 px-2.5 text-[13px] font-semibold text-danger transition hover:bg-danger/15"
                >
                  {remove.isPending ? <Loader2 size={13} className="animate-spin" /> : null} Confirmar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmId(room.id)}
                  aria-label={`Remover ${room.name}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-3 transition hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ---------- team ---------- */

function UsersPanel() {
  const users = useUsers()
  if (users.isLoading) return <Skeleton />
  const list = users.data?.content ?? []
  return (
    <div className="surface overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-[17px] text-text-1">Equipe com acesso</h2>
        <p className="mt-0.5 text-[13px] text-text-2">{list.length} {list.length === 1 ? 'pessoa' : 'pessoas'} podem entrar no sistema</p>
      </div>
      <ul className="divide-y divide-border">
        {list.map((u, i) => (
          <li key={u.id} className="item-enter flex items-center gap-3.5 px-5 py-3.5" style={{ animationDelay: `${i * 40}ms` }}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[13px] font-bold text-brand">
              {u.fullName.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium text-text-1">{u.fullName}</p>
              <p className="truncate text-xs text-text-3">{u.email}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-1.5">
              {u.roles.map((r) => (
                <span key={r} className="rounded-full bg-bg-2 px-2.5 py-0.5 text-xs font-medium text-text-2">{roleLabels[r] ?? r}</span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SettingsPage() {
  const clinic = useClinic()

  return (
    <div className="space-y-6">
      <PageHeader title="Configurações" description="Dados da clínica, salas de atendimento e equipe." />

      <Tabs.Root defaultValue="clinic" className="space-y-5">
        <Tabs.List aria-label="Seções" className="flex gap-1 rounded-lg bg-bg-2 p-1">
          <Tabs.Trigger value="clinic" className={tabClass}><Building2 size={16} /> Clínica</Tabs.Trigger>
          <Tabs.Trigger value="rooms" className={tabClass}><DoorOpen size={16} /> Salas</Tabs.Trigger>
          <Tabs.Trigger value="team" className={tabClass}><Users size={16} /> Equipe</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="clinic" className="outline-none">
          {clinic.isLoading ? <Skeleton /> : clinic.data ? <ClinicForm key={clinic.data.id} clinic={clinic.data} /> : (
            <div className="surface px-6 py-12 text-center text-[14px] text-text-3">Não foi possível carregar os dados da clínica.</div>
          )}
        </Tabs.Content>
        <Tabs.Content value="rooms" className="outline-none"><RoomsPanel /></Tabs.Content>
        <Tabs.Content value="team" className="outline-none"><UsersPanel /></Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
