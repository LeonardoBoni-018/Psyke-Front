import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/layout/PageHeader/PageHeader'
import { BalanceSummary } from '@/features/financial/components/BalanceSummary/BalanceSummary'
import { ChargeTable } from '@/features/financial/components/ChargeTable/ChargeTable'
import { ChargeToolbar, type ChargeFilter } from '@/features/financial/components/ChargeToolbar/ChargeToolbar'
import { CreateChargeModal } from '@/features/financial/components/CreateChargeModal/CreateChargeModal'
import {
  useCancelInvoice,
  useCreateInvoice,
  useExportInvoice,
  useFinancialSummary,
  useInvoices,
  useMarkInvoicePaid,
} from '@/features/financial/hooks/useFinancial'
import { usePatients } from '@/features/patients/hooks/usePatients'
import { useProfessionals } from '@/features/professionals/hooks/useProfessionals'

const PAGE_SIZE = 10

export default function FinancialPage() {
  const [status, setStatus] = useState<ChargeFilter>('ALL')
  const [search, setSearch] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  // Linked from a patient's page: show only that patient's charges.
  const patientFilter = searchParams.get('patientId') ?? undefined

  const patientsQuery = usePatients({ size: 100 })
  const professionalsQuery = useProfessionals({ size: 100 })
  const summaryQuery = useFinancialSummary()
  const invoicesQuery = useInvoices({
    status: status === 'ALL' ? undefined : status,
    patientId: patientFilter,
    page: pageIndex,
    size: PAGE_SIZE,
  })
  const createMutation = useCreateInvoice()
  const markPaid = useMarkInvoicePaid()
  const cancel = useCancelInvoice()
  const exportPdf = useExportInvoice()

  const totalPages = invoicesQuery.data?.totalPages ?? 1
  const totalCount = invoicesQuery.data?.totalElements ?? 0

  // The API has no text search for invoices, so filter the loaded page by patient name or note.
  const charges = useMemo(() => {
    const q = search.trim().toLowerCase()
    const rows = invoicesQuery.data?.content ?? []
    if (!q) return rows
    return rows.filter((c) => `${c.patientName ?? ''} ${c.notes ?? ''}`.toLowerCase().includes(q))
  }, [invoicesQuery.data, search])

  const patientOptions = useMemo(
    () => patientsQuery.data?.content.map((p) => ({ id: p.id, name: p.fullName })) ?? [],
    [patientsQuery.data],
  )
  const professionalOptions = useMemo(
    () => professionalsQuery.data?.content.map((p) => ({ id: p.id, name: p.fullName })) ?? [],
    [professionalsQuery.data],
  )
  const sessionValue = (id: string) => professionalsQuery.data?.content.find((p) => p.id === id)?.sessionValue

  const withBusy = (id: string, run: (done: () => void) => void) => {
    setBusyId(id)
    run(() => setBusyId(null))
  }

  const handleExport = (id: string) =>
    withBusy(id, (done) =>
      exportPdf.mutate(id, {
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
        onSettled: done,
      }),
    )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro"
        description="Acompanhe o que foi recebido e o que ainda está em aberto."
        actions={
          <Button size="md" icon={<Plus size={16} />} onClick={() => setIsModalOpen(true)} disabled={patientOptions.length === 0 || professionalOptions.length === 0}>
            Nova cobrança
          </Button>
        }
      />

      {summaryQuery.data ? (
        <BalanceSummary summary={summaryQuery.data} />
      ) : (
        <div className="surface grid grid-cols-1 sm:grid-cols-3">
          {summaryQuery.isError ? (
            <p className="px-6 py-8 text-[14px] text-text-3 sm:col-span-3">Não foi possível carregar o resumo financeiro.</p>
          ) : (
            [0, 1, 2].map((i) => (
              <div key={i} className="space-y-3 px-6 py-5">
                <div className="animate-shimmer h-3 w-24 rounded" />
                <div className="animate-shimmer h-8 w-32 rounded" />
              </div>
            ))
          )}
        </div>
      )}

      {patientFilter && (
        <div className="flex items-center gap-2 rounded-lg bg-brand/10 px-3.5 py-2.5 text-[13px] text-brand">
          <span className="flex-1">Mostrando as cobranças de um paciente específico.</span>
          <button
            type="button"
            onClick={() => { setSearchParams({}); setPageIndex(0) }}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold transition hover:bg-brand/10"
          >
            Ver todas <X size={13} />
          </button>
        </div>
      )}

      <ChargeToolbar
        status={status}
        search={search}
        onStatusChange={(value) => {
          setStatus(value)
          setPageIndex(0)
        }}
        onSearchChange={setSearch}
      />

      <section className="surface overflow-hidden" aria-label="Cobranças">
        {invoicesQuery.isLoading ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="animate-shimmer h-11 rounded-lg" style={{ opacity: 1 - i * 0.18 }} />
            ))}
          </div>
        ) : invoicesQuery.isError ? (
          <p className="px-6 py-14 text-center text-[14px] text-text-3">Não foi possível carregar as cobranças.</p>
        ) : (
          <ChargeTable
            charges={charges}
            busyId={busyId ?? undefined}
            onMarkPaid={(id) => withBusy(id, (done) => markPaid.mutate(id, { onSettled: done }))}
            onCancel={(id) => withBusy(id, (done) => cancel.mutate(id, { onSettled: done }))}
            onExport={handleExport}
          />
        )}

        <div className="flex flex-col gap-3 border-t border-border px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-text-3 tabular">
            {totalCount} {totalCount === 1 ? 'cobrança' : 'cobranças'} · página {pageIndex + 1} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled={pageIndex === 0} onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}>
              <ChevronLeft size={14} /> Anterior
            </Button>
            <Button variant="ghost" size="sm" disabled={pageIndex + 1 >= totalPages} onClick={() => setPageIndex((p) => p + 1)}>
              Próxima <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <CreateChargeModal
          patients={patientOptions}
          professionals={professionalOptions}
          suggestedAmount={sessionValue}
          submitting={createMutation.isPending}
          onCreate={(payload) => createMutation.mutate(payload, { onSuccess: () => setIsModalOpen(false) })}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
