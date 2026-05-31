import type { RecordStatus } from './status'

export interface ProntuarioResponse {
  id: string
  patientId: string
  professionalId: string
  allergies: string
  chronicConditions: string
  medications: string
  notes: string
  status: RecordStatus
  createdAt: string
  updatedAt: string
}

export interface CreateProntuarioRequest {
  patientId: string
  professionalId: string
  allergies?: string
  chronicConditions?: string
  medications?: string
  notes?: string
}

export interface UpdateProntuarioRequest {
  allergies?: string
  chronicConditions?: string
  medications?: string
  notes?: string
}

export interface EvolucaoClinicaResponse {
  id: string
  prontuarioId: string
  professionalId: string
  sessionDate: string
  subjective: string
  objective: string
  assessment: string
  plan: string
  techniques: string[]
  signed: boolean
  createdAt: string
}

export interface CreateEvolucaoRequest {
  prontuarioId: string
  sessionDate: string
  subjective: string
  objective: string
  assessment: string
  plan: string
  techniques?: string[]
}

export interface AnamneseResponse {
  id: string
  prontuarioId: string
  chiefComplaint: string
  history: string
  familyHistory: string
  personalHistory: string
  medications: string
  sleepPattern: string
  substanceUse: string
  suicideRisk: string
  traumaHistory: string
  socialSupport: string
  developmentalHistory?: string
  updatedAt: string
}

export interface CreateAnamneseRequest {
  prontuarioId: string
  chiefComplaint: string
  history: string
  familyHistory: string
  personalHistory: string
  medications: string
  sleepPattern: string
  substanceUse: string
  suicideRisk: string
  traumaHistory: string
  socialSupport: string
  developmentalHistory?: string
}

export type UpdateAnamneseRequest = Partial<CreateAnamneseRequest>
