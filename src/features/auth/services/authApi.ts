import { api } from '@/lib/axios'
import type { LoginRequest, RefreshRequest, TokenResponse, User } from '@/types/auth'

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

export async function getMe(): Promise<User> {
  const response = await api.get<User>('/me')
  return response.data
}
