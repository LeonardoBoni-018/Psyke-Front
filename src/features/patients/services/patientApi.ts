import { api } from '@/lib/axios'
import type { PaginatedResponse } from '@/types/api'
import type { AppointmentResponse } from '@/types/appointment'
import type { PatientResponse, CreatePatientRequest, UpdatePatientRequest } from '@/types/patient'

interface PatientListParams {
  page?: number
  size?: number
  sort?: string
  q?: string
  status?: string
}

export async function listPatients(params?: PatientListParams): Promise<PaginatedResponse<PatientResponse>> {
  const response = await api.get<PaginatedResponse<PatientResponse>>('/patients', { params })
  return response.data
}

export async function getPatientById(id: string): Promise<PatientResponse> {
  const response = await api.get<PatientResponse>(`/patients/${id}`)
  return response.data
}

/** All appointments of a patient (the API returns a plain list, newest and oldest alike). */
export async function listPatientAppointments(patientId: string): Promise<AppointmentResponse[]> {
  const response = await api.get<AppointmentResponse[]>('/appointments', { params: { patientId } })
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
