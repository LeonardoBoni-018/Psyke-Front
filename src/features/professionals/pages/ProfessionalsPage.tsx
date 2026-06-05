import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Plus, CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProfessionals } from '@/features/professionals/hooks/useProfessionals'
import type { ProfessionalResponse } from '@/types/professional'

function ProfessionalCard({ professional }: { professional: ProfessionalResponse }) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 shadow-sm transition hover:border-border-hi">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal">
            <User size={22} />
          </div>
          <div>
            <button type="button" onClick={() => setExpanded(!expanded)} className="text-left">
              <h3 className="font-medium text-text-1 hover:text-teal transition-colors">{professional.fullName}</h3>
              <p className="text-[12px] text-text-3 font-mono">CRP {professional.crp}</p>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-text-3">Especialidade</p>
          <p className="text-text-1">{professional.specialty || '—'}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-text-3">Abordagem</p>
          <p className="text-text-1">{professional.approach || '—'}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-text-3">Valor sessão</p>
          <p className="text-text-1">R$ {professional.sessionValue?.toFixed(2) ?? '—'}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-text-3">Duração</p>
          <p className="text-text-1">{professional.sessionDuration ? `${professional.sessionDuration} min` : '—'}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 text-[12px] font-mono ${professional.acceptsInsurance ? 'text-teal' : 'text-text-3'}`}>
            {professional.acceptsInsurance ? <CheckCircle size={14} /> : <XCircle size={14} />}
            Convênio
          </span>
          <span className={`inline-flex items-center gap-1 text-[12px] font-mono ${professional.active ? 'text-teal' : 'text-danger'}`}>
            {professional.active ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {professional.active ? 'Ativo' : 'Inativo'}
          </span>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => navigate(`/professionals/${professional.id}/edit`)}>
          Editar
        </Button>
      </div>
      {expanded && (
        <div className="mt-4 border-t border-border pt-4 text-sm text-text-2 space-y-1">
          <p><span className="text-[11px] uppercase tracking-[0.1em] text-text-3">Resumo:</span> {professional.resume || '—'}</p>
        </div>
      )}
    </div>
  )
}

export default function ProfessionalsPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useProfessionals()

  if (isLoading) {
    return (
      <div className="page-enter space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-44 rounded-lg bg-bg-2 animate-shimmer" />
          <div className="h-10 w-40 rounded-xl bg-bg-2 animate-shimmer" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-bg-2 animate-shimmer" />
                <div className="space-y-2">
                  <div className="h-4 w-36 rounded bg-bg-2 animate-shimmer" />
                  <div className="h-3 w-20 rounded bg-bg-2 animate-shimmer" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="space-y-1">
                    <div className="h-2 w-16 rounded bg-bg-2 animate-shimmer" />
                    <div className="h-4 w-24 rounded bg-bg-2 animate-shimmer" />
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-border pt-4">
                <div className="h-4 w-20 rounded bg-bg-2 animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <AlertCircle size={22} className="text-text-3 opacity-50" />
        <p className="text-sm text-text-3">Erro ao carregar profissionais</p>
        <Button variant="ghost" onClick={() => refetch()}>
          <RefreshCw size={14} /> Tentar novamente
        </Button>
      </div>
    )
  }

  const professionals = data?.content ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6">
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal">
          <User size={20} />
        </div>
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif text-text-1">Profissionais</h1>
            <p className="mt-1 text-sm text-text-3">Gerencie os profissionais da clínica</p>
          </div>
          <Button onClick={() => navigate('/professionals/new')}>
            <Plus size={16} /> Novo profissional
          </Button>
        </div>
      </div>

      {professionals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-border bg-bg-1 py-20 gap-3">
          <User size={22} className="text-text-3 opacity-50" />
          <p className="text-sm text-text-3">Nenhum profissional encontrado</p>
          <p className="text-[12px] text-text-3">Clique em "Novo profissional" para cadastrar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {professionals.map((professional, i) => (
            <div key={professional.id} className="item-enter" style={{ animationDelay: `${i * 40}ms` }}>
              <ProfessionalCard professional={professional} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
