import type { PatientStatus } from './status'

export interface PatientResponse {
  id: string
  fullName: string
  birthDate: string
  cpf: string
  gender?: string
  maritalStatus?: string
  occupation?: string
  phone: string
  email: string
  insurance?: string
  insuranceNumber?: string
  referredBy?: string
  status: PatientStatus
  firstAppointment?: string
  lastAppointment?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePatientRequest {
  fullName: string
  birthDate?: string
  cpf?: string
  gender?: string
  maritalStatus?: string
  occupation?: string
  phone?: string
  email?: string
  insurance?: string
  insuranceNumber?: string
  referredBy?: string
}

export type UpdatePatientRequest = Partial<CreatePatientRequest> & {
  status?: PatientStatus
}
