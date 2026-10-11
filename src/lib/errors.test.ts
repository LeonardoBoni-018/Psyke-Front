import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getApiErrorMessage } from './errors'

function httpError(status: number, data?: unknown) {
  const config = { headers: {} } as InternalAxiosRequestConfig
  return new AxiosError('failed', 'ERR_BAD_REQUEST', config, null, {
    status,
    statusText: '',
    headers: {},
    config,
    data,
  })
}

describe('getApiErrorMessage', () => {
  it('uses the message returned by the API for client errors', () => {
    expect(getApiErrorMessage(httpError(409, { message: 'CRP already registered' }))).toBe('CRP already registered')
  })

  it('joins validation details when present', () => {
    expect(getApiErrorMessage(httpError(400, { message: 'Validation failed', details: ['email: inválido', 'nome: obrigatório'] }))).toBe(
      'email: inválido · nome: obrigatório',
    )
  })

  it('maps rate limiting, permission and server errors to friendly text', () => {
    expect(getApiErrorMessage(httpError(429))).toMatch(/Muitas tentativas/)
    expect(getApiErrorMessage(httpError(403))).toMatch(/permissão/)
    expect(getApiErrorMessage(httpError(500, { message: 'NullPointerException at ...' }))).toBe('Erro no servidor. Tente novamente em instantes.')
  })

  it('explains network failures and timeouts', () => {
    const offline = new AxiosError('Network Error', 'ERR_NETWORK')
    const timeout = new AxiosError('timeout', 'ECONNABORTED')
    expect(getApiErrorMessage(offline)).toMatch(/conectar ao servidor/)
    expect(getApiErrorMessage(timeout)).toMatch(/demorou/)
  })

  it('falls back for unknown values', () => {
    expect(getApiErrorMessage(undefined)).toBe('Algo deu errado. Tente novamente.')
    expect(getApiErrorMessage(new Error('boom'))).toBe('boom')
  })
})
