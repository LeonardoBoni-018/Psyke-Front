import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useCreateInvoice, useFinancialSummary, useInvoices, useMarkInvoicePaid } from './useFinancial'
import {
  createInvoice,
  getFinancialSummary,
  listInvoices,
  markInvoicePaid,
} from '@/features/financial/services/financialApi'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

vi.mock('@/features/financial/services/financialApi', () => ({
  getFinancialSummary: vi.fn(),
  listInvoices: vi.fn(),
  createInvoice: vi.fn(),
  markInvoicePaid: vi.fn(),
  cancelInvoice: vi.fn(),
  exportInvoicePdf: vi.fn(),
}))

const invoice = {
  id: 'inv-1',
  patientId: 'p1',
  professionalId: 'pr1',
  amount: 200,
  status: 'PENDING' as const,
  createdAt: '2026-06-01T10:00:00Z',
  updatedAt: '2026-06-01T10:00:00Z',
}

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useFinancial', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the financial summary', async () => {
    const summary = { monthlyRevenue: 3200, pendingAmount: 2720, pendingCount: 7, paidCount: 50 }
    vi.mocked(getFinancialSummary).mockResolvedValue(summary)

    const { result } = renderHook(() => useFinancialSummary(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(summary)
  })

  it('returns the invoice list', async () => {
    vi.mocked(listInvoices).mockResolvedValue({ content: [invoice], totalElements: 1, totalPages: 1, number: 0, size: 10 })

    const { result } = renderHook(() => useInvoices({ status: 'PENDING' }), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.content[0].id).toBe('inv-1')
    expect(listInvoices).toHaveBeenCalledWith({ status: 'PENDING' })
  })

  it('creates an invoice', async () => {
    vi.mocked(createInvoice).mockResolvedValue(invoice)

    const { result } = renderHook(() => useCreateInvoice(), { wrapper: createWrapper() })
    result.current.mutate({ patientId: 'p1', professionalId: 'pr1', amount: 200 })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(createInvoice).toHaveBeenCalledWith({ patientId: 'p1', professionalId: 'pr1', amount: 200 }, expect.anything())
  })

  it('marks an invoice as paid', async () => {
    vi.mocked(markInvoicePaid).mockResolvedValue({ ...invoice, status: 'PAID' })

    const { result } = renderHook(() => useMarkInvoicePaid(), { wrapper: createWrapper() })
    result.current.mutate('inv-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(markInvoicePaid).toHaveBeenCalledWith('inv-1')
  })
})
