import { api } from '@/lib/axios'

/** Matches the API's ClinicResponse (`/clinics`). */
export interface ClinicResponse {
  id: string
  name: string
  legalName?: string | null
  cnpj?: string | null
  crp?: string | null
  address?: string | null
  phone?: string | null
  logoUrl?: string | null
  active: boolean
}

export type UpdateClinicRequest = Partial<Pick<ClinicResponse, 'name' | 'legalName' | 'cnpj' | 'crp' | 'address' | 'phone'>>

export async function getCurrentClinic(): Promise<ClinicResponse> {
  const response = await api.get<ClinicResponse>('/clinics/current')
  return response.data
}

export async function updateClinic(id: string, data: UpdateClinicRequest): Promise<ClinicResponse> {
  const response = await api.put<ClinicResponse>(`/clinics/${id}`, data)
  return response.data
}
