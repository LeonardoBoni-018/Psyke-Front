import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Building2, Mail, Lock, AlertCircle } from 'lucide-react'
import { useLogin } from '../hooks/useAuth'
import { getApiErrorMessage } from '@/lib/errors'
import { Logo } from '@/components/brand/Logo'

const schema = z.object({
  tenantId: z.string().trim().min(1, 'ID da clínica obrigatório'),
  email: z.string().trim().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

const TENANT_KEY = 'psyke-last-tenant'

function readLastTenant() {
  try {
    return localStorage.getItem(TENANT_KEY) ?? ''
  } catch {
    return ''
  }
}

function rememberTenant(tenantId: string) {
  try {
    localStorage.setItem(TENANT_KEY, tenantId)
  } catch {
    /* storage unavailable (private mode): nothing to remember */
  }
}

interface FieldProps {
  id: string
  label: string
  icon: ReactNode
  error?: string
  trailing?: ReactNode
  children: ReactNode
}

function Field({ id, label, icon, error, trailing, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-[11px] text-text-3">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 text-text-3">{icon}</span>
        {children}
        {trailing && <span className="absolute right-1 top-1/2 flex -translate-y-1/2">{trailing}</span>}
      </div>
      {error && (
        <span id={`${id}-error`} role="alert" className="text-xs text-danger">
          {error}
        </span>
      )}
    </div>
  )
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-bg-1 pl-10 pr-3 text-[15px] text-text-1 shadow-sm outline-none transition placeholder:text-text-3 focus:border-brand focus:shadow-focus aria-[invalid=true]:border-danger'

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const { mutate: login, isPending, error, reset } = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tenantId: readLastTenant(), email: '', password: '' },
  })

  const onSubmit = (data: FormData) => {
    rememberTenant(data.tenantId)
    login(data)
  }

  return (
    <div className="grid min-h-dvh bg-bg-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <section className="relative flex flex-col justify-between gap-10 px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <h1 className="font-display text-[26px] font-semibold leading-none tracking-tight text-text-1">Psyke</h1>
        </div>

        <div className="hidden max-w-[520px] lg:block">
          <p className="rise-in font-display text-[44px] font-semibold leading-[1.08] tracking-tight text-text-1" style={{ animationDelay: '60ms' }}>
            A rotina da clínica,<br />sem ruído.
          </p>
          <p className="rise-in mt-4 max-w-[420px] text-[16px] leading-relaxed text-text-2" style={{ animationDelay: '140ms' }}>
            Agenda, prontuário e financeiro no mesmo lugar, com o cuidado que dados de saúde pedem.
          </p>

          <div
            className="rise-in surface mt-10 max-w-[460px] p-4"
            style={{ animationDelay: '260ms', boxShadow: 'var(--shadow-md)' }}
            aria-hidden="true"
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-[13px] font-semibold text-text-1">Hoje</span>
              <span className="flex items-center gap-1.5 text-xs text-text-3">
                <span className="animate-pulse-live h-2 w-2 rounded-full bg-brand" /> 3 sessões
              </span>
            </div>
            {[
              { time: '09:00', name: 'Mariana Costa', tag: 'Confirmada', tone: 'bg-brand/10 text-brand' },
              { time: '10:30', name: 'Lucas Andrade', tag: 'Aguardando', tone: 'bg-amber/10 text-amber' },
              { time: '14:00', name: 'Beatriz Nogueira', tag: 'Confirmada', tone: 'bg-brand/10 text-brand' },
            ].map((row, i) => (
              <div
                key={row.time}
                className="item-enter flex items-center gap-3 rounded-lg px-2 py-2.5"
                style={{ animationDelay: `${420 + i * 90}ms` }}
              >
                <span className="w-11 text-[13px] font-semibold tabular text-text-2">{row.time}</span>
                <span className="h-7 w-0.5 rounded-full bg-brand/40" />
                <span className="flex-1 text-[14px] text-text-1">{row.name}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${row.tone}`}>{row.tag}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="hidden text-[13px] text-text-3 lg:block">Dados criptografados em trânsito e isolados por clínica.</p>
      </section>

      <section className="flex items-center justify-center px-4 pb-10 sm:p-10 lg:border-l lg:border-border lg:bg-bg-1">
        <div className="rise-in w-full max-w-[380px]">
          <h2 className="mb-1.5 font-display text-[30px] font-semibold tracking-tight text-text-1">Entrar</h2>
          <p className="mb-8 text-[14px] text-text-2">Use o ID da sua clínica e suas credenciais.</p>

          <form onSubmit={handleSubmit(onSubmit)} onChange={() => error && reset()} noValidate className="flex flex-col gap-4">
            <Field id="tenantId" label="ID da clínica" icon={<Building2 size={15} />} error={errors.tenantId?.message}>
              <input
                id="tenantId"
                {...register('tenantId')}
                placeholder="ex: demo"
                autoComplete="organization"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                aria-invalid={!!errors.tenantId}
                className={inputClass}
              />
            </Field>
            <Field id="email" label="E-mail" icon={<Mail size={15} />} error={errors.email?.message}>
              <input
                id="email"
                {...register('email')}
                type="email"
                inputMode="email"
                placeholder="seu@email.com"
                autoComplete="username"
                autoCapitalize="none"
                aria-invalid={!!errors.email}
                className={inputClass}
              />
            </Field>
            <Field
              id="password"
              label="Senha"
              icon={<Lock size={15} />}
              error={errors.password?.message}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-text-3 transition hover:text-text-1"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            >
              <input
                id="password"
                {...register('password')}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                className={`${inputClass} pr-11`}
              />
            </Field>

            {error && (
              <div
                role="alert"
                className="animate-shake flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-[13px] text-danger"
              >
                <AlertCircle size={14} className="mt-px shrink-0" />
                <span>{getApiErrorMessage(error, 'Não foi possível entrar. Verifique os dados e tente novamente.')}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-[15px] font-semibold text-on-brand shadow-sm transition hover:bg-brand-hi active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              Entrar
            </button>
            {isPending && (
              <p role="status" className="text-center text-[11px] text-text-3">
                Conectando… o primeiro acesso do dia pode levar alguns segundos.
              </p>
            )}

            <Link to="/forgot-password" className="mt-1 text-center text-[13px] text-text-3 transition hover:text-brand">
              Esqueceu a senha?
            </Link>
          </form>
        </div>
      </section>
    </div>
  )
}
