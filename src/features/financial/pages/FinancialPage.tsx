import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
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
      <div className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-border bg-bg-2 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-text-3">Financeiro</p>
          <h1 className="mt-2 text-3xl font-semibold text-text-1">Gestão de cobranças</h1>
          <p className="mt-2 text-sm text-text-3">Monitore receitas, faturas em aberto e guias de pagamento.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-3 font-semibold text-bg-0 transition hover:bg-teal-dim"
        >
          <Plus className="h-4 w-4" /> Nova cobrança
        </button>
      </div>

      <div className="grid gap-6">
        {summaryQuery.data ? <BalanceSummary summary={summaryQuery.data} /> : (
          <div className="rounded-[var(--radius-xl)] border border-border bg-bg-1 p-6 text-center text-sm text-text-3">
            {summaryQuery.isLoading ? 'Carregando resumo financeiro...' : 'Resumo financeiro indisponível.'}
          </div>
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
              <h2 className="text-lg font-semibold text-text-1">Cobranças</h2>
              <p className="text-sm text-text-3">Visualize e gerencie todas as faturas da clínica.</p>
            </div>
            <div className="text-sm text-text-3">Total de cobranças: {totalCount}</div>
          </div>

          {loading ? (
            <div className="rounded-[var(--radius-xl)] border border-border bg-bg-2 p-8 text-center text-text-3">
              Carregando cobranças...
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
            <p className="text-sm text-text-3">Página {pageIndex + 1} de {pagination.totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!pagination.hasPrevious}
                onClick={() => setPageIndex((current) => Math.max(current - 1, 0))}
                className="rounded-xl border border-border bg-bg-2 px-4 py-2 text-sm text-text-2 transition hover:border-border-hi disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={!pagination.hasNext}
                onClick={() => setPageIndex((current) => current + 1)}
                className="rounded-xl border border-border bg-bg-2 px-4 py-2 text-sm text-text-2 transition hover:border-border-hi disabled:cursor-not-allowed disabled:opacity-50"
              >
                Próxima
              </button>
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
