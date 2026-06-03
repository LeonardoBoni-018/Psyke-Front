import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeft, FileText, Plus, Save, Archive, Check, AlertCircle } from 'lucide-react'
import { usePatient } from '@/features/patients/hooks/usePatient'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  useProntuarioByPatient,
  useCreateProntuario,
  useUpdateProntuario,
  useArchiveProntuario,
  useEvolucoes,
  useAddEvolucao,
  useAnamnese,
  useCreateAnamnese,
} from '@/features/medical-records/hooks/useProntuario'
import type { CreateProntuarioRequest, CreateEvolucaoRequest, CreateAnamneseRequest } from '@/types/medical-record'
import type { EvolucaoClinicaResponse, ProntuarioResponse } from '@/types/medical-record'
import type { RecordStatus } from '@/types/status'

const statusConfig: Record<RecordStatus, { label: string; className: string }> = {
  ACTIVE: { label: 'Ativo', className: 'bg-teal/15 text-teal' },
  ARCHIVED: { label: 'Arquivado', className: 'bg-amber/15 text-amber' },
}

function EvolucaoCard({ evolucao }: { evolucao: EvolucaoClinicaResponse }) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-text-1 font-mono">
            {format(new Date(evolucao.sessionDate), 'dd/MM/yyyy')}
          </span>
          {evolucao.signed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-medium text-teal font-mono">
              <Check size={11} /> Assinado
            </span>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-info">S</span>
          <p className="mt-0.5 text-sm text-text-2 leading-relaxed">{evolucao.subjective}</p>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-amber">O</span>
          <p className="mt-0.5 text-sm text-text-2 leading-relaxed">{evolucao.objective}</p>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-teal">A</span>
          <p className="mt-0.5 text-sm text-text-2 leading-relaxed">{evolucao.assessment}</p>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-danger">P</span>
          <p className="mt-0.5 text-sm text-text-2 leading-relaxed">{evolucao.plan}</p>
        </div>
      </div>
      {evolucao.techniques.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {evolucao.techniques.map((t, i) => (
            <span
              key={i}
              className="rounded-md bg-bg-2 px-2 py-0.5 text-[11px] text-text-3 font-mono"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <Save size={15} />
      )}
      {children}
    </button>
  )
}

export default function MedicalRecordsPage() {
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((state) => state.user)
  const { data: patient, isLoading: patientLoading, isError: patientError } = usePatient(id!)

  const {
    data: prontuarios,
    isLoading: prontuariosLoading,
    isError: prontuariosError,
    refetch: refetchProntuarios,
  } = useProntuarioByPatient(id!)

  const prontuario: ProntuarioResponse | null = prontuarios?.[0] ?? null

  const {
    data: evolucoesData,
    isLoading: evolucoesLoading,
  } = useEvolucoes(prontuario?.id ?? '')

  const {
    data: anamnese,
    isLoading: anamneseLoading,
  } = useAnamnese(prontuario?.id ?? '')

  const createProntuarioMutation = useCreateProntuario()
  const updateProntuarioMutation = useUpdateProntuario()
  const archiveProntuarioMutation = useArchiveProntuario()
  const createAnamneseMutation = useCreateAnamnese()
  const addEvolucaoMutation = useAddEvolucao()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showEvolucaoForm, setShowEvolucaoForm] = useState(false)
  const [showAnamneseForm, setShowAnamneseForm] = useState(false)

  const [createForm, setCreateForm] = useState({ allergies: '', chronicConditions: '', medications: '', notes: '' })
  const [editForm, setEditForm] = useState({ allergies: '', chronicConditions: '', medications: '', notes: '' })
  const [anamneseForm, setAnamneseForm] = useState({
    chiefComplaint: '',
    history: '',
    familyHistory: '',
    personalHistory: '',
    medications: '',
    sleepPattern: '',
    substanceUse: '',
    suicideRisk: '',
    traumaHistory: '',
    socialSupport: '',
    developmentalHistory: '',
  })
  const [evolucaoForm, setEvolucaoForm] = useState({
    sessionDate: format(new Date(), 'yyyy-MM-dd'),
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    techniques: '',
  })

  function handleCreateProntuario(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    createProntuarioMutation.mutate(
      {
        patientId: id!,
        professionalId: user.id,
        allergies: createForm.allergies || undefined,
        chronicConditions: createForm.chronicConditions || undefined,
        medications: createForm.medications || undefined,
        notes: createForm.notes || undefined,
      } satisfies CreateProntuarioRequest,
      { onSuccess: () => setShowCreateForm(false) },
    )
  }

  function handleEditProntuario(e: React.FormEvent) {
    e.preventDefault()
    if (!prontuario) return
    updateProntuarioMutation.mutate(
      { id: prontuario.id, data: editForm },
      { onSuccess: () => setEditing(false) },
    )
  }

  function handleArchiveProntuario() {
    if (!prontuario) return
    archiveProntuarioMutation.mutate(prontuario.id)
  }

  function handleCreateAnamnese(e: React.FormEvent) {
    e.preventDefault()
    if (!prontuario) return
    createAnamneseMutation.mutate(
      {
        prontuarioId: prontuario.id,
        ...anamneseForm,
        developmentalHistory: anamneseForm.developmentalHistory || undefined,
      } satisfies CreateAnamneseRequest,
      { onSuccess: () => setShowAnamneseForm(false) },
    )
  }

  function handleAddEvolucao(e: React.FormEvent) {
    e.preventDefault()
    if (!prontuario) return
    addEvolucaoMutation.mutate(
      {
        prontuarioId: prontuario.id,
        sessionDate: evolucaoForm.sessionDate,
        subjective: evolucaoForm.subjective,
        objective: evolucaoForm.objective,
        assessment: evolucaoForm.assessment,
        plan: evolucaoForm.plan,
        techniques: evolucaoForm.techniques
          ? evolucaoForm.techniques.split(',').map((t) => t.trim()).filter(Boolean)
          : undefined,
      } satisfies CreateEvolucaoRequest,
      {
        onSuccess: () => {
          setShowEvolucaoForm(false)
          setEvolucaoForm({
            sessionDate: format(new Date(), 'yyyy-MM-dd'),
            subjective: '',
            objective: '',
            assessment: '',
            plan: '',
            techniques: '',
          })
        },
      },
    )
  }

  function startEdit() {
    if (!prontuario) return
    setEditForm({
      allergies: prontuario.allergies || '',
      chronicConditions: prontuario.chronicConditions || '',
      medications: prontuario.medications || '',
      notes: prontuario.notes || '',
    })
    setEditing(true)
  }

  const isLoading = patientLoading || prontuariosLoading
  const isError = patientError || prontuariosError

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-48 rounded-lg bg-bg-2 animate-shimmer" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-64 rounded-[var(--radius-xl)] bg-bg-2 animate-shimmer" />
          <div className="h-64 rounded-[var(--radius-xl)] bg-bg-2 animate-shimmer" />
        </div>
        <div className="h-8 w-64 rounded-lg bg-bg-2 animate-shimmer" />
        <div className="space-y-3">
          <div className="h-40 rounded-[var(--radius-xl)] bg-bg-2 animate-shimmer" />
          <div className="h-40 rounded-[var(--radius-xl)] bg-bg-2 animate-shimmer" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={40} className="text-danger" />
        <p className="mt-4 text-text-3">Erro ao carregar prontuário</p>
        <button
          type="button"
          onClick={() => refetchProntuarios()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-bg-2 px-4 py-2 text-sm text-text-2 transition hover:border-border-hi"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (!prontuario) {
    return (
      <div className="space-y-6">
        <Link
          to={`/patients/${id}`}
          className="inline-flex items-center gap-1.5 text-[13px] text-text-3 transition hover:text-text-1"
        >
          <ArrowLeft size={14} /> Voltar
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-serif text-text-1">
            {patient?.fullName ?? 'Paciente'} — Prontuário
          </h1>
        </div>

        {!showCreateForm ? (
          <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-border bg-bg-1 py-20 shadow-sm">
            <FileText size={40} className="text-text-3" />
            <p className="mt-4 text-text-2">Nenhum prontuário encontrado</p>
            <p className="mt-1 text-[12px] text-text-3">Crie um prontuário para este paciente</p>
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal/90"
            >
              <Plus size={16} /> Criar prontuário
            </button>
          </div>
        ) : (
          <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-text-1">Criar prontuário</h2>
            <form onSubmit={handleCreateProntuario} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Alergias</label>
                <textarea
                  value={createForm.allergies}
                  onChange={(e) => setCreateForm({ ...createForm, allergies: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Condições crônicas</label>
                <textarea
                  value={createForm.chronicConditions}
                  onChange={(e) => setCreateForm({ ...createForm, chronicConditions: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Medicamentos</label>
                <textarea
                  value={createForm.medications}
                  onChange={(e) => setCreateForm({ ...createForm, medications: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Notas</label>
                <textarea
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div className="flex gap-3">
                <SubmitButton loading={createProntuarioMutation.isPending}>
                  Criar prontuário
                </SubmitButton>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="rounded-xl border border-border bg-bg-2 px-4 py-2 text-sm text-text-2 transition hover:border-border-hi"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    )
  }

  const evolucoes = evolucoesData?.content ?? []
  const statusStyle = statusConfig[prontuario.status]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to={`/patients/${id}`}
          className="inline-flex items-center gap-1.5 text-[13px] text-text-3 transition hover:text-text-1"
        >
          <ArrowLeft size={14} /> Voltar
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-serif text-text-1">
            {patient?.fullName ?? 'Paciente'} — Prontuário
          </h1>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium font-mono ${statusStyle.className}`}>
            {statusStyle.label}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-1">Informações Clínicas</h2>
            {!editing && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={startEdit}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-2 px-3 py-1.5 text-[12px] text-text-2 transition hover:border-border-hi"
                >
                  <FileText size={12} /> Editar
                </button>
                {prontuario.status === 'ACTIVE' && (
                  <button
                    type="button"
                    onClick={handleArchiveProntuario}
                    disabled={archiveProntuarioMutation.isPending}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-2 px-3 py-1.5 text-[12px] text-text-2 transition hover:border-border-hi disabled:opacity-50"
                  >
                    <Archive size={12} /> Arquivar
                  </button>
                )}
              </div>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleEditProntuario} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Alergias</label>
                <textarea
                  value={editForm.allergies}
                  onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Condições crônicas</label>
                <textarea
                  value={editForm.chronicConditions}
                  onChange={(e) => setEditForm({ ...editForm, chronicConditions: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Medicamentos</label>
                <textarea
                  value={editForm.medications}
                  onChange={(e) => setEditForm({ ...editForm, medications: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Notas</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div className="flex gap-3">
                <SubmitButton loading={updateProntuarioMutation.isPending}>
                  Salvar
                </SubmitButton>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-xl border border-border bg-bg-2 px-4 py-2 text-sm text-text-2 transition hover:border-border-hi"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">Alergias</p>
                <p className="mt-0.5 text-sm text-text-1">{prontuario.allergies || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">Condições crônicas</p>
                <p className="mt-0.5 text-sm text-text-1">{prontuario.chronicConditions || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">Medicamentos</p>
                <p className="mt-0.5 text-sm text-text-1">{prontuario.medications || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">Notas</p>
                <p className="mt-0.5 text-sm text-text-1">{prontuario.notes || '—'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-1">Anamnese</h2>
            {!anamnese && !showAnamneseForm && (
              <button
                type="button"
                onClick={() => setShowAnamneseForm(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-2 px-3 py-1.5 text-[12px] text-text-2 transition hover:border-border-hi"
              >
                <Plus size={12} /> Nova anamnese
              </button>
            )}
          </div>

          {anamneseLoading && (
            <div className="space-y-3">
              <div className="h-4 rounded bg-bg-2 animate-shimmer" />
              <div className="h-4 rounded bg-bg-2 animate-shimmer" />
              <div className="h-4 w-3/4 rounded bg-bg-2 animate-shimmer" />
            </div>
          )}

          {!anamneseLoading && !anamnese && !showAnamneseForm && (
            <p className="text-[13px] text-text-3">Nenhuma anamnese registrada.</p>
          )}

          {showAnamneseForm && (
            <form onSubmit={handleCreateAnamnese} className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Queixa principal</label>
                <textarea
                  value={anamneseForm.chiefComplaint}
                  onChange={(e) => setAnamneseForm({ ...anamneseForm, chiefComplaint: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Histórico</label>
                <textarea
                  value={anamneseForm.history}
                  onChange={(e) => setAnamneseForm({ ...anamneseForm, history: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">História familiar</label>
                <textarea
                  value={anamneseForm.familyHistory}
                  onChange={(e) => setAnamneseForm({ ...anamneseForm, familyHistory: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">História pessoal</label>
                <textarea
                  value={anamneseForm.personalHistory}
                  onChange={(e) => setAnamneseForm({ ...anamneseForm, personalHistory: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Medicamentos em uso</label>
                <textarea
                  value={anamneseForm.medications}
                  onChange={(e) => setAnamneseForm({ ...anamneseForm, medications: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Padrão de sono</label>
                <textarea
                  value={anamneseForm.sleepPattern}
                  onChange={(e) => setAnamneseForm({ ...anamneseForm, sleepPattern: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Uso de substâncias</label>
                <textarea
                  value={anamneseForm.substanceUse}
                  onChange={(e) => setAnamneseForm({ ...anamneseForm, substanceUse: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Risco de suicídio</label>
                <textarea
                  value={anamneseForm.suicideRisk}
                  onChange={(e) => setAnamneseForm({ ...anamneseForm, suicideRisk: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Histórico de trauma</label>
                <textarea
                  value={anamneseForm.traumaHistory}
                  onChange={(e) => setAnamneseForm({ ...anamneseForm, traumaHistory: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Suporte social</label>
                <textarea
                  value={anamneseForm.socialSupport}
                  onChange={(e) => setAnamneseForm({ ...anamneseForm, socialSupport: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">História do desenvolvimento</label>
                <textarea
                  value={anamneseForm.developmentalHistory}
                  onChange={(e) => setAnamneseForm({ ...anamneseForm, developmentalHistory: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <SubmitButton loading={createAnamneseMutation.isPending}>
                  Criar anamnese
                </SubmitButton>
                <button
                  type="button"
                  onClick={() => setShowAnamneseForm(false)}
                  className="rounded-xl border border-border bg-bg-2 px-4 py-2 text-sm text-text-2 transition hover:border-border-hi"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {!anamneseLoading && anamnese && (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">Queixa principal</p>
                <p className="mt-0.5 text-sm text-text-1">{anamnese.chiefComplaint || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">Histórico</p>
                <p className="mt-0.5 text-sm text-text-1">{anamnese.history || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">História familiar</p>
                <p className="mt-0.5 text-sm text-text-1">{anamnese.familyHistory || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">História pessoal</p>
                <p className="mt-0.5 text-sm text-text-1">{anamnese.personalHistory || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">Medicamentos em uso</p>
                <p className="mt-0.5 text-sm text-text-1">{anamnese.medications || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">Padrão de sono</p>
                <p className="mt-0.5 text-sm text-text-1">{anamnese.sleepPattern || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">Uso de substâncias</p>
                <p className="mt-0.5 text-sm text-text-1">{anamnese.substanceUse || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">Risco de suicídio</p>
                <p className="mt-0.5 text-sm text-text-1">{anamnese.suicideRisk || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">Histórico de trauma</p>
                <p className="mt-0.5 text-sm text-text-1">{anamnese.traumaHistory || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">Suporte social</p>
                <p className="mt-0.5 text-sm text-text-1">{anamnese.socialSupport || '—'}</p>
              </div>
              {anamnese.developmentalHistory && (
                <div>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-text-3">História do desenvolvimento</p>
                  <p className="mt-0.5 text-sm text-text-1">{anamnese.developmentalHistory}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-1">Evoluções Clínicas</h2>
          <button
            type="button"
            onClick={() => setShowEvolucaoForm((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal/90"
          >
            <Plus size={15} /> Nova evolução
          </button>
        </div>

        {showEvolucaoForm && (
          <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-text-1">Nova evolução clínica</h3>
            <form onSubmit={handleAddEvolucao} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">Data da sessão</label>
                <input
                  type="date"
                  value={evolucaoForm.sessionDate}
                  onChange={(e) => setEvolucaoForm({ ...evolucaoForm, sessionDate: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-info">
                  <span className="font-bold">S</span> Subjetivo
                </label>
                <textarea
                  value={evolucaoForm.subjective}
                  onChange={(e) => setEvolucaoForm({ ...evolucaoForm, subjective: e.target.value })}
                  rows={3}
                  placeholder="Relato do paciente..."
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-info resize-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-amber">
                  <span className="font-bold">O</span> Objetivo
                </label>
                <textarea
                  value={evolucaoForm.objective}
                  onChange={(e) => setEvolucaoForm({ ...evolucaoForm, objective: e.target.value })}
                  rows={3}
                  placeholder="Observações do profissional..."
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-amber resize-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-teal">
                  <span className="font-bold">A</span> Avaliação
                </label>
                <textarea
                  value={evolucaoForm.assessment}
                  onChange={(e) => setEvolucaoForm({ ...evolucaoForm, assessment: e.target.value })}
                  rows={3}
                  placeholder="Análise clínica..."
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal resize-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-danger">
                  <span className="font-bold">P</span> Plano
                </label>
                <textarea
                  value={evolucaoForm.plan}
                  onChange={(e) => setEvolucaoForm({ ...evolucaoForm, plan: e.target.value })}
                  rows={3}
                  placeholder="Plano terapêutico..."
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-danger resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-text-3">
                  Técnicas <span className="text-text-3 font-normal normal-case">(separadas por vírgula)</span>
                </label>
                <input
                  type="text"
                  value={evolucaoForm.techniques}
                  onChange={(e) => setEvolucaoForm({ ...evolucaoForm, techniques: e.target.value })}
                  placeholder="Ex: Respiração, Reestruturação cognitiva"
                  className="mt-1 w-full rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal"
                />
              </div>
              <div className="flex gap-3">
                <SubmitButton loading={addEvolucaoMutation.isPending}>
                  Salvar evolução
                </SubmitButton>
                <button
                  type="button"
                  onClick={() => setShowEvolucaoForm(false)}
                  className="rounded-xl border border-border bg-bg-2 px-4 py-2 text-sm text-text-2 transition hover:border-border-hi"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {evolucoesLoading && (
          <div className="space-y-3">
            <div className="h-44 rounded-[var(--radius-xl)] bg-bg-2 animate-shimmer" />
            <div className="h-44 rounded-[var(--radius-xl)] bg-bg-2 animate-shimmer" />
          </div>
        )}

        {!evolucoesLoading && evolucoes.length === 0 && !showEvolucaoForm && (
          <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-border bg-bg-1/50 py-12">
            <p className="text-[13px] text-text-3">Nenhuma evolução registrada.</p>
          </div>
        )}

        {!evolucoesLoading && evolucoes.length > 0 && (
          <div className="space-y-3">
            {evolucoes.map((evolucao) => (
              <EvolucaoCard key={evolucao.id} evolucao={evolucao} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
