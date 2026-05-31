import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAppointment,
  getCalendarEvents,
  findAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  createSession,
  addRecurrence,
} from '@/features/agenda/services/appointmentApi'
import type { AppointmentRequest, StatusUpdateRequest, CreateSessionRequest, RecurrenceRequest } from '@/types/appointment'
import type { CalendarEvent } from '@/types/appointment'

export const APPOINTMENTS_KEY = ['appointments'] as const
export const CALENDAR_KEY = ['calendar'] as const

export function useCalendarEvents(params: { startDate: string; endDate: string; professionalId?: string }) {
  return useQuery<CalendarEvent[]>({
    queryKey: [...CALENDAR_KEY, params],
    queryFn: () => getCalendarEvents(params),
    staleTime: 1000 * 60,
  })
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: [...APPOINTMENTS_KEY, id],
    queryFn: () => findAppointmentById(id),
    enabled: !!id,
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AppointmentRequest) => createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY })
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEY })
    },
  })
}

export function useUpdateStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StatusUpdateRequest }) => updateAppointmentStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY })
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEY })
    },
  })
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY })
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEY })
    },
  })
}

export function useCreateSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSessionRequest) => createSession(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY }),
  })
}

export function useAddRecurrence() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RecurrenceRequest) => addRecurrence(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY }),
  })
}
