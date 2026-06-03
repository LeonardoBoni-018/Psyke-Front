export type UserRole =
  | 'ROLE_SUPER_ADMIN' | 'ROLE_ADMIN_TENANT' | 'ROLE_ADMIN_CLINIC'
  | 'ROLE_PROFESSIONAL' | 'ROLE_RECEPTIONIST' | 'ROLE_PATIENT'

export interface UserResponse {
  id: string
  tenantId: string
  fullName: string
  email: string
  cpf?: string
  phone?: string
  active: boolean
  roles: UserRole[]
  crp?: string
  createdAt: string
}

export interface LoginRequest {
  tenantId: string
  email: string
  password: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  userId: string
  fullName: string
  roles: UserRole[]
}

export interface RefreshRequest {
  refreshToken: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface VerifyEmailRequest {
  token: string
}
