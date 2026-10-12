import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createPatient } from '@/features/patients/services/patientApi'
import { PATIENTS_LIST_KEY } from '@/features/patients/hooks/usePatients'
import type { CreatePatientRequest, PatientResponse } from '@/types/patient'

export function useCreatePatient() {
  const queryClient = useQueryClient()
  return useMutation<PatientResponse, Error, CreatePatientRequest>({
    mutationFn: (data) => createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_LIST_KEY })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Paciente cadastrado')
    },
  })
}