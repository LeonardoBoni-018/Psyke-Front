import { api } from '@/lib/axios'
import type { TenantResponse, CreateTenantRequest } from '@/types/tenant'

export async function createTenant(data: CreateTenantRequest): Promise<TenantResponse> {
  const response = await api.post<TenantResponse>('/tenants', data)
  return response.data
}

/** The API only exposes the signed-in user's own clinic (`/tenants/current`). */
export async function getCurrentTenant(): Promise<TenantResponse> {
  const response = await api.get<TenantResponse>('/tenants/current')
  return response.data
}
