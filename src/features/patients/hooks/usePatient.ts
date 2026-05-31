import { useQuery } from '@tanstack/react-query'
import { getPatientById } from '@/features/patients/services/patientApi'
import type { PatientResponse } from '@/types/patient'

export function usePatient(id: string) {
  return useQuery<PatientResponse>({
    queryKey: ['patients', id],
    queryFn: () => getPatientById(id),
    enabled: !!id,
  })
}
