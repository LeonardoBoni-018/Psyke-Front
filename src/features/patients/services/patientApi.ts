import { api } from '@/lib/axios'
import type { PaginatedResponse } from '@/types/api'
import type { PatientResponse, PatientListItem, CreatePatientRequest, UpdatePatientRequest, PatientStatus } from '@/types/patient'

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

export async function getPatientById(id: string): Promise<PatientResponse> {
  const response = await api.get<PatientResponse>(`/patients/${id}`)
  return response.data
}

export async function createPatient(data: CreatePatientRequest): Promise<PatientResponse> {
  const response = await api.post<PatientResponse>('/patients', data)
  return response.data
}

export async function updatePatient(id: string, data: UpdatePatientRequest): Promise<PatientResponse> {
  const response = await api.put<PatientResponse>(`/patients/${id}`, data)
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
