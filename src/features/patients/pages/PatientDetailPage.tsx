import { useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeft, FileText, DollarSign, Calendar, Mail, Phone, MapPin, User, CreditCard } from 'lucide-react'
import { usePatient } from '@/features/patients/hooks/usePatient'
import type { Gender, MaritalStatus, PatientStatus } from '@/types/patient'

const statusConfig: Record<PatientStatus, { label: string; className: string }> = {
  ACTIVE: { label: 'Ativo', className: 'bg-teal/15 text-teal' },
  INACTIVE: { label: 'Inativo', className: 'bg-text-3/10 text-text-3' },
  WAITING: { label: 'Em espera', className: 'bg-amber/15 text-amber' },
  DISCHARGED: { label: 'Alta', className: 'bg-info/15 text-info' },
}

const genderLabels: Record<Gender, string> = {
  MALE: 'Masculino',
  FEMALE: 'Feminino',
  NON_BINARY: 'Não-binário',
  OTHER: 'Outro',
  PREFER_NOT_TO_SAY: 'Prefere não informar',
}

const maritalStatusLabels: Record<MaritalStatus, string> = {
  SINGLE: 'Solteiro(a)',
  MARRIED: 'Casado(a)',
  DIVORCED: 'Divorciado(a)',
  WIDOWED: 'Viúvo(a)',
  OTHER: 'Outro',
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-bg-2 text-text-3">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">{label}</p>
        <p className="mt-0.5 text-sm text-text-1 break-words">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: patient, isLoading, isError, error } = usePatient(id!)

  const age = useMemo(() => {
    if (!patient) return ''
    const birth = new Date(patient.birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return `${age} anos`
  }, [patient])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-24 rounded-lg bg-bg-2" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-48 rounded-[var(--radius-xl)] bg-bg-2 lg:col-span-2" />
          <div className="h-48 rounded-[var(--radius-xl)] bg-bg-2" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-text-3">Erro ao carregar paciente</p>
        {error instanceof Error && <p className="mt-2 text-[12px] text-danger font-mono">{error.message}</p>}
        <button
          type="button"
          onClick={() => navigate('/patients')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-bg-2 px-4 py-2 text-sm text-text-2 transition hover:border-border-hi"
        >
          <ArrowLeft size={14} /> Voltar para pacientes
        </button>
      </div>
    )
  }

  if (!patient) return null

  const statusStyle = statusConfig[patient.status]

  return (
    <div className="space-y-6">
      <Link
        to="/patients"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-3 transition hover:text-text-1"
      >
        <ArrowLeft size={14} /> Pacientes
      </Link>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-serif text-text-1">{patient.fullName}</h1>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium font-mono ${statusStyle.className}`}>
                    {statusStyle.label}
                  </span>
                </div>
                <p className="text-sm text-text-3">Paciente desde {format(new Date(patient.createdAt), 'dd/MM/yyyy')}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <InfoRow icon={User} label="Idade / Gênero" value={`${age} · ${genderLabels[patient.gender]}`} />
              <InfoRow icon={User} label="Estado civil" value={maritalStatusLabels[patient.maritalStatus]} />
              <InfoRow icon={Mail} label="E-mail" value={patient.email} />
              <InfoRow icon={Phone} label="Telefone" value={patient.phone} />
              <InfoRow icon={MapPin} label="Endereço" value={`${patient.address.street}, ${patient.address.number} · ${patient.address.city}, ${patient.address.state}`} />
              <InfoRow icon={CreditCard} label="CPF" value={patient.cpf} />
              {patient.profession && <InfoRow icon={Calendar} label="Profissão" value={patient.profession} />}
              {patient.insurance && (
                <InfoRow icon={CreditCard} label="Convênio" value={`${patient.insurance}${patient.insuranceNumber ? ` (${patient.insuranceNumber})` : ''}`} />
              )}
            </div>
          </div>

          {patient.notes && (
            <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-text-1">Observações</h2>
              <p className="mt-2 text-sm text-text-2 leading-relaxed">{patient.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Link
            to={`/patients/${patient.id}/record`}
            className="flex items-center gap-4 rounded-[var(--radius-xl)] border border-border bg-bg-1 p-5 shadow-sm transition hover:border-teal hover:bg-teal/5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal">
              <FileText size={22} />
            </div>
            <div>
              <p className="font-medium text-text-1">Prontuário</p>
              <p className="text-[12px] text-text-3">Evoluções, anamnese, documentos</p>
            </div>
          </Link>

          <Link
            to={`/financial?patientId=${patient.id}`}
            className="flex items-center gap-4 rounded-[var(--radius-xl)] border border-border bg-bg-1 p-5 shadow-sm transition hover:border-teal hover:bg-teal/5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/10 text-amber">
              <DollarSign size={22} />
            </div>
            <div>
              <p className="font-medium text-text-1">Financeiro</p>
              <p className="text-[12px] text-text-3">Cobranças e histórico</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
