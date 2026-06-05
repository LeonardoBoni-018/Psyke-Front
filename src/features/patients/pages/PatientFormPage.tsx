import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, User, Calendar, CreditCard, Phone, Mail, Briefcase, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField, inputClass } from '@/components/ui/FormField'
import { useCreatePatient } from '@/features/patients/hooks/useCreatePatient'
import type { CreatePatientRequest } from '@/types/patient'

const patientSchema = z.object({
  fullName: z.string().min(1, 'Nome obrigatório').max(300),
  birthDate: z.string().optional(),
  cpf: z.string().max(14).optional(),
  gender: z.string().max(30).optional(),
  maritalStatus: z.string().max(30).optional(),
  occupation: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email('E-mail inválido').max(255).optional().or(z.literal('')),
  insurance: z.string().max(100).optional(),
  insuranceNumber: z.string().max(50).optional(),
  referredBy: z.string().max(200).optional(),
})

type PatientFormValues = z.infer<typeof patientSchema>

export default function PatientFormPage() {
  const navigate = useNavigate()
  const createPatient = useCreatePatient()

  const { register, handleSubmit, formState } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    mode: 'onTouched',
  })

  const onSubmit = (values: PatientFormValues) => {
    const data = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== '' && v !== undefined),
    ) as unknown as CreatePatientRequest
    createPatient.mutate(data, {
      onSuccess: (patient) => navigate(`/patients/${patient.id}`),
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        type="button"
        onClick={() => navigate('/patients')}
        className="inline-flex items-center gap-1.5 text-[13px] text-text-3 transition hover:text-text-1"
      >
        <ArrowLeft size={14} /> Pacientes
      </button>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal">
          <UserPlus size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-serif text-text-1">Novo paciente</h1>
          <p className="text-sm text-text-3">Preencha os dados do paciente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="animate-scale-in space-y-5 rounded-[var(--radius-xl)] border border-border bg-bg-1 p-8">
        <FormField icon={User} label="Nome completo" error={formState.errors.fullName?.message}>
          <input id="fullName" type="text" autoComplete="name" {...register('fullName')} className={inputClass} />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField icon={Calendar} label="Data de nascimento" error={formState.errors.birthDate?.message}>
            <input id="birthDate" type="date" {...register('birthDate')} className={inputClass} />
          </FormField>

          <FormField icon={User} label="Gênero" error={formState.errors.gender?.message}>
            <select id="gender" {...register('gender')} className={`${inputClass} appearance-none`}>
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Não-binário">Não-binário</option>
              <option value="Outro">Outro</option>
            </select>
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField icon={User} label="Estado civil" error={formState.errors.maritalStatus?.message}>
            <select id="maritalStatus" {...register('maritalStatus')} className={`${inputClass} appearance-none`}>
              <option value="">Selecione</option>
              <option value="Solteiro(a)">Solteiro(a)</option>
              <option value="Casado(a)">Casado(a)</option>
              <option value="Divorciado(a)">Divorciado(a)</option>
              <option value="Viúvo(a)">Viúvo(a)</option>
              <option value="Outro">Outro</option>
            </select>
          </FormField>

          <FormField icon={CreditCard} label="CPF" error={formState.errors.cpf?.message}>
            <input id="cpf" type="text" maxLength={14} placeholder="000.000.000-00" {...register('cpf')} className={inputClass} />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField icon={Phone} label="Telefone" error={formState.errors.phone?.message}>
            <input id="phone" type="tel" placeholder="(11) 99999-8888" {...register('phone')} className={inputClass} />
          </FormField>

          <FormField icon={Mail} label="E-mail" error={formState.errors.email?.message}>
            <input id="email" type="email" autoComplete="email" {...register('email')} className={inputClass} />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField icon={Briefcase} label="Profissão" error={formState.errors.occupation?.message}>
            <input id="occupation" type="text" {...register('occupation')} className={inputClass} />
          </FormField>

          <FormField icon={User} label="Indicado por" error={formState.errors.referredBy?.message}>
            <input id="referredBy" type="text" {...register('referredBy')} className={inputClass} />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField icon={CreditCard} label="Convênio" error={formState.errors.insurance?.message}>
            <input id="insurance" type="text" {...register('insurance')} className={inputClass} />
          </FormField>

          <FormField icon={CreditCard} label="Nº carteirinha" error={formState.errors.insuranceNumber?.message}>
            <input id="insuranceNumber" type="text" {...register('insuranceNumber')} className={inputClass} />
          </FormField>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Button type="submit" loading={createPatient.isPending}>
            Salvar paciente
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/patients')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}