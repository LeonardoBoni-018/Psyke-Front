import { CalendarView } from '../components/CalendarView/CalendarView'

export function AgendaPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Agenda</h1>
        <p className="mt-2 text-sm text-slate-600">Visualize sessões, disponibilidade e horários livres.</p>
      </header>
      <CalendarView />
    </section>
  )
}
