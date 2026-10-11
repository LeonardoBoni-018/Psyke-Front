import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { api } from './axios'
import { useAuthStore } from '@/features/auth/store/authStore'

type Handler = (config: InternalAxiosRequestConfig) => { status: number; data?: unknown }

function useBackend(handler: Handler) {
  api.defaults.adapter = async (config) => {
    const { status, data } = handler(config)
    const response = { status, data, statusText: '', headers: {}, config } as AxiosResponse
    if (status >= 400) {
      throw new AxiosError(`HTTP ${status}`, 'ERR_BAD_REQUEST', config, null, response)
    }
    return response
  }
}

describe('axios auth interceptor', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: 'old', refreshToken: 'r1', tenantId: 't1', user: null })
    vi.restoreAllMocks()
  })

  it('refreshes once, then retries every queued request with the new token', async () => {
    const refresh = vi.spyOn(axios, 'post').mockResolvedValue({ data: { accessToken: 'new', refreshToken: 'r2' } })
    const calls: string[] = []
    useBackend((config) => {
      calls.push(`${config.url}:${config.headers.Authorization}`)
      return config.headers.Authorization === 'Bearer new' ? { status: 200, data: { ok: config.url } } : { status: 401 }
    })

    const [a, b] = await Promise.all([api.get('/patients'), api.get('/rooms')])

    expect(refresh).toHaveBeenCalledTimes(1)
    // Each caller gets the response of its OWN request, not the refresh response.
    expect(a.data).toEqual({ ok: '/patients' })
    expect(b.data).toEqual({ ok: '/rooms' })
    expect(useAuthStore.getState().token).toBe('new')
  })

  it('does not try to refresh when the login endpoint itself returns 401', async () => {
    const refresh = vi.spyOn(axios, 'post')
    useBackend(() => ({ status: 401, data: { message: 'E-mail, senha ou clínica inválidos' } }))

    await expect(api.post('/auth/login', {})).rejects.toMatchObject({ response: { status: 401 } })

    expect(refresh).not.toHaveBeenCalled()
    expect(useAuthStore.getState().token).toBe('old')
  })

  it('logs out when the refresh token is rejected', async () => {
    vi.spyOn(axios, 'post').mockRejectedValue(
      new AxiosError('nope', 'ERR_BAD_REQUEST', undefined, null, { status: 401 } as AxiosResponse),
    )
    useBackend(() => ({ status: 401 }))

    await expect(api.get('/patients')).rejects.toBeDefined()

    expect(useAuthStore.getState().token).toBeNull()
  })

  it('keeps the session when the refresh fails because the network is down', async () => {
    vi.spyOn(axios, 'post').mockRejectedValue(new AxiosError('Network Error', 'ERR_NETWORK'))
    useBackend(() => ({ status: 401 }))

    await expect(api.get('/patients')).rejects.toBeDefined()

    expect(useAuthStore.getState().token).toBe('old')
  })
})
