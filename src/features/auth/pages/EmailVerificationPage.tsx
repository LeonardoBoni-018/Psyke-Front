import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { verifyEmail } from '@/features/auth/services/authApi'

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error'
  )
  const [message, setMessage] = useState(
    token ? '' : 'Token de verificação não encontrado.'
  )

  useEffect(() => {
    if (!token) return

    verifyEmail({ token })
      .then(() => {
        setStatus('success')
        setMessage('E-mail verificado com sucesso!')
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'Erro ao verificar e-mail')
      })
  }, [token])

  return (
    <div className="page-enter flex min-h-screen items-center justify-center bg-bg-0 p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-bg-2" />
            <h1 className="text-2xl font-serif text-text-1">Verificando...</h1>
            <p className="text-sm text-text-3">Aguarde enquanto verificamos seu e-mail.</p>
          </div>
        )}
        {status === 'success' && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal/10">
              <CheckCircle size={32} className="text-teal" />
            </div>
            <h1 className="text-2xl font-serif text-text-1">E-mail verificado</h1>
            <p className="text-sm text-text-3">{message}</p>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-teal transition hover:text-teal/80">
              <ArrowLeft size={14} /> Ir para login
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
              <XCircle size={32} className="text-danger" />
            </div>
            <h1 className="text-2xl font-serif text-text-1">Falha na verificação</h1>
            <p className="text-sm text-text-3">{message}</p>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-teal transition hover:text-teal/80">
              <ArrowLeft size={14} /> Voltar para login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
