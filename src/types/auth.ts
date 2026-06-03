export type UserRole =
  | 'ROLE_ADMIN' | 'ROLE_PROFESSIONAL' | 'ROLE_PATIENT'
  | 'ROLE_RECEPTIONIST' | 'ROLE_USER'

export interface UserResponse {
  id: string
  tenantId: string
  fullName: string
  email: string
  cpf?: string
  phone?: string
  active: boolean
  emailVerified?: boolean
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
  name: string
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
