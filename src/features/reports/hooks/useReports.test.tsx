import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useReportSummary } from './useReports'
import { getReportSummary } from '@/features/reports/services/reportsApi'
import type { ReportSummary } from '@/types/reports'

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }))

vi.mock('@/features/reports/services/reportsApi', () => ({
  getReportSummary: vi.fn(),
  exportReportCsv: vi.fn(),
}))

const summary: ReportSummary = {
  from: '2026-05-01',
  to: '2026-05-30',
  revenue: 10000,
  pendingAmount: 1000,
  invoicesByStatus: { PAID: 40, PENDING: 5 },
  totalAppointments: 120,
  appointmentsByStatus: { DONE: 90, CANCELLED: 20, NO_SHOW: 10 },
  attendanceRate: 90,
  cancellationRate: 16.7,
  newPatients: 12,
  activePatients: 80,
  revenueByMonth: [{ month: '2026-05', amount: 10000 }],
  sessionsByProfessional: [{ professionalId: 'pr1', name: 'Dra. Ana', sessions: 60 }],
}

const params = { from: '2026-05-01', to: '2026-05-30' }

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useReportSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the report summary for the period', async () => {
    vi.mocked(getReportSummary).mockResolvedValue(summary)

    const { result } = renderHook(() => useReportSummary(params), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.revenue).toBe(10000)
    expect(getReportSummary).toHaveBeenCalledWith(params)
  })

  it('surfaces errors', async () => {
    vi.mocked(getReportSummary).mockRejectedValue(new Error('boom'))

    const { result } = renderHook(() => useReportSummary(params), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
