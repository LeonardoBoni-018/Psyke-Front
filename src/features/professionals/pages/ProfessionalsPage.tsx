import { useNavigate } from 'react-router-dom'
import { Plus, RefreshCw, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/layout/PageHeader/PageHeader'
import { useProfessionals } from '@/features/professionals/hooks/useProfessionals'
import { formatCurrency } from '@/lib/currency'
import type { ProfessionalResponse } from '@/types/professional'

const initials = (name: string) =>
  name
    .replace(/^(Dra?\.)\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

function ProfessionalCard({ professional }: { professional: ProfessionalResponse }) {
  const navigate = useNavigate()

  return (
    <article className="surface lift flex h-full flex-col p-5">
      <div className="flex items-start gap-3.5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-[17px] font-semibold text-brand">
          {initials(professional.fullName)}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[16px] text-text-1">{professional.fullName}</h2>
          <p className="text-[13px] text-text-3">CRP {professional.crp}</p>
        </div>
        {!professional.active && (
          <span className="rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-semibold text-danger">Inativo</span>
        )}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3.5 text-[14px]">
        <div>
          <dt className="text-xs text-text-3">Especialidade</dt>
          <dd className="mt-0.5 text-text-1">{professional.specialty || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-3">Abordagem</dt>
          <dd className="mt-0.5 text-text-1">{professional.approach || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-3">Valor da sessão</dt>
          <dd className="mt-0.5 font-semibold text-text-1 tabular">{formatCurrency(professional.sessionValue)}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-3">Duração</dt>
          <dd className="mt-0.5 text-text-1 tabular">{professional.sessionDuration ? `${professional.sessionDuration} min` : '—'}</dd>
        </div>
      </dl>

      {professional.resume && <p className="mt-4 line-clamp-2 text-[13px] leading-relaxed text-text-2">{professional.resume}</p>}

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className={`inline-flex items-center gap-1.5 text-[13px] ${professional.acceptsInsurance ? 'text-brand' : 'text-text-3'}`}>
          <ShieldCheck size={15} />
          {professional.acceptsInsurance ? 'Atende por convênio' : 'Somente particular'}
        </span>
        <Button type="button" variant="ghost" size="sm" onClick={() => navigate(`/professionals/${professional.id}/edit`, { viewTransition: true })}>
          Editar
        </Button>
      </div>
    </article>
  )
}

export default function ProfessionalsPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useProfessionals()

  const header = (
    <PageHeader
      title="Profissionais"
      description="Quem atende na clínica, com valores e duração das sessões."
      actions={
        <Button size="md" icon={<Plus size={16} />} onClick={() => navigate('/professionals/new', { viewTransition: true })}>
          Novo profissional
        </Button>
      }
    />
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        {header}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="surface space-y-4 p-5">
              <div className="flex items-center gap-3.5">
                <div className="animate-shimmer h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <div className="animate-shimmer h-4 w-36 rounded" />
                  <div className="animate-shimmer h-3 w-20 rounded" />
                </div>
              </div>
              <div className="animate-shimmer h-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {header}
        <div className="surface flex flex-col items-center gap-3 px-6 py-14 text-center">
          <p className="text-[15px] text-text-1">Não foi possível carregar os profissionais.</p>
          <Button variant="ghost" size="md" onClick={() => refetch()} icon={<RefreshCw size={14} />}>
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  const professionals = data?.content ?? []

  return (
    <div className="space-y-6">
      {header}
      {professionals.length === 0 ? (
        <div className="surface flex flex-col items-center gap-2 px-6 py-16 text-center">
          <p className="text-[15px] text-text-1">Nenhum profissional cadastrado</p>
          <p className="text-[13px] text-text-3">Cadastre o primeiro para liberar a agenda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {professionals.map((professional, i) => (
            <div key={professional.id} className="item-enter" style={{ animationDelay: `${i * 50}ms` }}>
              <ProfessionalCard professional={professional} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
