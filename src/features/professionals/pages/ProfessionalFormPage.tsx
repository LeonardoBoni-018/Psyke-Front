import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, User, FileText, DollarSign, Clock, Stethoscope, Brain, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField, inputClass } from '@/components/ui/FormField'
import {
  useCreateProfessional,
  useProfessional,
  useUpdateProfessional,
} from '@/features/professionals/hooks/useProfessionals'
import type { CreateProfessionalRequest, ProfessionalResponse } from '@/types/professional'

const professionalSchema = z.object({
  fullName: z.string().min(1, 'Informe o nome').max(300),
  crp: z.string().min(1, 'Informe o CRP').max(20),
  specialty: z.string().max(200).optional(),
  approach: z.string().max(200).optional(),
  resume: z.string().max(2000).optional(),
  sessionValue: z.string().optional(),
  sessionDuration: z.string().optional(),
  acceptsInsurance: z.boolean().optional(),
})

type ProfessionalFormValues = z.infer<typeof professionalSchema>

const toFormValues = (p: ProfessionalResponse): ProfessionalFormValues => ({
  fullName: p.fullName,
  crp: p.crp,
  specialty: p.specialty ?? '',
  approach: p.approach ?? '',
  resume: p.resume ?? '',
  sessionValue: p.sessionValue != null ? String(p.sessionValue) : '',
  sessionDuration: String(p.sessionDuration ?? 50),
  acceptsInsurance: p.acceptsInsurance,
})

function ProfessionalForm({ initial, id }: { initial?: ProfessionalResponse; id?: string }) {
  const navigate = useNavigate()
  const createProfessional = useCreateProfessional()
  const updateProfessional = useUpdateProfessional()
  const editing = !!id

  const { register, handleSubmit, formState } = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalSchema),
    mode: 'onTouched',
    defaultValues: initial ? toFormValues(initial) : { acceptsInsurance: false, sessionDuration: '50' },
  })

  const onSubmit = (values: ProfessionalFormValues) => {
    const data: CreateProfessionalRequest = {
      fullName: values.fullName,
      crp: values.crp,
      specialty: values.specialty || undefined,
      approach: values.approach || undefined,
      resume: values.resume || undefined,
      sessionValue: values.sessionValue ? Number(values.sessionValue) : undefined,
      sessionDuration: values.sessionDuration ? (Number(values.sessionDuration) as 30 | 45 | 50 | 60) : undefined,
      acceptsInsurance: values.acceptsInsurance || undefined,
    }
    const done = { onSuccess: () => navigate('/professionals', { viewTransition: true }) }
    if (editing) updateProfessional.mutate({ id, data }, done)
    else createProfessional.mutate(data, done)
  }

  const pending = createProfessional.isPending || updateProfessional.isPending

  return (
    <div className="mx-auto max-w-2xl space-y-6 pt-2 sm:pt-4">
      <button
        type="button"
        onClick={() => navigate('/professionals', { viewTransition: true })}
        className="inline-flex items-center gap-1.5 text-[13px] text-text-2 transition hover:text-text-1"
      >
        <ArrowLeft size={14} /> Profissionais
      </button>

      <header>
        <h1 className="text-[28px] leading-tight text-text-1 sm:text-[32px]">{editing ? 'Editar profissional' : 'Novo profissional'}</h1>
        <p className="mt-1 text-[15px] text-text-2">
          {editing ? 'Atualize os dados e o valor da sessão.' : 'Cadastre quem atende na clínica.'}
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="surface space-y-5 p-5 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField icon={User} label="Nome completo" error={formState.errors.fullName?.message}>
            <input id="fullName" type="text" autoComplete="name" {...register('fullName')} className={inputClass} />
          </FormField>

          <FormField icon={ShieldCheck} label="CRP" error={formState.errors.crp?.message}>
            <input id="crp" type="text" maxLength={20} placeholder="06/12345" {...register('crp')} className={inputClass} />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField icon={Stethoscope} label="Especialidade" error={formState.errors.specialty?.message}>
            <input id="specialty" type="text" placeholder="Psicologia clínica" {...register('specialty')} className={inputClass} />
          </FormField>

          <FormField icon={Brain} label="Abordagem" error={formState.errors.approach?.message}>
            <input id="approach" type="text" placeholder="Terapia cognitivo-comportamental" {...register('approach')} className={inputClass} />
          </FormField>
        </div>

        <FormField icon={FileText} label="Resumo profissional" error={formState.errors.resume?.message}>
          <textarea id="resume" rows={3} placeholder="Formação, experiência, áreas de atuação…" {...register('resume')} className={`${inputClass} resize-none py-2`} />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField icon={DollarSign} label="Valor da sessão (R$)" error={formState.errors.sessionValue?.message}>
            <input id="sessionValue" type="number" step="0.01" min="0" placeholder="250,00" {...register('sessionValue')} className={inputClass} />
          </FormField>

          <FormField icon={Clock} label="Duração da sessão" error={formState.errors.sessionDuration?.message}>
            <select id="sessionDuration" {...register('sessionDuration')} className={`${inputClass} appearance-none`}>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="50">50 minutos</option>
              <option value="60">60 minutos</option>
            </select>
          </FormField>
        </div>

        <div className="flex items-center gap-2.5">
          <input id="acceptsInsurance" type="checkbox" {...register('acceptsInsurance')} className="h-4 w-4 rounded border-border accent-[var(--brand)]" />
          <label htmlFor="acceptsInsurance" className="cursor-pointer text-[14px] text-text-1">Atende por convênio</label>
        </div>

        <div className="flex items-center gap-3 border-t border-border pt-5">
          <Button type="submit" size="md" loading={pending}>
            {editing ? 'Salvar alterações' : 'Cadastrar profissional'}
          </Button>
          <Button type="button" variant="ghost" size="md" onClick={() => navigate('/professionals', { viewTransition: true })}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function ProfessionalFormPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = useProfessional(id ?? '')

  if (!id) return <ProfessionalForm />
  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 pt-6">
        <div className="animate-shimmer h-9 w-64 rounded-lg" />
        <div className="animate-shimmer h-80 rounded-xl" />
      </div>
    )
  }
  if (isError || !data) {
    return <p className="pt-10 text-center text-[14px] text-text-3">Profissional não encontrado.</p>
  }
  return <ProfessionalForm key={data.id} id={id} initial={data} />
}
