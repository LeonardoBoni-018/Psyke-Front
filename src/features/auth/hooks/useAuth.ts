import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { login as loginApi, logout as logoutApi } from '@/features/auth/services/authApi'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { LoginRequest } from '@/types/auth'

export function useLogin() {
  const navigate = useNavigate()
  const setTokens = useAuthStore((state) => state.setTokens)
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await loginApi(data)
      return { ...response, tenantId: data.tenantId, email: data.email }
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken)
      setUser({
        id: data.userId,
        tenantId: data.tenantId,
        clinicaId: null,
        nomeCompleto: data.nomeCompleto,
        email: data.email,
        roles: data.roles,
      })
      navigate('/dashboard', { replace: true })
    },
  })
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout)
  const refreshToken = useAuthStore((state) => state.refreshToken)

  return useMutation({
    mutationFn: async () => {
      if (!refreshToken) {
        return Promise.resolve()
      }
      await logoutApi(refreshToken)
    },
    onSettled: () => {
      logout()
    },
  })
}
