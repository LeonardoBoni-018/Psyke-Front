import { api } from '@/lib/axios'
import type { PaginatedResponse } from '@/types/api'
import type {
  AppointmentResponse,
  AppointmentRequest,
  StatusUpdateRequest,
  CalendarEvent,
  CreateSessionRequest,
  RecurrenceRequest,
} from '@/types/appointment'

interface AppointmentListParams {
  patientId?: string
  professionalId?: string
  status?: string
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}

export async function createAppointment(data: AppointmentRequest): Promise<AppointmentResponse> {
  const response = await api.post<AppointmentResponse>('/appointments', data)
  return response.data
}

export async function listAppointments(params?: AppointmentListParams): Promise<PaginatedResponse<AppointmentResponse>> {
  const response = await api.get<PaginatedResponse<AppointmentResponse>>('/appointments', { params })
  return response.data
}

export async function getCalendarEvents(params: {
  startDate: string
  endDate: string
  professionalId?: string
  roomId?: string
}): Promise<CalendarEvent[]> {
  const response = await api.get<CalendarEvent[]>('/appointments/calendar', { params })
  return response.data
}

export async function findAppointmentById(id: string): Promise<AppointmentResponse> {
  const response = await api.get<AppointmentResponse>(`/appointments/${id}`)
  return response.data
}

export async function updateAppointmentStatus(id: string, data: StatusUpdateRequest): Promise<AppointmentResponse> {
  const response = await api.patch<AppointmentResponse>(`/appointments/${id}/status`, data)
  return response.data
}

export async function deleteAppointment(id: string): Promise<void> {
  await api.delete(`/appointments/${id}`)
}

export async function createSession(data: CreateSessionRequest): Promise<void> {
  await api.post(`/appointments/${data.appointmentId}/session`, data)
}

export async function addRecurrence(data: RecurrenceRequest): Promise<void> {
  await api.post('/appointments/recurrence', data)
}
