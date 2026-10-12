import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { addMinutes, format } from 'date-fns'
import { ArrowLeft, Calendar, Clock, DoorOpen, FileText, Search, Stethoscope, User, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField, inputClass } from '@/components/ui/FormField'
import { useProfessionals } from '@/features/professionals/hooks/useProfessionals'
import { usePatients } from '@/features/patients/hooks/usePatients'
import { useRooms } from '@/features/settings/hooks/useSettings'
import { useCreateAppointment } from '@/features/agenda/hooks/useCreateAppointment'
import { useDebounce } from '@/hooks/useDebounce'

const appointmentSchema = z
  .object({
    patientId: z.string().uuid('Escolha um paciente'),
    professionalId: z.string().uuid('Escolha um profissional'),
    startTime: z.string().min(1, 'Informe o início'),
    endTime: z.string().min(1, 'Informe o fim'),
    roomId: z.string().optional(),
    notes: z.string().max(500).optional(),
  })
  .refine((v) => !v.startTime || !v.endTime || v.endTime > v.startTime, {
    path: ['endTime'],
    message: 'O fim precisa ser depois do início',
  })

type AppointmentFormValues = z.infer<typeof appointmentSchema>

/** `datetime-local` gives "2026-10-12T09:00"; the API wants a local date-time without a zone. */
const toApiLocal = (value: string) => (value.length === 16 ? `${value}:00` : value)
const toInput = (d: Date) => format(d, "yyyy-MM-dd'T'HH:mm")

export default function AppointmentFormPage() {
  const navigate = useNavigate()
  const createAppointment = useCreateAppointment()
  const { data: professionalsData } = useProfessionals({ size: 100 })
  const { data: rooms } = useRooms()

  const [search, setSearch] = useState('')
  const [pickedName, setPickedName] = useState('')
  const debounced = useDebounce(search.trim(), 250)
  const { data: found, isFetching } = usePatients({ q: debounced || undefined, size: 8 })

  const { register, handleSubmit, setValue, getValues, formState, watch } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    mode: 'onTouched',
    defaultValues: { patientId: '', professionalId: '', roomId: '' },
  })

  const patientId = watch('patientId')
  const professionals = professionalsData?.content ?? []

  /** Fill the end time from the professional's session duration whenever the start or professional changes. */
  const suggestEnd = (start: string, professionalId: string) => {
    const duration = professionals.find((p) => p.id === professionalId)?.sessionDuration
    if (!start || !duration) return
    const end = addMinutes(new Date(start), duration)
    if (!Number.isNaN(end.getTime())) setValue('endTime', toInput(end), { shouldValidate: formState.isSubmitted })
  }

  const onSubmit = (values: AppointmentFormValues) => {
    createAppointment.mutate(
      {
        patientId: values.patientId,
        professionalId: values.professionalId,
        startTime: toApiLocal(values.startTime),
        endTime: toApiLocal(values.endTime),
        roomId: values.roomId || undefined,
        notes: values.notes || undefined,
      },
      { onSuccess: () => navigate('/agenda', { viewTransition: true }) },
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 pt-2 sm:pt-4">
      <button
        type="button"
        onClick={() => navigate('/agenda', { viewTransition: true })}
        className="inline-flex items-center gap-1.5 text-[13px] text-text-2 transition hover:text-text-1"
      >
        <ArrowLeft size={14} /> Agenda
      </button>

      <header>
        <h1 className="text-[28px] leading-tight text-text-1 sm:text-[32px]">Novo agendamento</h1>
        <p className="mt-1 text-[15px] text-text-2">Escolha o paciente, o profissional e o horário.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="surface space-y-5 p-5 sm:p-8">
        {/* patient: server-side search, so it works with any number of patients */}
        <div className="space-y-1.5">
          <span className="block text-[13px] font-medium text-text-2" id="patient-label">Paciente</span>
          {patientId ? (
            <div className="flex min-h-10 items-center gap-3 rounded-lg border border-border bg-bg-2 px-3">
              <User size={17} className="shrink-0 text-text-3" />
              <span className="flex-1 truncate text-[14px] text-text-1">{pickedName}</span>
              <button
                type="button"
                onClick={() => { setValue('patientId', ''); setPickedName(''); setSearch('') }}
                aria-label="Trocar paciente"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-text-3 transition hover:bg-bg-3 hover:text-text-1"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="flex min-h-10 items-center gap-3 rounded-lg border border-border bg-bg-1 px-3 shadow-sm transition focus-within:border-brand focus-within:shadow-focus">
                <Search size={17} className="shrink-0 text-text-3" />
                <input
                  type="text"
                  aria-labelledby="patient-label"
                  placeholder="Buscar por nome, e-mail ou CPF"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={inputClass}
                />
              </div>
              {search.trim() && (
                <ul className="absolute z-10 mt-1.5 max-h-56 w-full overflow-auto rounded-lg border border-border bg-bg-1 p-1 shadow-lg">
                  {isFetching && <li className="px-3 py-2 text-[13px] text-text-3">Buscando…</li>}
                  {!isFetching && (found?.content ?? []).length === 0 && (
                    <li className="px-3 py-2 text-[13px] text-text-3">Nenhum paciente encontrado.</li>
                  )}
                  {(found?.content ?? []).map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => { setValue('patientId', p.id, { shouldValidate: true }); setPickedName(p.fullName); setSearch('') }}
                        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[14px] text-text-1 transition hover:bg-bg-2"
                      >
                        <User size={14} className="shrink-0 text-text-3" />
                        <span className="truncate">{p.fullName}</span>
                        {p.email && <span className="ml-auto hidden truncate text-xs text-text-3 sm:block">{p.email}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {formState.errors.patientId && <span role="alert" className="block text-xs text-danger">{formState.errors.patientId.message}</span>}
        </div>

        <FormField icon={Stethoscope} label="Profissional" error={formState.errors.professionalId?.message}>
          <select
            {...register('professionalId', { onChange: (e) => suggestEnd(getValues('startTime'), e.target.value) })}
            className={`${inputClass} appearance-none`}
          >
            <option value="">Selecione</option>
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>{p.fullName}</option>
            ))}
          </select>
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField icon={Calendar} label="Início" error={formState.errors.startTime?.message}>
            <input
              type="datetime-local"
              step={300}
              {...register('startTime', { onChange: (e) => suggestEnd(e.target.value, getValues('professionalId')) })}
              className={inputClass}
            />
          </FormField>

          <FormField
            icon={Clock}
            label="Fim"
            error={formState.errors.endTime?.message}
            hint="Preenchido pela duração da sessão do profissional"
          >
            <input type="datetime-local" step={300} {...register('endTime')} className={inputClass} />
          </FormField>
        </div>

        <FormField icon={DoorOpen} label="Sala (opcional)">
          <select {...register('roomId')} className={`${inputClass} appearance-none`}>
            <option value="">Sem sala definida</option>
            {(rooms ?? []).map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </FormField>

        <FormField icon={FileText} label="Observações (opcional)">
          <textarea rows={3} placeholder="Anotações sobre a consulta…" {...register('notes')} className={`${inputClass} resize-none py-2`} />
        </FormField>

        <div className="flex items-center gap-3 border-t border-border pt-5">
          <Button type="submit" size="md" loading={createAppointment.isPending}>
            Agendar sessão
          </Button>
          <Button type="button" variant="ghost" size="md" onClick={() => navigate('/agenda', { viewTransition: true })}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
