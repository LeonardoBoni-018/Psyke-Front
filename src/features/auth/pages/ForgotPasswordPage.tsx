import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { forgotPassword } from '@/features/auth/services/authApi'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await forgotPassword({ email })
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar e-mail')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-0 p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal/10">
            <CheckCircle size={32} className="text-teal" />
          </div>
          <h1 className="text-2xl font-serif text-text-1">E-mail enviado</h1>
          <p className="text-sm text-text-3">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-teal transition hover:text-teal/80">
            <ArrowLeft size={14} /> Voltar para login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-0 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-serif text-text-1">Recuperar senha</h1>
          <p className="text-sm text-text-3">Digite seu e-mail para receber as instruções</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 rounded-[var(--radius-xl)] border border-border bg-bg-1 p-8 shadow-sm">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-text-2">E-mail</label>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-2 px-3 py-2 transition focus-within:border-teal">
              <Mail size={18} className="text-text-3" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent text-text-1 outline-none placeholder:text-text-3"
              />
            </div>
          </div>
          {error && <p className="text-[12px] text-danger">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal py-2.5 text-sm font-medium text-white transition hover:bg-teal/90 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
          <Link to="/login" className="block text-center text-sm text-text-3 transition hover:text-text-1">
            Voltar para login
          </Link>
        </form>
      </div>
    </div>
  )
}
