import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { RefreshRequest, TokenResponse } from '@/types/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: AxiosResponse<unknown>) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, response?: AxiosResponse<unknown>) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else if (response) {
      resolve(response)
    }
  })
  failedQueue = []
}

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const { token, tenantId } = useAuthStore.getState()

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (tenantId && config.headers) {
    config.headers['X-Tenant-ID'] = tenantId
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise<AxiosResponse<unknown>>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
      }

      isRefreshing = true
      const { refreshToken, logout, setTokens } = useAuthStore.getState()

      try {
        if (!refreshToken) {
          throw new Error('Refresh token ausente')
        }

        const response = await axios.post<TokenResponse>(
          `${import.meta.env.VITE_API_URL ?? '/api'}/auth/refresh`,
          { refreshToken } as RefreshRequest,
          { headers: { 'Content-Type': 'application/json' } },
        )

        setTokens(response.data.accessToken, response.data.refreshToken)
        processQueue(null, response)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        logout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export { api }
