import { api } from '@/lib/axios'
import type { LoginRequest, RefreshRequest, TokenResponse, UserResponse, ForgotPasswordRequest, ResetPasswordRequest, VerifyEmailRequest } from '@/types/auth'

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>('/auth/login', data)
  return response.data
}

export async function refresh(data: RefreshRequest): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>('/auth/refresh', data)
  return response.data
}

export async function logout(refreshToken: string): Promise<void> {
  await api.post('/auth/logout', { refreshToken })
}

export async function getMe(): Promise<UserResponse> {
  const response = await api.get<UserResponse>('/auth/me')
  return response.data
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
  await api.post('/auth/forgot-password', data)
}

export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  await api.post('/auth/reset-password', data)
}

export async function verifyEmail(data: VerifyEmailRequest): Promise<void> {
  await api.post('/auth/verify-email', data)
}

export async function sendVerification(): Promise<void> {
  await api.post('/auth/send-verification')
}
