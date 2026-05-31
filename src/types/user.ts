import type { UserRole } from './auth'

export interface UserResponse {
  id: string
  tenantId: string
  fullName: string
  email: string
  roles: UserRole[]
  crp?: string
  createdAt: string
}

export interface CreateUserRequest {
  fullName: string
  email: string
  password: string
  roles: UserRole[]
  crp?: string
}

export interface UpdateRolesRequest {
  userId: string
  roles: UserRole[]
}
