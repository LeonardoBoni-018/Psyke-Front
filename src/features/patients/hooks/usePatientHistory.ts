import { useQuery } from '@tanstack/react-query'
import { listPatientAppointments } from '@/features/patients/services/patientApi'
import { listInvoices } from '@/features/financial/services/financialApi'

export function usePatientAppointments(patientId: string) {
  return useQuery({
    queryKey: ['patients', patientId, 'appointments'],
    queryFn: () => listPatientAppointments(patientId),
    enabled: !!patientId,
    staleTime: 1000 * 60,
  })
}

export function usePatientInvoices(patientId: string) {
  return useQuery({
    queryKey: ['patients', patientId, 'invoices'],
    queryFn: () => listInvoices({ patientId, size: 50 }),
    enabled: !!patientId,
    staleTime: 1000 * 60,
  })
}
