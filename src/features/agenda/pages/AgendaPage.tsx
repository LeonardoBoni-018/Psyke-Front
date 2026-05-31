import { useCallback, useState } from 'react'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import { Plus, Calendar, User, Clock, FileText, X } from 'lucide-react'
import CalendarView from '@/features/agenda/components/CalendarView/CalendarView'
import { useCalendarEvents, useAppointment, useUpdateStatus, useDeleteAppointment, useCreateSession } from '@/features/agenda/hooks/useAppointments'
import { Button } from '@/components/ui/Button/Button'
import type { CalendarEvent } from '@/types/appointment'

const statusConfig: Record<string, { label: string; className: string }> = {
  SCHEDULED: { label: 'Agendado', className: 'bg-info/10 text-info border border-info/20' },
  CONFIRMED: { label: 'Confirmado', className: 'bg-teal/10 text-teal border border-teal/20' },
  CANCELLED: { label: 'Cancelado', className: 'bg-danger/10 text-danger border border-danger/20' },
  NO_SHOW: { label: 'Faltou', className: 'bg-amber/10 text-amber border border-amber/20' },
  DONE: { label: 'Realizado', className: 'bg-teal/10 text-teal border border-teal/20' },
}

function AgendaSkeleton() {
  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-4">
        <div className="h-10 w-64 rounded-xl bg-bg-2 animate-shimmer" />
        <div className="h-[600px] rounded-2xl bg-bg-2 animate-shimmer" />
      </div>
      <div className="w-80 space-y-4">
        <div className="h-8 w-40 rounded-xl bg-bg-2 animate-shimmer" />
        <div className="h-48 rounded-2xl bg-bg-2 animate-shimmer" />
      </div>
    </div>
  )
}

export default function AgendaPage() {
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 })

  const [dateRange, setDateRange] = useState({ startDate: format(weekStart, "yyyy-MM-dd'T'00:00:00"), endDate: format(weekEnd, "yyyy-MM-dd'T'23:59:59") })
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const { data: events, isLoading } = useCalendarEvents(dateRange)
  const { data: selectedAppointment } = useAppointment(selectedEventId ?? '')
  const updateStatus = useUpdateStatus()
  const deleteAppointment = useDeleteAppointment()
  const createSession = useCreateSession()

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEventId(event.id)
  }, [])

  const handleDateSelect = useCallback((start: string, end: string) => {
    setDateRange({ startDate: start, endDate: end })
  }, [])

  const handleConfirm = useCallback(() => {
    if (!selectedEventId) return
    updateStatus.mutate({ id: selectedEventId, data: { status: 'CONFIRMED' } })
  }, [selectedEventId, updateStatus])

  const handleCancel = useCallback(() => {
    if (!selectedEventId) return
    updateStatus.mutate({ id: selectedEventId, data: { status: 'CANCELLED', reason: 'Cancelado pelo usuário' } })
  }, [selectedEventId, updateStatus])

  const handleCreateSession = useCallback(() => {
    if (!selectedEventId) return
    createSession.mutate({ appointmentId: selectedEventId, notes: '' })
  }, [selectedEventId, createSession])

  const statusInfo = selectedAppointment ? statusConfig[selectedAppointment.status] : null

  return (
    <div className="flex gap-6 h-full">
      <div className="flex-1 min-w-0 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl text-text-1">Agenda</h1>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>
              Agendar
            </Button>
          </div>
        </div>

        {isLoading ? (
          <AgendaSkeleton />
        ) : (
          <div className="rounded-2xl border border-border bg-bg-1 p-4">
            {events && events.length > 0 ? (
              <CalendarView events={events} onEventClick={handleEventClick} onDateSelect={handleDateSelect} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-text-3">
                <Calendar className="mb-3 h-12 w-12" />
                <p className="text-sm">Nenhum evento encontrado</p>
              </div>
            )}
          </div>
        )}
      </div>

      <aside className="w-80 shrink-0">
        {selectedAppointment ? (
          <div className="rounded-2xl border border-border bg-bg-1 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg text-text-1">Detalhes do agendamento</h2>
              <button
                onClick={() => setSelectedEventId(null)}
                className="rounded-lg p-1 text-text-3 hover:bg-bg-2 hover:text-text-1 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-text-3 shrink-0" />
                <div>
                  <p className="text-xs text-text-3">Paciente</p>
                  <p className="text-sm text-text-1">{selectedAppointment.patientId}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-text-3 shrink-0" />
                <div>
                  <p className="text-xs text-text-3">Profissional</p>
                  <p className="text-sm text-text-1">{selectedAppointment.professionalId}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-text-3 shrink-0" />
                <div>
                  <p className="text-xs text-text-3">Horário</p>
                  <p className="text-sm text-text-1">
                    {format(new Date(selectedAppointment.startTime), "dd/MM/yyyy HH:mm")} — {format(new Date(selectedAppointment.endTime), "HH:mm")}
                  </p>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-4 w-4 text-text-3 shrink-0" />
                  <div>
                    <p className="text-xs text-text-3">Observações</p>
                    <p className="text-sm text-text-2">{selectedAppointment.notes}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-text-3 mb-1.5">Status</p>
                {statusInfo && (
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              {selectedAppointment.status === 'SCHEDULED' && (
                <Button variant="primary" size="sm" onClick={handleConfirm} loading={updateStatus.isPending}>
                  Confirmar
                </Button>
              )}
              {selectedAppointment.status === 'CONFIRMED' && (
                <Button variant="primary" size="sm" onClick={handleCreateSession} loading={createSession.isPending}>
                  Criar Sessão
                </Button>
              )}
              {selectedAppointment.status !== 'CANCELLED' && selectedAppointment.status !== 'DONE' && (
                <Button variant="danger" size="sm" onClick={handleCancel} loading={updateStatus.isPending}>
                  Cancelar
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => deleteAppointment.mutate(selectedEventId!)} loading={deleteAppointment.isPending}>
                Excluir
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-bg-1 p-5 flex items-center justify-center text-text-3 text-sm h-40">
            <p>Selecione um evento para ver detalhes</p>
          </div>
        )}
      </aside>
    </div>
  )
}
