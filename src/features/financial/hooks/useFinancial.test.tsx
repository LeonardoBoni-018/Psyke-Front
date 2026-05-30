import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFinancialSummary, useCharges, useCreateCharge, useMarkChargePaid, useExportCharge } from './useFinancial'
import { getFinancialSummary, listCharges, createCharge, markChargePaid, exportCharge } from '@/features/financial/services/financialApi'
import type { ReactNode } from 'react'

vi.mock('@/features/financial/services/financialApi', () => ({
  getFinancialSummary: vi.fn(),
  listCharges: vi.fn(),
  createCharge: vi.fn(),
  markChargePaid: vi.fn(),
  exportCharge: vi.fn(),
}))

const mockCharge = {
  id: 'charge-1',
  patientId: 'patient-1',
  description: 'Consulta',
  amount: 200,
  dueDate: '2026-06-15',
  paid: false,
}

const mockSummary = {
  totalRevenue: 5000,
  totalReceivables: 2000,
  totalPaid: 3000,
  overdueAmount: 500,
  openInvoices: 10,
  revenueSeries: [{ month: '2026-05', amount: 5000 }],
}

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useFinancial', () => {
  describe('useFinancialSummary', () => {
    it('returns summary data on success', async () => {
      vi.mocked(getFinancialSummary).mockResolvedValue(mockSummary)

      const { result } = renderHook(() => useFinancialSummary(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockSummary)
    })

    it('returns error on failure', async () => {
      vi.mocked(getFinancialSummary).mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useFinancialSummary(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isError).toBe(true))
    })
  })

  describe('useCharges', () => {
    it('returns charges list on success', async () => {
      const response = { content: [mockCharge], totalElements: 1, totalPages: 1, number: 0, size: 10 }
      vi.mocked(listCharges).mockResolvedValue(response)

      const { result } = renderHook(() => useCharges({ status: 'open' }), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(response)
    })

    it('calls with correct params', async () => {
      vi.mocked(listCharges).mockResolvedValue({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 })

      renderHook(() => useCharges({ status: 'paid', page: 0, size: 5 }), { wrapper: createWrapper() })

      await waitFor(() => expect(listCharges).toHaveBeenCalledWith({ status: 'paid', page: 0, size: 5 }))
    })
  })

  describe('useCreateCharge', () => {
    it('calls createCharge on mutate', async () => {
      vi.mocked(createCharge).mockResolvedValue(mockCharge)

      const { result } = renderHook(() => useCreateCharge(), { wrapper: createWrapper() })

      result.current.mutate({ patientId: 'p1', description: 'Test', amount: 100, dueDate: '2026-07-01' })

      await waitFor(() => expect(createCharge).toHaveBeenCalled())
    })
  })

  describe('useMarkChargePaid', () => {
    it('calls markChargePaid on mutate', async () => {
      vi.mocked(markChargePaid).mockResolvedValue({ ...mockCharge, paid: true })

      const { result } = renderHook(() => useMarkChargePaid(), { wrapper: createWrapper() })

      result.current.mutate('charge-1')

      await waitFor(() => expect(markChargePaid).toHaveBeenCalled())
    })
  })

  describe('useExportCharge', () => {
    it('calls exportCharge on mutate', async () => {
      const blob = new Blob()
      vi.mocked(exportCharge).mockResolvedValue(blob)

      const { result } = renderHook(() => useExportCharge(), { wrapper: createWrapper() })

      result.current.mutate('charge-1')

      await waitFor(() => expect(exportCharge).toHaveBeenCalled())
    })
  })
})
