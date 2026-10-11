import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { RefreshRequest, TokenResponse } from '@/types/auth'

const baseURL = import.meta.env.VITE_API_URL ?? '/api'

const api = axios.create({
  baseURL,
  // Free-tier hosts (Render, Fly) can take ~30-50s to wake an idle API.
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { token, tenantId } = useAuthStore.getState()

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (tenantId && config.headers) {
    config.headers['X-Tenant-ID'] = tenantId
  }

  return config
})

// One refresh at a time: concurrent 401s all await the same promise, then each retries itself.
let refreshing: Promise<string> | null = null

function refreshAccessToken(): Promise<string> {
  refreshing ??= (async () => {
    const { refreshToken, setTokens } = useAuthStore.getState()
    if (!refreshToken) throw new Error('Sessão expirada')
    const { data } = await axios.post<TokenResponse>(
      `${baseURL}/auth/refresh`,
      { refreshToken } satisfies RefreshRequest,
      { headers: { 'Content-Type': 'application/json' }, timeout: 60000 },
    )
    setTokens(data.accessToken, data.refreshToken)
    return data.accessToken
  })().finally(() => {
    refreshing = null
  })
  return refreshing
}

// A 401 from the auth endpoints means bad credentials/token, not an expired session.
const isAuthEndpoint = (url?: string) => /\/auth\/(login|refresh|forgot-password|reset-password)/.test(url ?? '')

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined

    if (error.response?.status !== 401 || !original || original._retry || isAuthEndpoint(original.url)) {
      return Promise.reject(error)
    }
    original._retry = true

    let token: string
    try {
      token = await refreshAccessToken()
    } catch (refreshError) {
      // Only a rejected/missing refresh token ends the session; a network blip or 5xx keeps it.
      const status = axios.isAxiosError(refreshError) ? refreshError.response?.status : undefined
      if (!axios.isAxiosError(refreshError) || (status !== undefined && status < 500)) {
        useAuthStore.getState().logout()
      }
      return Promise.reject(refreshError)
    }

    original.headers.Authorization = `Bearer ${token}`
    return api(original)
  },
)

export { api }
