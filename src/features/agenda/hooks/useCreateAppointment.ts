import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAppointment } from '@/features/agenda/services/appointmentApi'
import { APPOINTMENTS_KEY, CALENDAR_KEY } from '@/features/agenda/hooks/useAppointments'
import type { AppointmentRequest, AppointmentResponse } from '@/types/appointment'

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  return useMutation<AppointmentResponse, Error, AppointmentRequest>({
    mutationFn: (data) => createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY })
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEY })
    },
  })
}