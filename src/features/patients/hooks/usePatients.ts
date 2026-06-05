import { useQuery } from '@tanstack/react-query'
import { listPatients } from '@/features/patients/services/patientApi'

export const PATIENTS_LIST_KEY = ['patients', 'list'] as const

export function usePatients(params?: { page?: number; size?: number; sort?: string }) {
  return useQuery({
    queryKey: [...PATIENTS_LIST_KEY, params],
    queryFn: () => listPatients(params),
    staleTime: 1000 * 60 * 2,
  })
}
