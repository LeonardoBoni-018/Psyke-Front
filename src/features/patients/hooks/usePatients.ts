import { useQuery } from '@tanstack/react-query'
import { listPatients } from '@/features/patients/services/patientApi'

export const PATIENTS_LIST_KEY = ['patients', 'list'] as const

export function usePatients() {
  return useQuery({
    queryKey: PATIENTS_LIST_KEY,
    queryFn: () => listPatients({ status: 'ACTIVE', page: 0, size: 50 }),
    staleTime: 1000 * 60 * 5,
  })
}
