import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table'
import { Search, Plus, ChevronLeft, ChevronRight, Users, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { usePatients } from '@/features/patients/hooks/usePatients'
import type { PatientResponse } from '@/types/patient'

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVE', label: 'Ativo' },
  { value: 'INACTIVE', label: 'Inativo' },
]

const columnHelper = createColumnHelper<PatientResponse>()

export default function PatientsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)

  const { data, isLoading, isError } = usePatients({ page, size: 10 })

  const filteredData = useMemo(() => {
    if (!data?.content) return []
    let items = data.content
    if (statusFilter) {
      items = items.filter((p) => p.status === statusFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      items = items.filter((p) => p.fullName.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q))
    }
    return items
  }, [data, statusFilter, search])

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
              {date ? format(new Date(date), 'dd/MM/yyyy') : '—'}
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
              {date ? format(new Date(date), 'dd/MM/yyyy') : '—'}
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-serif text-text-1">Pacientes</h1>
        <Button size="sm" icon={<Plus size={15} />} onClick={() => navigate('/patients/new')}>
          Novo paciente
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-2 px-3 py-2 transition focus-within:border-teal focus-within:shadow-[0_0_0_3px_var(--teal-10)]">
          <Search size={16} className="text-text-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            placeholder="Buscar por nome ou email..."
            className="w-64 bg-transparent text-sm text-text-1 outline-none placeholder:text-text-3"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }}
          className="rounded-lg border border-border bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-teal focus:shadow-[0_0_0_3px_var(--teal-10)]"
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
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-bg-1">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-text-3"
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
          Mostrando {filteredData.length} de {data?.totalElements ?? 0}
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