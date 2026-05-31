import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useDashboardSummary, useTodaySessions } from './useDashboard'
import { getDashboardSummary, getTodaySessions } from '@/features/dashboard/services/dashboardApi'
import type { ReactNode } from 'react'

vi.mock('@/features/dashboard/services/dashboardApi', () => ({
  getDashboardSummary: vi.fn(),
  getTodaySessions: vi.fn(),
}))

const mockSummary = {
  totalPatients: 47,
  activePatients: 42,
  sessionsToday: 8,
  pendingConfirmations: 3,
  totalAppointmentsMonth: 120,
  revenueMonth: 12400,
}

const mockSessions = [
  { id: '1', patientName: 'João Silva', professionalName: 'Dra. Ana', startTime: '08:00', endTime: '09:00', status: 'CONFIRMED', approach: 'TCC' },
  { id: '2', patientName: 'Maria Costa', professionalName: 'Dra. Ana', startTime: '09:00', endTime: '10:00', status: 'DONE', approach: 'Psicanálise' },
]

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useDashboardSummary', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns summary data on success', async () => {
    vi.mocked(getDashboardSummary).mockResolvedValue(mockSummary)
    const { result } = renderHook(() => useDashboardSummary(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockSummary)
  })

  it('returns error on failure', async () => {
    vi.mocked(getDashboardSummary).mockRejectedValue(new Error('API error'))
    const { result } = renderHook(() => useDashboardSummary(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useTodaySessions', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns sessions on success', async () => {
    vi.mocked(getTodaySessions).mockResolvedValue(mockSessions)
    const { result } = renderHook(() => useTodaySessions(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
  })

  it('returns empty array when no sessions', async () => {
    vi.mocked(getTodaySessions).mockResolvedValue([])
    const { result } = renderHook(() => useTodaySessions(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })
})
