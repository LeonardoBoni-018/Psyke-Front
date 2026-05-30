import { api } from '@/lib/axios'
import type { PaginatedResponse } from '@/types/api'
import type { Patient, PatientListItem, PatientRequest, PatientStatus } from '@/types/patient'

interface PatientListParams {
  status?: PatientStatus
  page?: number
  size?: number
  search?: string
}

export async function listPatients(params?: PatientListParams): Promise<PaginatedResponse<PatientListItem>> {
  const response = await api.get<PaginatedResponse<PatientListItem>>('/patients', {
    params,
  })
  return response.data
}

export async function getPatientById(id: string): Promise<Patient> {
  const response = await api.get<Patient>(`/patients/${id}`)
  return response.data
}

export async function createPatient(data: PatientRequest): Promise<Patient> {
  const response = await api.post<Patient>('/patients', data)
  return response.data
}

export async function updatePatient(id: string, data: Partial<PatientRequest>): Promise<Patient> {
  const response = await api.put<Patient>(`/patients/${id}`, data)
  return response.data
}

export async function deactivatePatient(id: string): Promise<void> {
  await api.delete(`/patients/${id}`)
}

export async function exportPatientData(id: string): Promise<Blob> {
  const response = await api.get<Blob>(`/patients/${id}/export`, {
    responseType: 'blob',
  })
  return response.data
}
