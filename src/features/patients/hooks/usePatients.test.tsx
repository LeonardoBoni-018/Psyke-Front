import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePatients } from './usePatients'
import { listPatients } from '@/features/patients/services/patientApi'
import type { ReactNode } from 'react'

vi.mock('@/features/patients/services/patientApi', () => ({
  listPatients: vi.fn(),
}))

const mockPatient = {
  id: 'patient-1',
  fullName: 'Maria Silva',
  birthDate: '1990-05-15',
  status: 'ACTIVE' as const,
  cpf: '123.456.789-00',
  phone: '(11) 99999-8888',
  email: 'maria@email.com',
  createdAt: '2026-01-10T00:00:00Z',
  updatedAt: '2026-01-10T00:00:00Z',
}

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('usePatients', () => {
  it('returns patient list on success', async () => {
    const response = { content: [mockPatient, { ...mockPatient, id: 'patient-2' }], totalElements: 2, totalPages: 1, number: 0, size: 50 }
    vi.mocked(listPatients).mockResolvedValue(response)

    const { result } = renderHook(() => usePatients(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.content).toHaveLength(2)
    expect(result.current.data?.content[0].id).toBe('patient-1')
  })

  it('calls listPatients without default params when none provided', async () => {
    vi.mocked(listPatients).mockResolvedValue({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 50 })

    renderHook(() => usePatients(), { wrapper: createWrapper() })

    await waitFor(() => expect(listPatients).toHaveBeenCalled())
    expect(listPatients).toHaveBeenCalledWith(undefined)
  })

  it('returns empty list when no patients', async () => {
    const response = { content: [], totalElements: 0, totalPages: 0, number: 0, size: 50 }
    vi.mocked(listPatients).mockResolvedValue(response)

    const { result } = renderHook(() => usePatients(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.content).toEqual([])
  })

  it('returns error on API failure', async () => {
    vi.mocked(listPatients).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => usePatients(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
