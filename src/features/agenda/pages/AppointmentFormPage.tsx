import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Calendar, Clock, User, FileText, DoorOpen, CalendarPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProfessionals } from '@/features/professionals/hooks/useProfessionals'
import { usePatients } from '@/features/patients/hooks/usePatients'
import { useCreateAppointment } from '@/features/agenda/hooks/useCreateAppointment'

const appointmentSchema = z.object({
  patientId: z.string().uuid('Selecione um paciente'),
  professionalId: z.string().uuid('Selecione um profissional'),
  startTime: z.string().min(1, 'Data/hora início obrigatória'),
  endTime: z.string().min(1, 'Data/hora fim obrigatória'),
  roomId: z.string().optional(),
  notes: z.string().max(500).optional(),
})

type AppointmentFormValues = z.infer<typeof appointmentSchema>

export default function AppointmentFormPage() {
  const navigate = useNavigate()
  const createAppointment = useCreateAppointment()
  const { data: patientsData } = usePatients({ size: 200 })
  const { data: professionalsData } = useProfessionals({ size: 50 })
  const [searchPatient, setSearchPatient] = useState('')

  const { register, handleSubmit, setValue, formState, watch } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    mode: 'onTouched',
  })

  const selectedPatientId = watch('patientId')

  const filteredPatients = (patientsData?.content ?? []).filter((p) =>
    p.fullName.toLowerCase().includes(searchPatient.toLowerCase()),
  )

  const selectedPatient = (patientsData?.content ?? []).find((p) => p.id === selectedPatientId)

  const onSubmit = (values: AppointmentFormValues) => {
    const start = new Date(values.startTime)
    const end = new Date(values.endTime)
    createAppointment.mutate(
      {
        patientId: values.patientId,
        professionalId: values.professionalId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        roomId: values.roomId || undefined,
        notes: values.notes || undefined,
      },
      { onSuccess: () => navigate('/agenda') },
    )
  }

  const inputClass = "w-full bg-transparent text-text-1 outline-none placeholder:text-text-3"

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        type="button"
        onClick={() => navigate('/agenda')}
        className="inline-flex items-center gap-1.5 text-[13px] text-text-3 transition hover:text-text-1"
      >
        <ArrowLeft size={14} /> Agenda
      </button>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal">
          <CalendarPlus size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-serif text-text-1">Novo agendamento</h1>
          <p className="text-sm text-text-3">Preencha os dados da consulta</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-[var(--radius-xl)] border border-border bg-bg-1 p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text-2">Paciente</label>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-2 px-3 py-2 transition focus-within:border-teal">
              <User size={18} className="text-text-3 shrink-0" />
              {selectedPatient ? (
                <span className="flex-1 text-text-1">{selectedPatient.fullName}</span>
              ) : (
                <input
                  type="text"
                  placeholder="Digite para buscar..."
                  value={searchPatient}
                  onChange={(e) => setSearchPatient(e.target.value)}
                  className={inputClass}
                />
              )}
            </div>
            {selectedPatient && (
              <button
                type="button"
                onClick={() => { setValue('patientId', ''); setSearchPatient(''); }}
                className="text-[11px] text-danger hover:underline"
              >
                Trocar paciente
              </button>
            )}
            {!selectedPatient && searchPatient && filteredPatients.length > 0 && (
              <div className="mt-1 max-h-40 overflow-auto rounded-lg border border-border bg-bg-2">
                {filteredPatients.slice(0, 10).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { setValue('patientId', p.id); setSearchPatient(''); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-1 hover:bg-bg-3 text-left"
                  >
                    <User size={14} className="text-text-3 shrink-0" />
                    {p.fullName}
                  </button>
                ))}
              </div>
            )}
            {formState.errors.patientId && (
              <p className="mt-1 text-[11px] text-danger font-mono">{formState.errors.patientId.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-text-2">Profissional</label>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-2 px-3 py-2 transition focus-within:border-teal">
              <User size={18} className="text-text-3 shrink-0" />
              <select {...register('professionalId')} className={`${inputClass} appearance-none`} defaultValue="">
                <option value="" disabled>Selecione</option>
                {(professionalsData?.content ?? []).map((p) => (
                  <option key={p.id} value={p.id}>{p.fullName}</option>
                ))}
              </select>
            </div>
            {formState.errors.professionalId && (
              <p className="mt-1 text-[11px] text-danger font-mono">{formState.errors.professionalId.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text-2">Início</label>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-2 px-3 py-2 transition focus-within:border-teal">
              <Calendar size={18} className="text-text-3 shrink-0" />
              <input type="datetime-local" {...register('startTime')} className={inputClass} />
            </div>
            {formState.errors.startTime && (
              <p className="mt-1 text-[11px] text-danger font-mono">{formState.errors.startTime.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-text-2">Fim</label>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-2 px-3 py-2 transition focus-within:border-teal">
              <Clock size={18} className="text-text-3 shrink-0" />
              <input type="datetime-local" {...register('endTime')} className={inputClass} />
            </div>
            {formState.errors.endTime && (
              <p className="mt-1 text-[11px] text-danger font-mono">{formState.errors.endTime.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-text-2">Sala (opcional)</label>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-2 px-3 py-2 transition focus-within:border-teal">
            <DoorOpen size={18} className="text-text-3 shrink-0" />
            <input type="text" placeholder="ID da sala" {...register('roomId')} className={inputClass} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-text-2">Observações (opcional)</label>
          <div className="flex items-start gap-3 rounded-lg border border-border bg-bg-2 px-3 py-2 transition focus-within:border-teal">
            <FileText size={18} className="mt-0.5 text-text-3 shrink-0" />
            <textarea rows={3} placeholder="Anotações sobre a consulta..." {...register('notes')} className={`${inputClass} resize-none`} />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Button type="submit" loading={createAppointment.isPending}>
            {createAppointment.isPending ? 'Salvando...' : 'Agendar'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/agenda')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}