import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, User, FileText, DollarSign, Clock, Stethoscope, Brain, ShieldCheck, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCreateProfessional } from '@/features/professionals/hooks/useProfessionals'
import type { CreateProfessionalRequest } from '@/types/professional'

const professionalSchema = z.object({
  fullName: z.string().min(1, 'Nome obrigatório').max(300),
  crp: z.string().min(1, 'CRP obrigatório').max(20),
  specialty: z.string().max(200).optional(),
  approach: z.string().max(200).optional(),
  resume: z.string().max(2000).optional(),
  sessionValue: z.string().optional(),
  sessionDuration: z.string().optional(),
  acceptsInsurance: z.boolean().optional(),
})

type ProfessionalFormValues = z.infer<typeof professionalSchema>

const inputClass = "w-full bg-transparent text-text-1 outline-none placeholder:text-text-3"

function FormField({ icon: Icon, label, error, children }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-text-2">{label}</label>
      <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-2 px-3 py-2 transition focus-within:border-teal">
        <Icon size={18} className="shrink-0 text-text-3" />
        {children}
      </div>
      {error && <p className="mt-1 text-[11px] text-danger font-mono">{error}</p>}
    </div>
  )
}

export default function ProfessionalFormPage() {
  const navigate = useNavigate()
  const createProfessional = useCreateProfessional()

  const { register, handleSubmit, formState } = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalSchema),
    mode: 'onTouched',
    defaultValues: { acceptsInsurance: false, sessionDuration: '50' },
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
    createProfessional.mutate(data, {
      onSuccess: () => navigate('/professionals'),
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        type="button"
        onClick={() => navigate('/professionals')}
        className="inline-flex items-center gap-1.5 text-[13px] text-text-3 transition hover:text-text-1"
      >
        <ArrowLeft size={14} /> Profissionais
      </button>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal">
          <UserPlus size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-serif text-text-1">Novo profissional</h1>
          <p className="text-sm text-text-3">Preencha os dados do profissional</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-[var(--radius-xl)] border border-border bg-bg-1 p-8">
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
            <input id="specialty" type="text" placeholder="Psicologia Clínica" {...register('specialty')} className={inputClass} />
          </FormField>

          <FormField icon={Brain} label="Abordagem" error={formState.errors.approach?.message}>
            <input id="approach" type="text" placeholder="TCC" {...register('approach')} className={inputClass} />
          </FormField>
        </div>

        <FormField icon={FileText} label="Resumo profissional" error={formState.errors.resume?.message}>
          <textarea id="resume" rows={3} placeholder="Formação, experiência, áreas de atuação..." {...register('resume')} className={`${inputClass} resize-none`} />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField icon={DollarSign} label="Valor sessão (R$)" error={formState.errors.sessionValue?.message}>
            <input id="sessionValue" type="number" step="0.01" min="0" placeholder="250.00" {...register('sessionValue')} className={inputClass} />
          </FormField>

          <FormField icon={Clock} label="Duração sessão" error={formState.errors.sessionDuration?.message}>
            <select id="sessionDuration" {...register('sessionDuration')} className={`${inputClass} appearance-none`}>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="50">50 min</option>
              <option value="60">60 min</option>
            </select>
          </FormField>
        </div>

        <FormField icon={ShieldCheck} label="Aceita convênio" error={formState.errors.acceptsInsurance?.message}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              id="acceptsInsurance"
              type="checkbox"
              {...register('acceptsInsurance')}
              className="h-4 w-4 rounded border-border bg-bg-3 text-teal accent-teal"
            />
            <span className="text-sm text-text-2">Sim, aceita convênio</span>
          </label>
        </FormField>

        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Button type="submit" loading={createProfessional.isPending}>
            {createProfessional.isPending ? 'Salvando...' : 'Salvar profissional'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/professionals')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}