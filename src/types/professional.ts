export type ProfessionalStatus = 'ACTIVE' | 'INACTIVE'
export type AppointmentDuration = 30 | 45 | 50 | 60

export interface ProfessionalResponse {
  id: string
  fullName: string
  email: string
  phone: string
  crp: string
  specialization: string
  approach: string
  sessionValue: number
  sessionDuration: AppointmentDuration
  acceptsInsurance: boolean
  status: ProfessionalStatus
  createdAt: string
  updatedAt: string
}

export interface CreateProfessionalRequest {
  fullName: string
  email: string
  phone: string
  crp: string
  specialization?: string
  approach?: string
  sessionValue?: number
  sessionDuration?: AppointmentDuration
  acceptsInsurance?: boolean
}

export type UpdateProfessionalRequest = Partial<CreateProfessionalRequest>

export interface Slot {
  id: string
  professionalId: string
  startTime: string
  endTime: string
  available: boolean
}

export interface AvailabilitySlot {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface ProfessionalAvailabilityResponse {
  id: string
  professionalId: string
  availability: AvailabilitySlot[]
}

export interface CreateAvailabilityRequest {
  professionalId: string
  availability: AvailabilitySlot[]
}

export interface AvailabilityException {
  id: string
  professionalId: string
  date: string
  startTime?: string
  endTime?: string
  reason: string
}

export interface CreateExceptionRequest {
  professionalId: string
  date: string
  startTime?: string
  endTime?: string
  reason: string
}
