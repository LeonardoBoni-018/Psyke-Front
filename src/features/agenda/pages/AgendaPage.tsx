import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, parseISO, startOfWeek, endOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import * as Dialog from '@radix-ui/react-dialog'
import { Clock, DoorOpen, FileText, Plus, Stethoscope, User, X } from 'lucide-react'
import CalendarView from '@/features/agenda/components/CalendarView/CalendarView'
import {
  useAppointment,
  useCalendarEvents,
  useCreateSession,
  useDeleteAppointment,
  useUpdateStatus,
} from '@/features/agenda/hooks/useAppointments'
import { Button } from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader/PageHeader'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { AppointmentResponse, CalendarEvent } from '@/types/appointment'

function DetailRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-2 text-text-3">
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-text-3">{label}</p>
        <p className="mt-0.5 break-words text-[14px] text-text-1">{value}</p>
      </div>
    </div>
  )
}

interface DetailsProps {
  title: string
  appointment: AppointmentResponse
  busy: { status: boolean; session: boolean; remove: boolean }
  onConfirm: () => void
  onCancel: () => void
  onStartSession: () => void
  onDelete: () => void
}

function AppointmentDetails({ title, appointment, busy, onConfirm, onCancel, onStartSession, onDelete }: DetailsProps) {
  const start = parseISO(appointment.startTime)
  const end = parseISO(appointment.endTime)
  const when = `${format(start, "EEEE, d 'de' MMMM", { locale: ptBR })} · ${format(start, 'HH:mm')}–${format(end, 'HH:mm')}`

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-[19px] text-text-1">{title}</h2>
        <div className="mt-2">
          <StatusBadge status={appointment.status} />
        </div>
      </div>

      <div className="space-y-4">
        <DetailRow icon={Clock} label="Horário" value={when.charAt(0).toUpperCase() + when.slice(1)} />
        <DetailRow icon={User} label="Paciente" value={appointment.patientName ?? 'Paciente'} />
        <DetailRow icon={Stethoscope} label="Profissional" value={appointment.professionalName ?? 'Profissional'} />
        {appointment.roomName && <DetailRow icon={DoorOpen} label="Sala" value={appointment.roomName} />}
        {appointment.notes && <DetailRow icon={FileText} label="Observações" value={appointment.notes} />}
      </div>

      <div className="mt-6 space-y-2">
        {appointment.status === 'SCHEDULED' && (
          <Button variant="primary" size="md" className="w-full" onClick={onConfirm} loading={busy.status}>
            Confirmar agendamento
          </Button>
        )}
        {appointment.status === 'CONFIRMED' && (
          <Button variant="primary" size="md" className="w-full" onClick={onStartSession} loading={busy.session}>
            Concluir sessão
          </Button>
        )}
        {appointment.status !== 'CANCELLED' && appointment.status !== 'DONE' && (
          <Button variant="danger" size="md" className="w-full" onClick={onCancel} loading={busy.status}>
            Cancelar sessão
          </Button>
        )}
        <Button variant="ghost" size="md" className="w-full" onClick={onDelete} loading={busy.remove}>
          Excluir agendamento
        </Button>
      </div>
    </div>
  )
}

export default function AgendaPage() {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const today = new Date()

  const [dateRange, setDateRange] = useState({
    from: format(startOfWeek(today, { weekStartsOn: 0 }), "yyyy-MM-dd'T'00:00:00"),
    to: format(endOfWeek(today, { weekStartsOn: 0 }), "yyyy-MM-dd'T'23:59:59"),
  })
  const [selected, setSelected] = useState<{ id: string; title: string } | null>(null)

  const { data: events = [], isFetching } = useCalendarEvents(dateRange)
  const { data: appointment } = useAppointment(selected?.id ?? '')
  const updateStatus = useUpdateStatus()
  const deleteAppointment = useDeleteAppointment()
  const createSession = useCreateSession()

  const handleEventClick = useCallback((event: CalendarEvent) => setSelected({ id: event.id, title: event.title }), [])
  const handleRangeChange = useCallback((from: string, to: string) => {
    setDateRange((prev) => (prev.from === from && prev.to === to ? prev : { from, to }))
  }, [])

  const details = selected && appointment && (
    <AppointmentDetails
      title={selected.title}
      appointment={appointment}
      busy={{ status: updateStatus.isPending, session: createSession.isPending, remove: deleteAppointment.isPending }}
      onConfirm={() => updateStatus.mutate({ id: selected.id, data: { status: 'CONFIRMED' } })}
      onCancel={() => updateStatus.mutate({ id: selected.id, data: { status: 'CANCELLED', reason: 'Cancelado pelo usuário' } })}
      onStartSession={() => createSession.mutate({ appointmentId: selected.id, prontuario: '' })}
      onDelete={() => deleteAppointment.mutate(selected.id, { onSuccess: () => setSelected(null) })}
    />
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title="Agenda"
        description="Veja a semana, confirme sessões e acompanhe cada atendimento."
        actions={
          <Button variant="primary" size="md" icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/agenda/new', { viewTransition: true })}>
            Agendar
          </Button>
        }
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className={`surface p-3 transition-opacity sm:p-4 ${isFetching ? 'opacity-80' : ''}`}>
          <CalendarView events={events} onEventClick={handleEventClick} onRangeChange={handleRangeChange} />
          {!isFetching && events.length === 0 && (
            <p className="px-2 pb-2 pt-1 text-center text-[13px] text-text-3">Nenhuma sessão neste período.</p>
          )}
        </div>

        {isDesktop && (
          <aside className="surface sticky top-2 p-5" aria-label="Detalhes da sessão">
            {details ?? (
              <div className="flex flex-col items-center gap-2 px-2 py-10 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bg-2 text-text-3">
                  <Clock size={20} />
                </span>
                <p className="text-[15px] text-text-1">Selecione uma sessão</p>
                <p className="text-[13px] text-text-3">Clique em um horário do calendário para ver os detalhes e agir.</p>
              </div>
            )}
          </aside>
        )}
      </div>

      {!isDesktop && (
        <Dialog.Root open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="animate-fade-in fixed inset-0 z-[80] bg-[var(--scrim)] backdrop-blur-[2px]" />
            <Dialog.Content
              aria-describedby={undefined}
              className="animate-scale-in fixed bottom-0 left-0 right-0 z-[81] max-h-[88dvh] overflow-y-auto rounded-t-2xl border border-border bg-bg-1 p-5 shadow-lg"
              style={{ animationName: 'sheetUp' }}
            >
              <Dialog.Title className="sr-only">Detalhes da sessão</Dialog.Title>
              <Dialog.Close
                aria-label="Fechar"
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-3 hover:bg-bg-2 hover:text-text-1"
              >
                <X size={18} />
              </Dialog.Close>
              {details ?? <div className="animate-shimmer h-40 rounded-lg" />}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  )
}
