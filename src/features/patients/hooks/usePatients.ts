import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listPatients } from '@/features/patients/services/patientApi'

export const PATIENTS_LIST_KEY = ['patients', 'list'] as const

export interface PatientsParams {
  page?: number
  size?: number
  sort?: string
  q?: string
  status?: string
}

export function usePatients(params?: PatientsParams) {
  return useQuery({
    queryKey: [...PATIENTS_LIST_KEY, params],
    queryFn: () => listPatients(params),
    staleTime: 1000 * 60 * 2,
    // Keep the old rows on screen while a new search/page loads (no flash of the skeleton).
    placeholderData: keepPreviousData,
  })
}
