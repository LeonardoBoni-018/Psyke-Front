import { api } from '@/lib/axios'
import type { PaginatedResponse } from '@/types/api'
import type {
  ProntuarioResponse,
  CreateProntuarioRequest,
  UpdateProntuarioRequest,
  EvolucaoClinicaResponse,
  CreateEvolucaoRequest,
  AnamneseResponse,
  CreateAnamneseRequest,
  UpdateAnamneseRequest,
} from '@/types/medical-record'

export async function findProntuarioByPatient(patientId: string): Promise<ProntuarioResponse[]> {
  const response = await api.get<ProntuarioResponse[]>('/prontuarios', { params: { patientId } })
  return response.data
}

export async function findProntuarioById(id: string): Promise<ProntuarioResponse> {
  const response = await api.get<ProntuarioResponse>(`/prontuarios/${id}`)
  return response.data
}

export async function createProntuario(data: CreateProntuarioRequest): Promise<ProntuarioResponse> {
  const response = await api.post<ProntuarioResponse>('/prontuarios', data)
  return response.data
}

export async function updateProntuario(id: string, data: UpdateProntuarioRequest): Promise<ProntuarioResponse> {
  const response = await api.put<ProntuarioResponse>(`/prontuarios/${id}`, data)
  return response.data
}

export async function archiveProntuario(id: string): Promise<ProntuarioResponse> {
  const response = await api.patch<ProntuarioResponse>(`/prontuarios/${id}/archive`)
  return response.data
}

export async function addEvolucao(data: CreateEvolucaoRequest): Promise<EvolucaoClinicaResponse> {
  const response = await api.post<EvolucaoClinicaResponse>(`/prontuarios/${data.prontuarioId}/evolucoes`, data)
  return response.data
}

export async function listEvolucoes(
  prontuarioId: string,
  params?: { page?: number; size?: number },
): Promise<PaginatedResponse<EvolucaoClinicaResponse>> {
  const response = await api.get<PaginatedResponse<EvolucaoClinicaResponse>>(
    `/prontuarios/${prontuarioId}/evolucoes`,
    { params },
  )
  return response.data
}

export async function createAnamnese(data: CreateAnamneseRequest): Promise<AnamneseResponse> {
  const response = await api.post<AnamneseResponse>(`/prontuarios/${data.prontuarioId}/anamnese`, data)
  return response.data
}

export async function findAnamnese(prontuarioId: string): Promise<AnamneseResponse | null> {
  const response = await api.get<AnamneseResponse>(`/prontuarios/${prontuarioId}/anamnese`)
  return response.data
}

export async function updateAnamnese(prontuarioId: string, data: UpdateAnamneseRequest): Promise<AnamneseResponse> {
  const response = await api.put<AnamneseResponse>(`/prontuarios/${prontuarioId}/anamnese`, data)
  return response.data
}
