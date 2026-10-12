import { api } from '@/lib/axios'
import type {
  Slot,
  ProfessionalAvailabilityResponse,
  CreateAvailabilityRequest,
  AvailabilityException,
  CreateExceptionRequest,
} from '@/types/professional'

export async function getSlots(params: {
  professionalId: string
  startDate: string
  endDate: string
}): Promise<Slot[]> {
  const response = await api.get<Slot[]>(`/professionals/${params.professionalId}/slots`, { params: { startDate: params.startDate, endDate: params.endDate } })
  return response.data
}

export async function listAvailability(professionalId: string): Promise<ProfessionalAvailabilityResponse> {
  const response = await api.get<ProfessionalAvailabilityResponse>(`/professionals/${professionalId}/availability`)
  return response.data
}

export async function createAvailability(data: CreateAvailabilityRequest): Promise<ProfessionalAvailabilityResponse> {
  const response = await api.post<ProfessionalAvailabilityResponse>(`/professionals/${data.professionalId}/availability`, data)
  return response.data
}

export async function updateAvailability(id: string, data: CreateAvailabilityRequest): Promise<ProfessionalAvailabilityResponse> {
  const response = await api.put<ProfessionalAvailabilityResponse>(`/availability/${id}`, data)
  return response.data
}

export async function deleteAvailability(id: string): Promise<void> {
  await api.delete(`/availability/${id}`)
}

export async function listExceptions(professionalId: string): Promise<AvailabilityException[]> {
  const response = await api.get<AvailabilityException[]>('/availability/exceptions', { params: { professionalId } })
  return response.data
}

export async function createException(data: CreateExceptionRequest): Promise<AvailabilityException> {
  const response = await api.post<AvailabilityException>('/availability/exceptions', data)
  return response.data
}

export async function deleteException(id: string): Promise<void> {
  await api.delete(`/availability/exceptions/${id}`)
}
