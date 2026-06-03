import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useDashboardSummary, useTodaySessions } from './useDashboard'
import { getDashboardSummary, getTodaySessions } from '@/features/dashboard/services/dashboardApi'
import type { ReactNode } from 'react'
import type { AppointmentResponse } from '@/types/appointment'

vi.mock('@/features/dashboard/services/dashboardApi', () => ({
  getDashboardSummary: vi.fn(),
  getTodaySessions: vi.fn(),
}))

const mockSummary = {
  sessionsToday: 8,
  pendingConfirmation: 3,
  activePatients: 42,
  totalProfessionals: 5,
}

const mockSessions: AppointmentResponse[] = [
  { id: '1', clinicId: 'c1', patientId: 'p1', professionalId: 'pr1', roomId: null, startTime: '2026-06-02T08:00:00Z', endTime: '2026-06-02T09:00:00Z', status: 'CONFIRMED', prontuario: null, notes: 'Sessão TCC', createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z' },
  { id: '2', clinicId: 'c1', patientId: 'p2', professionalId: 'pr1', roomId: null, startTime: '2026-06-02T09:00:00Z', endTime: '2026-06-02T10:00:00Z', status: 'DONE', prontuario: null, notes: 'Sessão Psicanálise', createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z' },
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
    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 })
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
