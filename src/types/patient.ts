export type PatientStatus = 'ACTIVE' | 'INACTIVE' | 'WAITING' | 'DISCHARGED'
export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER' | 'PREFER_NOT_TO_SAY'
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'OTHER'

export interface PatientAddress {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export interface Patient {
  id: string
  fullName: string
  birthDate: string
  gender: Gender
  maritalStatus: MaritalStatus
  cpf: string
  phone: string
  email: string
  profession?: string
  address: PatientAddress
  insurance?: string
  insuranceNumber?: string
  professionalId: string
  status: PatientStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface PatientRequest {
  fullName: string
  birthDate: string
  gender: Gender
  maritalStatus: MaritalStatus
  cpf: string
  phone: string
  email: string
  profession?: string
  address: PatientAddress
  insurance?: string
  insuranceNumber?: string
  professionalId: string
  notes?: string
}

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
