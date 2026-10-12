import { useState, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { formatDate } from '@/lib/date'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table'
import { Search, Plus, ChevronLeft, ChevronRight, Users, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/layout/PageHeader/PageHeader'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { usePatients } from '@/features/patients/hooks/usePatients'
import { useDebounce } from '@/hooks/useDebounce'
import type { PatientResponse } from '@/types/patient'

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVE', label: 'Ativo' },
  { value: 'INACTIVE', label: 'Inativo' },
]

const columnHelper = createColumnHelper<PatientResponse>()

export default function PatientsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // The topbar search sends people here with ?q=...; the field stays editable afterwards.
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)
  const debouncedSearch = useDebounce(search.trim(), 300)

  // Search and status run on the server so they cover every page, not just the 10 rows on screen.
  const { data, isLoading, isError, isFetching } = usePatients({
    page,
    size: 10,
    q: debouncedSearch || undefined,
    status: statusFilter || undefined,
  })

  const filteredData = useMemo(() => data?.content ?? [], [data])

  const columns = useMemo(
    () => [
      columnHelper.accessor('fullName', {
        header: 'Nome',
        cell: (info) => (
          <span className="font-medium text-text-1">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor('phone', {
        header: 'Telefone',
        cell: (info) => <span className="text-text-2 text-sm">{info.getValue() || '—'}</span>,
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => <span className="text-text-2 text-sm">{info.getValue() || '—'}</span>,
      }),
      columnHelper.accessor('birthDate', {
        header: 'Nascimento',
        cell: (info) => {
          const date = info.getValue()
          return (
            <span className="text-text-2 text-sm">
              {formatDate(date)}
            </span>
          )
        },
      }),
      columnHelper.accessor('lastAppointment', {
        header: 'Última sessão',
        cell: (info) => {
          const date = info.getValue()
          return (
            <span className="text-text-2 text-sm">
              {formatDate(date)}
            </span>
          )
        },
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: data?.totalPages ?? 0,
  })

  const handleRowClick = useCallback(
    (patientId: string) => navigate(`/patients/${patientId}`),
    [navigate],
  )

  if (isLoading) {
    return (
      <div className="page-enter space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 animate-shimmer rounded-lg" />
          <div className="h-10 w-36 animate-shimmer rounded-xl" />
        </div>
        <div className="h-12 animate-shimmer rounded-lg" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-shimmer rounded-lg" style={{ opacity: 1 - i * 0.12 }} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="page-enter flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10">
          <RefreshCw size={24} className="text-danger" />
        </div>
        <div>
          <p className="text-sm text-text-3">Erro ao carregar pacientes</p>
          <p className="mt-1 text-[12px] text-text-3">Não foi possível conectar ao servidor</p>
        </div>
        <Button variant="ghost" size="sm" icon={<RefreshCw size={13} />} onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pacientes"
        description="Busque por nome, e-mail, CPF ou telefone."
        actions={
          <Button size="md" icon={<Plus size={15} />} onClick={() => navigate('/patients/new', { viewTransition: true })}>
            Novo paciente
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 items-center gap-2 rounded-lg border border-border bg-bg-1 px-3 shadow-sm transition focus-within:border-brand focus-within:shadow-focus">
          <Search size={16} className="text-text-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            aria-label="Buscar paciente"
            placeholder="Buscar por nome, e-mail, CPF ou telefone..."
            className="w-56 bg-transparent sm:w-72 text-sm text-text-1 outline-none placeholder:text-text-3"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }}
          aria-label="Filtrar por status"
          className="h-10 rounded-lg border border-border bg-bg-1 px-3 text-sm text-text-1 shadow-sm outline-none transition focus:border-brand focus:shadow-focus"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-border bg-bg-1 py-20 gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-2">
            <Users size={24} className="text-text-3" />
          </div>
          <div className="text-center">
            <p className="text-sm text-text-3">Nenhum paciente encontrado</p>
            <p className="mt-1 text-[12px] text-text-3">Tente ajustar os filtros ou cadastre um novo paciente</p>
          </div>
          <Button size="sm" icon={<Plus size={14} />} onClick={() => navigate('/patients/new')}>
            Novo paciente
          </Button>
        </div>
      ) : (
        <div className={`table-scroll rounded-[var(--radius-xl)] border border-border bg-bg-1 transition-opacity ${isFetching ? 'opacity-70' : ''}`}>
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-[13px] font-medium text-text-3"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.original.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleRowClick(row.original.id)
                    }
                  }}
                  tabIndex={0}
                  aria-label={`Abrir ${row.original.fullName}`}
                  className="item-enter cursor-pointer border-b border-border/50 transition hover:bg-bg-2/50 last:border-0"
                  style={{ animationDelay: `${row.index * 35}ms` }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className="text-[12px] text-text-3 font-mono">
          {filteredData.length} de {data?.totalElements ?? 0}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft size={14} /> Anterior
          </Button>
          <span className="text-[12px] text-text-3 font-mono min-w-[48px] text-center">
            {page + 1} de {data?.totalPages ?? 1}
          </span>
          <Button variant="ghost" size="sm" disabled={(data?.totalPages ?? 1) <= page + 1} onClick={() => setPage((p) => p + 1)}>
            Próximo <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  )
}