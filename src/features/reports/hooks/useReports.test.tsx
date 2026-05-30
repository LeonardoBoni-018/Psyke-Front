import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFinancialReport, useClinicalReport } from './useReports'
import { getFinancialReportSummary, getClinicalReportSummary } from '@/features/reports/services/reportsApi'
import type { ReactNode } from 'react'

vi.mock('@/features/reports/services/reportsApi', () => ({
  getFinancialReportSummary: vi.fn(),
  getClinicalReportSummary: vi.fn(),
}))

const mockFinancialReport = {
  totalRevenue: 10000,
  totalReceivables: 4000,
  totalPaid: 6000,
  overdueAmount: 1000,
  openInvoices: 15,
  revenueSeries: [{ month: '2026-05', amount: 10000 }],
}

const mockClinicalReport = {
  adherenceRate: 0.85,
  activeRecords: 120,
  newPatients: 30,
  topDiagnoses: [{ name: 'Transtorno de Ansiedade', count: 45 }],
}

const defaultParams = { from: '2026-05-01', to: '2026-05-30' }

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useReports', () => {
  describe('useFinancialReport', () => {
    it('returns financial report on success', async () => {
      vi.mocked(getFinancialReportSummary).mockResolvedValue(mockFinancialReport)

      const { result } = renderHook(() => useFinancialReport(defaultParams), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockFinancialReport)
    })

    it('calls API with correct params', async () => {
      vi.mocked(getFinancialReportSummary).mockResolvedValue(mockFinancialReport)

      renderHook(() => useFinancialReport(defaultParams), { wrapper: createWrapper() })

      await waitFor(() => expect(getFinancialReportSummary).toHaveBeenCalledWith(defaultParams))
    })

    it('returns error on failure', async () => {
      vi.mocked(getFinancialReportSummary).mockRejectedValue(new Error('API error'))

      const { result } = renderHook(() => useFinancialReport(defaultParams), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isError).toBe(true))
    })
  })

  describe('useClinicalReport', () => {
    it('returns clinical report on success', async () => {
      vi.mocked(getClinicalReportSummary).mockResolvedValue(mockClinicalReport)

      const { result } = renderHook(() => useClinicalReport(defaultParams), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockClinicalReport)
    })

    it('calls API with correct params', async () => {
      vi.mocked(getClinicalReportSummary).mockResolvedValue(mockClinicalReport)

      renderHook(() => useClinicalReport(defaultParams), { wrapper: createWrapper() })

      await waitFor(() => expect(getClinicalReportSummary).toHaveBeenCalledWith(defaultParams))
    })

    it('passes optional professionalId', async () => {
      const params = { ...defaultParams, professionalId: 'prof-1' }
      vi.mocked(getClinicalReportSummary).mockResolvedValue(mockClinicalReport)

      renderHook(() => useClinicalReport(params), { wrapper: createWrapper() })

      await waitFor(() => expect(getClinicalReportSummary).toHaveBeenCalledWith(params))
    })
  })
})
