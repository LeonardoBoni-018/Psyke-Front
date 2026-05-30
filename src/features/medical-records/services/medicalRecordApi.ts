import { api } from '@/lib/axios'
import type { PaginatedResponse } from '@/types/api'
import type {
  MedicalRecord,
  Evolution,
  EvolutionRequest,
  SignEvolutionRequest,
  Anamnesis,
  AnamnesisRequest,
  DiagnosticHypothesis,
  DiagnosticRequest,
  PatientDocument,
  Cid10Result,
} from '@/types/medical-record'

export async function getMedicalRecordsByPatient(patientId: string): Promise<MedicalRecord[]> {
  const response = await api.get<MedicalRecord[]>('/medical-records', {
    params: { patientId },
  })
  return response.data
}

export async function getMedicalRecordById(id: string): Promise<MedicalRecord> {
  const response = await api.get<MedicalRecord>(`/medical-records/${id}`)
  return response.data
}

export async function createMedicalRecord(data: {
  patientId: string
  professionalId: string
  therapeuticGoal: string
  approach: string
}): Promise<MedicalRecord> {
  const response = await api.post<MedicalRecord>('/medical-records', data)
  return response.data
}

export async function closeRecord(id: string): Promise<MedicalRecord> {
  const response = await api.patch<MedicalRecord>(`/medical-records/${id}/close`)
  return response.data
}

export async function getEvolutions(
  medicalRecordId: string,
  params?: { page?: number; size?: number },
): Promise<PaginatedResponse<Evolution>> {
  const response = await api.get<PaginatedResponse<Evolution>>(
    `/medical-records/${medicalRecordId}/evolutions`,
    { params },
  )
  return response.data
}

export async function createEvolution(data: EvolutionRequest): Promise<Evolution> {
  const response = await api.post<Evolution>(`/medical-records/${data.medicalRecordId}/evolutions`, data)
  return response.data
}

export async function signEvolution(
  medicalRecordId: string,
  data: SignEvolutionRequest,
): Promise<Evolution> {
  const response = await api.post<Evolution>(
    `/medical-records/${medicalRecordId}/evolutions/${data.evolutionId}/sign`,
    data,
  )
  return response.data
}

export async function getAnamnesis(medicalRecordId: string): Promise<Anamnesis | null> {
  const response = await api.get<Anamnesis>(`/medical-records/${medicalRecordId}/anamnesis`)
  return response.data
}

export async function createOrUpdateAnamnesis(data: AnamnesisRequest): Promise<Anamnesis> {
  const response = await api.post<Anamnesis>(`/medical-records/${data.medicalRecordId}/anamnesis`, data)
  return response.data
}

export async function getDiagnostics(medicalRecordId: string): Promise<DiagnosticHypothesis[]> {
  const response = await api.get<DiagnosticHypothesis[]>(`/medical-records/${medicalRecordId}/diagnostics`)
  return response.data
}

export async function addDiagnostic(data: DiagnosticRequest): Promise<DiagnosticHypothesis> {
  const response = await api.post<DiagnosticHypothesis>(`/medical-records/${data.medicalRecordId}/diagnostics`, data)
  return response.data
}

export async function updateDiagnostic(
  medicalRecordId: string,
  diagId: string,
  status: string,
): Promise<DiagnosticHypothesis> {
  const response = await api.patch<DiagnosticHypothesis>(
    `/medical-records/${medicalRecordId}/diagnostics/${diagId}`,
    { status },
  )
  return response.data
}

export async function removeDiagnostic(medicalRecordId: string, diagId: string): Promise<void> {
  await api.delete(`/medical-records/${medicalRecordId}/diagnostics/${diagId}`)
}

export async function getDocuments(patientId: string): Promise<PatientDocument[]> {
  const response = await api.get<PatientDocument[]>(`/medical-records/${patientId}/documents`)
  return response.data
}

export async function uploadDocument(patientId: string, file: File): Promise<PatientDocument> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<PatientDocument>(`/medical-records/${patientId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function deleteDocument(medicalRecordId: string, docId: string): Promise<void> {
  await api.delete(`/medical-records/${medicalRecordId}/documents/${docId}`)
}

export async function searchCid10(query: string): Promise<Cid10Result[]> {
  const response = await api.get<Cid10Result[]>('/search/cid10', {
    params: { q: query },
  })
  return response.data
}
