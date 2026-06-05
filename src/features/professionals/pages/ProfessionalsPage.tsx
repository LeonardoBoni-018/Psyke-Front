import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Plus, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { useProfessionals } from '@/features/professionals/hooks/useProfessionals'
import type { ProfessionalResponse } from '@/types/professional'

function ProfessionalCard({ professional }: { professional: ProfessionalResponse }) {
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
        <button type="button" className="text-[12px] text-teal transition hover:text-teal/80">Editar</button>
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
      <div className="space-y-6">
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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-text-3">Erro ao carregar profissionais</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-bg-2 px-4 py-2 text-sm text-text-2 transition hover:border-border-hi"
        >
          <RefreshCw size={14} /> Tentar novamente
        </button>
      </div>
    )
  }

  const professionals = data?.content ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-text-1">Profissionais</h1>
        <button
          type="button"
          onClick={() => navigate('/professionals/new')}
          className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal/90"
        >
          <Plus size={16} /> Novo profissional
        </button>
      </div>

      {professionals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-border bg-bg-1 py-20">
          <p className="text-text-3">Nenhum profissional encontrado</p>
          <p className="mt-1 text-[12px] text-text-3">Clique em "Novo profissional" para cadastrar</p>
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
