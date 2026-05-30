export type UserRole =
  | 'ROLE_SUPER_ADMIN'
  | 'ROLE_ADMIN_TENANT'
  | 'ROLE_ADMIN_CLINICA'
  | 'ROLE_PROFISSIONAL'
  | 'ROLE_RECEPCIONISTA'
  | 'ROLE_PACIENTE'

export interface User {
  id: string
  tenantId: string
  clinicaId: string | null
  nomeCompleto: string
  email: string
  roles: UserRole[]
  crp?: string
}

export interface LoginRequest {
  tenantId: string
  email: string
  senha: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  userId: string
  nomeCompleto: string
  roles: UserRole[]
}

export interface RefreshRequest {
  refreshToken: string
}
