import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Acesso</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Entrar no Psyke</h1>
        </header>
        <LoginForm />
      </div>
    </div>
  )
}
