export type RecordStatus = 'OPEN' | 'CLOSED' | 'SUSPENDED'
export type DiagnosticStatus = 'HYPOTHESIS' | 'CONFIRMED' | 'RULED_OUT'

export interface MedicalRecord {
  id: string
  patientId: string
  professionalId: string
  therapeuticGoal: string
  approach: string
  status: RecordStatus
  startDate: string
  endDate?: string
  sessionCount: number
  lastSessionDate?: string
  generalNotes?: string
  createdAt: string
  updatedAt: string
}

export interface Evolution {
  id: string
  medicalRecordId: string
  professionalId: string
  sessionDate: string
  content: string
  interventions: string
  clinicalEvolution: string
  homework?: string
  tags?: string[]
  signed: boolean
  signatureHash?: string
  createdAt: string
}

export interface EvolutionRequest {
  medicalRecordId: string
  sessionDate: string
  content: string
  interventions: string
  clinicalEvolution: string
  homework?: string
  tags?: string[]
}

export interface SignEvolutionRequest {
  evolutionId: string
  password: string
}

export interface Anamnesis {
  id: string
  medicalRecordId: string
  chiefComplaint: string
  currentIllnessHistory: string
  familyHistory: string
  personalHistory: string
  currentMedications: string
  sleepPattern: string
  substanceUse: string
  suicideAttempts: string
  relevantTraumas: string
  socialSupport: string
  developmentalHistory?: string
  updatedAt: string
}

export interface AnamnesisRequest {
  medicalRecordId: string
  chiefComplaint: string
  currentIllnessHistory: string
  familyHistory: string
  personalHistory: string
  currentMedications: string
  sleepPattern: string
  substanceUse: string
  suicideAttempts: string
  relevantTraumas: string
  socialSupport: string
  developmentalHistory?: string
}

export interface DiagnosticHypothesis {
  id: string
  medicalRecordId: string
  cid10Code: string
  description: string
  dsm5Code?: string
  status: DiagnosticStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface DiagnosticRequest {
  medicalRecordId: string
  cid10Code: string
  description: string
  dsm5Code?: string
  status: DiagnosticStatus
  notes?: string
}

export interface PatientDocument {
  id: string
  medicalRecordId: string
  fileName: string
  fileType: string
  fileSize: number
  uploadedAt: string
  uploadedBy: string
}

export interface Cid10Result {
  code: string
  description: string
  category: string
}
