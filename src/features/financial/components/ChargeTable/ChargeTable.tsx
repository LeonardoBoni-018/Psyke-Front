import { useMemo } from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import type { Charge } from '@/types/financial'

interface ChargeTableProps {
  charges: Charge[]
  onMarkPaid: (id: string) => void
  onExport: (id: string) => void
  busyId?: string
}

const columnHelper = createColumnHelper<Charge>()

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function ChargeTable({ charges, onMarkPaid, onExport, busyId }: ChargeTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor('description', {
        header: 'Descrição',
        cell: (info) => <div className="font-medium text-text-1">{info.getValue()}</div>,
      }),
      columnHelper.accessor('amount', {
        header: 'Valor',
        cell: (info) => <span>{formatCurrency(info.getValue())}</span>,
      }),
      columnHelper.accessor('dueDate', {
        header: 'Vencimento',
        cell: (info) => <span>{new Date(info.getValue()).toLocaleDateString('pt-BR')}</span>,
      }),
      columnHelper.accessor('paid', {
        header: 'Status',
        cell: (info) => (
          <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-mono ${
            info.getValue() ? 'bg-teal-10 text-teal' : 'bg-amber bg-opacity-10 text-amber'
          }`}>
            {info.getValue() ? 'Pago' : 'Aberto'}
          </span>
        ),
      }),
      columnHelper.accessor((row) => row.id, {
        id: 'actions',
        header: 'Ações',
        cell: (info) => {
          const id = info.getValue()
          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-border bg-bg-2 px-3 py-1 text-[12px] text-text-2 transition hover:border-border-hi hover:text-text-1"
                onClick={(event) => {
                  event.stopPropagation()
                  onExport(id)
                }}
              >
                Exportar
              </button>
              {!info.row.original.paid ? (
                <button
                  type="button"
                  className="rounded-lg bg-teal px-3 py-1 text-[12px] text-bg-0 transition hover:bg-teal-dim"
                  onClick={(event) => {
                    event.stopPropagation()
                    onMarkPaid(id)
                  }}
                >
                  {busyId === id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Pagar'}
                </button>
              ) : null}
            </div>
          )
        },
      }),
    ],
    [onExport, onMarkPaid, busyId],
  )

  const table = useReactTable({
    data: charges,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-bg-1">
      <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
        <thead className="bg-bg-1">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-b border-border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-3"
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border transition hover:bg-teal-10 hover:cursor-pointer"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-4 align-top text-text-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {charges.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-text-3" colSpan={5}>
                Nenhuma cobrança encontrada.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
