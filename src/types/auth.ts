export type UserRole = 'ROLE_ADMIN' | 'ROLE_PROFESSIONAL' | 'ROLE_PATIENT' | 'ROLE_RECEPTIONIST'

export interface UserResponse {
  id: string
  tenantId: string
  fullName: string
  email: string
  roles: UserRole[]
  crp?: string
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
