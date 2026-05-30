import { useQuery } from '@tanstack/react-query'
import { getPatientById } from '@/features/patients/services/patientApi'

export const PATIENT_KEY = ['patients', 'detail'] as const

export function usePatient(id: string) {
  return useQuery({
    queryKey: [...PATIENT_KEY, id],
    queryFn: () => getPatientById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}
