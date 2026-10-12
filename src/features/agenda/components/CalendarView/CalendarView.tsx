import { useCallback, useMemo } from 'react'
import { format } from 'date-fns'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import type { DatesSetArg, EventClickArg } from '@fullcalendar/core'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { CalendarEvent } from '@/types/appointment'

interface CalendarViewProps {
  events: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
  /** Called whenever the visible range changes (navigation, view switch), in local date-time format. */
  onRangeChange?: (from: string, to: string) => void
}

const local = (d: Date) => format(d, "yyyy-MM-dd'T'HH:mm:ss")

export default function CalendarView({ events, onEventClick, onRangeChange }: CalendarViewProps) {
  const isWide = useMediaQuery('(min-width: 768px)')

  // Colors come from CSS (per status class) so they follow the light/dark theme instead of fixed hex values.
  const styledEvents = useMemo(
    () =>
      events.map((e) => ({
        ...e,
        backgroundColor: undefined,
        borderColor: undefined,
        textColor: undefined,
        classNames: [`ev-${String(e.extendedProps?.status ?? 'SCHEDULED')}`],
      })),
    [events],
  )

  const handleEventClick = useCallback(
    (arg: EventClickArg) => {
      const event = events.find((e) => e.id === arg.event.id)
      if (event && onEventClick) onEventClick(event)
    },
    [events, onEventClick],
  )

  const handleDatesSet = useCallback(
    (arg: DatesSetArg) => {
      onRangeChange?.(local(arg.start), local(arg.end))
    },
    [onRangeChange],
  )

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        key={isWide ? 'wide' : 'narrow'}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={isWide ? 'timeGridWeek' : 'listWeek'}
        headerToolbar={
          isWide
            ? { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }
            : { left: 'prev,next', center: 'title', right: 'today' }
        }
        locale="pt-br"
        timeZone="America/Sao_Paulo"
        height="auto"
        events={styledEvents}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
        slotMinTime="07:00:00"
        slotMaxTime="21:00:00"
        allDaySlot={false}
        slotDuration="00:30:00"
        nowIndicator
        firstDay={0}
        noEventsText="Nenhuma sessão neste período"
        buttonText={{ today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia', list: 'Lista' }}
      />
    </div>
  )
}
