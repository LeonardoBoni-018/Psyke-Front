import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import { Plus, Calendar, User, Clock, FileText, X, ChevronRight } from 'lucide-react'
import CalendarView from '@/features/agenda/components/CalendarView/CalendarView'
import { useCalendarEvents, useAppointment, useUpdateStatus, useDeleteAppointment, useCreateSession } from '@/features/agenda/hooks/useAppointments'
import { Button } from '@/components/ui/Button/Button'
import type { CalendarEvent } from '@/types/appointment'

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  SCHEDULED: { label: 'Agendado', color: 'var(--info)', bg: 'rgba(74,158,255,0.1)' },
  CONFIRMED: { label: 'Confirmado', color: 'var(--teal)', bg: 'rgba(14,196,160,0.1)' },
  CANCELLED: { label: 'Cancelado', color: 'var(--danger)', bg: 'rgba(224,85,85,0.1)' },
  NO_SHOW: { label: 'Falta', color: 'var(--amber)', bg: 'rgba(245,166,35,0.1)' },
  DONE: { label: 'Realizado', color: 'var(--text-3)', bg: 'rgba(74,100,120,0.1)' },
}

function AgendaSkeleton() {
  return (
    <div className="page-enter flex gap-6">
      <div className="flex-1 space-y-4">
        <div className="h-10 w-64 animate-shimmer rounded-xl" />
        <div className="h-[600px] animate-shimmer rounded-2xl" />
      </div>
      <div className="w-80 space-y-4">
        <div className="h-8 w-40 animate-shimmer rounded-xl" />
        <div className="h-48 animate-shimmer rounded-2xl" />
      </div>
    </div>
  )
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-bg-2 text-text-3">
        <Icon size={14} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">{label}</p>
        <p className="mt-0.5 text-sm text-text-1 break-words">{value}</p>
      </div>
    </div>
  )
}

export default function AgendaPage() {
  const navigate = useNavigate()
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 })

  const [dateRange, setDateRange] = useState({ from: format(weekStart, "yyyy-MM-dd'T'00:00:00"), to: format(weekEnd, "yyyy-MM-dd'T'23:59:59") })
  const [selectedEvent, setSelectedEvent] = useState<{ id: string; title: string } | null>(null)

  const { data: events, isLoading } = useCalendarEvents(dateRange)
  const { data: selectedAppointment } = useAppointment(selectedEvent?.id ?? '')
  const updateStatus = useUpdateStatus()
  const deleteAppointment = useDeleteAppointment()
  const createSession = useCreateSession()

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent({ id: event.id, title: event.title })
  }, [])

  const handleDateSelect = useCallback((start: string, end: string) => {
    setDateRange({ from: start, to: end })
  }, [])

  const handleConfirm = useCallback(() => {
    if (!selectedEvent) return
    updateStatus.mutate({ id: selectedEvent.id, data: { status: 'CONFIRMED' } })
  }, [selectedEvent, updateStatus])

  const handleCancel = useCallback(() => {
    if (!selectedEvent) return
    updateStatus.mutate({ id: selectedEvent.id, data: { status: 'CANCELLED', reason: 'Cancelado pelo usuário' } })
  }, [selectedEvent, updateStatus])

  const handleCreateSession = useCallback(() => {
    if (!selectedEvent) return
    createSession.mutate({ appointmentId: selectedEvent.id, prontuario: '' })
  }, [selectedEvent, createSession])

  const handleDelete = useCallback(() => {
    if (!selectedEvent) return
    deleteAppointment.mutate(selectedEvent.id, {
      onSuccess: () => setSelectedEvent(null),
    })
  }, [selectedEvent, deleteAppointment])

  const statusInfo = selectedAppointment ? STATUS_MAP[selectedAppointment.status] : null

  function fmtId(id: string) {
    return `#${id.slice(0, 5)}`
  }

  return (
    <div className="flex gap-6 h-full">
      <div className="flex-1 min-w-0 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl text-text-1">Agenda</h1>
          <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/agenda/new')}>
            Agendar
          </Button>
        </div>

        {isLoading ? (
          <AgendaSkeleton />
        ) : (
          <div className="rounded-2xl border border-border bg-bg-1 p-4">
            {events && events.length > 0 ? (
              <CalendarView events={events} onEventClick={handleEventClick} onDateSelect={handleDateSelect} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-2">
                  <Calendar className="h-6 w-6 text-text-3" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-text-3">Nenhum evento encontrado</p>
                  <p className="mt-1 text-[12px] text-text-3">Nenhuma sessão agendada para este período</p>
                </div>
                <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/agenda/new')}>
                  Agendar sessão
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <aside className="w-80 shrink-0">
        {selectedAppointment && selectedEvent ? (
          <div key={selectedEvent.id} className="animate-scale-in rounded-2xl border border-border bg-bg-1 overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-base text-text-1 truncate">{selectedEvent.title}</h2>
                {statusInfo && (
                  <div className="mt-2 flex items-center gap-2">
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusInfo.color }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: statusInfo.color }}>
                      {statusInfo.label}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="ml-3 rounded-lg p-1.5 text-text-3 hover:bg-bg-2 hover:text-text-1 transition-colors shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <DetailRow icon={User} label="Paciente" value={`Paciente ${fmtId(selectedAppointment.patientId)}`} />
              <DetailRow icon={User} label="Profissional" value={`Profissional ${fmtId(selectedAppointment.professionalId)}`} />
              <DetailRow icon={Clock} label="Horário" value={`${format(new Date(selectedAppointment.startTime), "dd/MM/yyyy HH:mm")} — ${format(new Date(selectedAppointment.endTime), "HH:mm")}`} />

              {selectedAppointment.notes && (
                <DetailRow icon={FileText} label="Observações" value={selectedAppointment.notes} />
              )}
            </div>

            <div className="px-5 pb-5 space-y-2">
              {selectedAppointment.status === 'SCHEDULED' && (
                <Button variant="primary" size="sm" className="w-full" onClick={handleConfirm} loading={updateStatus.isPending}>
                  Confirmar agendamento
                </Button>
              )}
              {selectedAppointment.status === 'CONFIRMED' && (
                <Button variant="primary" size="sm" className="w-full" onClick={handleCreateSession} loading={createSession.isPending}>
                  Iniciar sessão
                </Button>
              )}
              {selectedAppointment.status !== 'CANCELLED' && selectedAppointment.status !== 'DONE' && (
                <Button variant="danger" size="sm" className="w-full" onClick={handleCancel} loading={updateStatus.isPending}>
                  Cancelar
                </Button>
              )}
              <Button variant="ghost" size="sm" className="w-full" onClick={handleDelete} loading={deleteAppointment.isPending}>
                Excluir agendamento
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-bg-1 px-5 text-center h-48 gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-2 text-text-3">
              <ChevronRight size={16} />
            </div>
            <div>
              <p className="text-sm text-text-3">Selecione um evento</p>
              <p className="mt-0.5 text-[12px] text-text-3">Clique em uma consulta no calendário para ver detalhes</p>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
