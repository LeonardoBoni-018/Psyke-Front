import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react'
import { resetPassword } from '@/features/auth/services/authApi'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      await resetPassword({ token, newPassword })
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-0 p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal/10">
            <CheckCircle size={32} className="text-teal" />
          </div>
          <h1 className="text-2xl font-serif text-text-1">Senha redefinida</h1>
          <p className="text-sm text-text-3">Sua senha foi alterada com sucesso.</p>
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
          <h1 className="text-2xl font-serif text-text-1">Redefinir senha</h1>
          <p className="text-sm text-text-3">Digite sua nova senha</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 rounded-[var(--radius-xl)] border border-border bg-bg-1 p-8 shadow-sm">
          <div className="space-y-1">
            <label htmlFor="newPassword" className="block text-sm font-medium text-text-2">Nova senha</label>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-2 px-3 py-2 transition focus-within:border-teal">
              <Lock size={18} className="text-text-3" />
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-transparent text-text-1 outline-none placeholder:text-text-3"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-2">Confirmar senha</label>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-2 px-3 py-2 transition focus-within:border-teal">
              <Lock size={18} className="text-text-3" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-transparent text-text-1 outline-none placeholder:text-text-3"
              />
            </div>
          </div>
          {error && <p className="text-[12px] text-danger">{error}</p>}
          <button
            type="submit"
            disabled={loading || !token}
            className="w-full rounded-xl bg-teal py-2.5 text-sm font-medium text-white transition hover:bg-teal/90 disabled:opacity-50"
          >
            {loading ? 'Redefinindo...' : 'Redefinir senha'}
          </button>
          <Link to="/login" className="block text-center text-sm text-text-3 transition hover:text-text-1">
            Voltar para login
          </Link>
        </form>
      </div>
    </div>
  )
}
