import type { PatientStatus, Gender, MaritalStatus } from './status'

export interface PatientResponse {
  id: string
  fullName: string
  birthDate: string
  gender: Gender
  maritalStatus: MaritalStatus
  cpf: string
  phone: string
  email: string
  occupation?: string
  insurance?: string
  insuranceNumber?: string
  referredBy?: string
  status: PatientStatus
  notes?: string
  firstAppointment?: string
  lastAppointment?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePatientRequest {
  fullName: string
  birthDate: string
  gender: Gender
  maritalStatus: MaritalStatus
  cpf: string
  phone: string
  email: string
  occupation?: string
  insurance?: string
  insuranceNumber?: string
  referredBy?: string
  notes?: string
}

export type UpdatePatientRequest = Partial<CreatePatientRequest>

export interface PatientListItem {
  id: string
  fullName: string
  birthDate: string
  status: PatientStatus
  phone?: string
  email?: string
  professionalName: string
  lastSessionDate?: string
  createdAt: string
}
