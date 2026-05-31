import { api } from '@/lib/axios'
import type { PaginatedResponse } from '@/types/api'
import type {
  ProfessionalResponse,
  CreateProfessionalRequest,
  UpdateProfessionalRequest,
} from '@/types/professional'

export async function listProfessionals(params?: { page?: number; size?: number; status?: string }): Promise<PaginatedResponse<ProfessionalResponse>> {
  const response = await api.get<PaginatedResponse<ProfessionalResponse>>('/professionals', { params })
  return response.data
}

export async function findProfessionalById(id: string): Promise<ProfessionalResponse> {
  const response = await api.get<ProfessionalResponse>(`/professionals/${id}`)
  return response.data
}

export async function createProfessional(data: CreateProfessionalRequest): Promise<ProfessionalResponse> {
  const response = await api.post<ProfessionalResponse>('/professionals', data)
  return response.data
}

export async function updateProfessional(id: string, data: UpdateProfessionalRequest): Promise<ProfessionalResponse> {
  const response = await api.put<ProfessionalResponse>(`/professionals/${id}`, data)
  return response.data
}

export async function deleteProfessional(id: string): Promise<void> {
  await api.delete(`/professionals/${id}`)
}
