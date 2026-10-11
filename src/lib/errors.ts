import { isAxiosError } from 'axios'

interface ApiErrorBody {
  message?: string
  details?: string[]
}

/** Turns any thrown value into a message that is safe and useful to show to the user. */
export function getApiErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return error.code === 'ECONNABORTED'
        ? 'O servidor demorou para responder. Tente novamente em instantes.'
        : 'Não foi possível conectar ao servidor. Verifique sua conexão.'
    }
    const { status, data } = error.response
    if (status === 429) return 'Muitas tentativas. Aguarde um instante e tente novamente.'
    if (status === 403) return 'Você não tem permissão para realizar esta ação.'
    if (status >= 500) return 'Erro no servidor. Tente novamente em instantes.'
    const detail = data?.details?.filter(Boolean).join(' · ')
    return detail || data?.message || fallback
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
