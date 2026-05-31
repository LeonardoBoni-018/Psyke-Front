export interface TenantResponse {
  id: string
  name: string
  slug: string
  logoUrl?: string
  cnpj?: string
  phone?: string
  email?: string
  createdAt: string
}

export interface CreateTenantRequest {
  name: string
  slug: string
  logoUrl?: string
  cnpj?: string
  phone?: string
  email?: string
}
