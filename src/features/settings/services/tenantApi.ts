import { api } from '@/lib/axios'
import type { TenantResponse, CreateTenantRequest } from '@/types/tenant'

export async function createTenant(data: CreateTenantRequest): Promise<TenantResponse> {
  const response = await api.post<TenantResponse>('/tenants', data)
  return response.data
}

export async function getTenantById(id: string): Promise<TenantResponse> {
  const response = await api.get<TenantResponse>(`/tenants/${id}`)
  return response.data
}
