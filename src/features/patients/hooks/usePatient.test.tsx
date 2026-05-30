import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePatient } from './usePatient'
import { getPatientById } from '@/features/patients/services/patientApi'
import type { ReactNode } from 'react'

vi.mock('@/features/patients/services/patientApi', () => ({
  getPatientById: vi.fn(),
}))

const mockPatient = {
  id: 'patient-1',
  fullName: 'Maria Silva',
  birthDate: '1990-05-15',
  gender: 'FEMALE' as const,
  maritalStatus: 'MARRIED' as const,
  cpf: '123.456.789-00',
  phone: '(11) 99999-8888',
  email: 'maria@email.com',
  profession: 'Médica',
  address: {
    street: 'Rua A',
    number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01001-000',
  },
  insurance: 'Unimed',
  insuranceNumber: '123456',
  professionalId: 'prof-1',
  status: 'ACTIVE' as const,
  notes: 'Paciente em tratamento',
  createdAt: '2026-01-10T00:00:00Z',
  updatedAt: '2026-05-20T00:00:00Z',
}

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('usePatient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns patient data on success', async () => {
    vi.mocked(getPatientById).mockResolvedValue(mockPatient)

    const { result } = renderHook(() => usePatient('patient-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockPatient)
  })

  it('calls getPatientById with correct id', async () => {
    vi.mocked(getPatientById).mockResolvedValue(mockPatient)

    renderHook(() => usePatient('patient-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(getPatientById).toHaveBeenCalledWith('patient-1'))
  })

  it('does not fetch when id is empty', async () => {
    renderHook(() => usePatient(''), { wrapper: createWrapper() })

    expect(getPatientById).not.toHaveBeenCalled()
  })

  it('returns error on API failure', async () => {
    vi.mocked(getPatientById).mockRejectedValue(new Error('Not found'))

    const { result } = renderHook(() => usePatient('invalid-id'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
