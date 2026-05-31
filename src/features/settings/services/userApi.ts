import { api } from '@/lib/axios'
import type { PaginatedResponse } from '@/types/api'
import type { UserResponse, CreateUserRequest, UpdateRolesRequest } from '@/types/user'

export async function listUsers(params?: { page?: number; size?: number }): Promise<PaginatedResponse<UserResponse>> {
  const response = await api.get<PaginatedResponse<UserResponse>>('/users', { params })
  return response.data
}

export async function createUser(data: CreateUserRequest): Promise<UserResponse> {
  const response = await api.post<UserResponse>('/users', data)
  return response.data
}

export async function updateRoles(data: UpdateRolesRequest): Promise<UserResponse> {
  const response = await api.put<UserResponse>(`/users/${data.userId}/roles`, { roles: data.roles })
  return response.data
}
