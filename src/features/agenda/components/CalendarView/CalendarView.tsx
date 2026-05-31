import { useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarEvent } from '@/types/appointment'
import type { EventClickArg } from '@fullcalendar/core'

interface CalendarViewProps {
  events: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
  onDateSelect?: (start: string, end: string) => void
}

export default function CalendarView({ events, onEventClick, onDateSelect }: CalendarViewProps) {
  const handleEventClick = useCallback(
    (arg: EventClickArg) => {
      const event = events.find((e) => e.id === arg.event.id)
      if (event && onEventClick) onEventClick(event)
    },
    [events, onEventClick],
  )

  const handleSelect = useCallback(
    (arg: { startStr: string; endStr: string }) => {
      if (onDateSelect) onDateSelect(arg.startStr, arg.endStr)
    },
    [onDateSelect],
  )

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        locale="pt-br"
        timeZone="America/Sao_Paulo"
        height="auto"
        events={events}
        eventClick={handleEventClick}
        selectable={!!onDateSelect}
        select={onDateSelect ? handleSelect : undefined}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        slotDuration="00:30:00"
        firstDay={0}
        buttonText={{
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
        }}
      />
    </div>
  )
}
