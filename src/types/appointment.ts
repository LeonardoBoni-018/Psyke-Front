import type { AppointmentStatus } from './status'

export interface AppointmentResponse {
  id: string
  clinicId: string
  patientId: string
  professionalId: string
  roomId: string | null
  startTime: string
  endTime: string
  status: AppointmentStatus
  prontuario: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface AppointmentRequest {
  patientId: string
  professionalId: string
  roomId?: string
  startTime: string
  endTime: string
  notes?: string
}

export interface StatusUpdateRequest {
  status: AppointmentStatus
  reason?: string
}

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  borderColor: string
  textColor: string
  extendedProps: Record<string, unknown>
}

export interface CreateSessionRequest {
  appointmentId: string
  notes: string
}

export interface RecurrenceRequest {
  appointmentId: string
  pattern: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY'
  dayOfWeek: number
  endDate: string
}
