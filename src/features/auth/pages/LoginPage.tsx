import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,196,160,0.08),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(74,158,255,0.08),transparent_24%)] px-4 py-10">
      <div className="mx-auto flex w-full max-w-[1100px] overflow-hidden rounded-[var(--radius-xl)] border border-border bg-bg-1 shadow-none">
        <aside className="hidden w-[40%] flex-col border-r border-border bg-bg-1 p-10 text-text-1 lg:flex">
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] bg-teal text-bg-0 font-serif text-4xl italic">
                ψ
              </div>
              <div className="space-y-2">
                <h1 className="font-serif text-4xl text-text-1">Psyke</h1>
                <p className="text-sm text-text-2">Clinic OS</p>
              </div>
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-3">Powered by Psyke Platform</div>
          </div>
        </aside>
        <main className="w-full p-8 sm:p-10 lg:w-[60%]">
          <div className="mx-auto max-w-md space-y-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-text-3">Acesso à clínica</p>
              <h2 className="mt-3 text-3xl font-serif text-text-1">Entrar no Psyke</h2>
              <p className="mt-2 text-sm text-text-2">Use seu ID da clínica, e-mail e senha para continuar.</p>
            </div>
            <LoginForm />
          </div>
        </main>
      </div>
    </div>
  )
}
