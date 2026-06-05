import { useMemo, useState } from 'react'
import { Plus, DollarSign, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { BalanceSummary } from '@/features/financial/components/BalanceSummary/BalanceSummary'
import { ChargeTable } from '@/features/financial/components/ChargeTable/ChargeTable'
import { ChargeToolbar } from '@/features/financial/components/ChargeToolbar/ChargeToolbar'
import { CreateChargeModal } from '@/features/financial/components/CreateChargeModal/CreateChargeModal'
import { useCreateCharge, useExportCharge, useFinancialSummary, useMarkChargePaid, useCharges } from '@/features/financial/hooks/useFinancial'
import { usePatients } from '@/features/patients/hooks/usePatients'
import { usePagination } from '@/hooks/usePagination'

const PAGE_SIZE = 10

export default function FinancialPage() {
  const [status, setStatus] = useState<'all' | 'open' | 'paid' | 'overdue'>('all')
  const [search, setSearch] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [busyChargeId, setBusyChargeId] = useState<string | null>(null)

  const patientsQuery = usePatients()
  const summaryQuery = useFinancialSummary()
  const chargesQuery = useCharges({
    status: status === 'all' ? undefined : status,
    search: search.trim() || undefined,
    page: pageIndex,
    size: PAGE_SIZE,
  })
  const createChargeMutation = useCreateCharge()
  const markPaidMutation = useMarkChargePaid()
  const exportMutation = useExportCharge()

  const charges = chargesQuery.data?.content ?? []
  const totalCount = chargesQuery.data?.totalElements ?? 0

  const pagination = usePagination({
    total: totalCount,
    page: pageIndex + 1,
    pageSize: PAGE_SIZE,
  })

  const patientOptions = useMemo(
    () =>
      patientsQuery.data?.content.map((patient) => ({
        id: patient.id,
        name: patient.fullName,
      })) ?? [],
    [patientsQuery.data],
  )

  const handleCreateCharge = (payload: { patientId: string; description: string; amount: number; dueDate: string }) => {
    createChargeMutation.mutate(payload)
  }

  const handleMarkPaid = (id: string) => {
    setBusyChargeId(id)
    markPaidMutation.mutate(id, {
      onSettled: () => setBusyChargeId(null),
    })
  }

  const handleExport = (id: string) => {
    setBusyChargeId(id)
    exportMutation.mutate(id, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `cobranca-${id}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      },
      onSettled: () => setBusyChargeId(null),
    })
  }

  const loading = summaryQuery.isLoading || chargesQuery.isLoading

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal">
            <DollarSign size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-serif text-text-1">Financeiro</h1>
            <p className="mt-1 text-sm text-text-3">Monitore receitas, faturas em aberto e guias de pagamento.</p>
          </div>
        </div>
        <Button size="md" icon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
          Nova cobrança
        </Button>
      </div>

      <div className="grid gap-6">
        {summaryQuery.data ? <BalanceSummary summary={summaryQuery.data} /> : (
          summaryQuery.isLoading ? (
            <div className="page-enter rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6">
              <div className="flex gap-8">
                <div className="space-y-2">
                  <div className="animate-shimmer h-3 w-16 rounded" />
                  <div className="animate-shimmer h-7 w-28 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="animate-shimmer h-3 w-16 rounded" />
                  <div className="animate-shimmer h-7 w-28 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="animate-shimmer h-3 w-16 rounded" />
                  <div className="animate-shimmer h-7 w-28 rounded" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-border bg-bg-1 py-14 gap-3">
              <AlertCircle size={22} className="text-text-3 opacity-50" />
              <p className="text-sm text-text-3">Resumo financeiro indisponível</p>
            </div>
          )
        )}

        <ChargeToolbar
          status={status}
          search={search}
          onStatusChange={(value) => {
            setStatus(value)
            setPageIndex(0)
          }}
          onSearchChange={(value) => {
            setSearch(value)
            setPageIndex(0)
          }}
        />

        <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-serif text-text-1">Cobranças</h2>
              <p className="text-sm text-text-3">Visualize e gerencie todas as faturas da clínica.</p>
            </div>
            <div className="text-sm text-text-3">Total de cobranças: {totalCount}</div>
          </div>

          {loading ? (
            <div className="page-enter space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4" style={{ opacity: 1 - i * 0.15 }}>
                  <div className="animate-shimmer h-4 w-32 rounded" />
                  <div className="animate-shimmer h-4 w-20 rounded" />
                  <div className="animate-shimmer h-4 w-16 rounded ml-auto" />
                </div>
              ))}
            </div>
          ) : (
            <ChargeTable
              charges={charges}
              onMarkPaid={handleMarkPaid}
              onExport={handleExport}
              busyId={busyChargeId ?? undefined}
            />
          )}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-3 font-mono">Página {pageIndex + 1} de {pagination.totalPages}</p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled={!pagination.hasPrevious} onClick={() => setPageIndex((current) => Math.max(current - 1, 0))}>
                <ChevronLeft size={14} /> Anterior
              </Button>
              <Button variant="ghost" size="sm" disabled={!pagination.hasNext} onClick={() => setPageIndex((current) => current + 1)}>
                Próxima <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <CreateChargeModal
          patients={patientOptions}
          onCreate={handleCreateCharge}
          onClose={() => setIsModalOpen(false)}
        />
      ) : null}
    </div>
  )
}
