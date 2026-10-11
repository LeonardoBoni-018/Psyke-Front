import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Building2, Mail, Lock, AlertCircle } from 'lucide-react'
import { useLogin } from '../hooks/useAuth'
import { getApiErrorMessage } from '@/lib/errors'

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
      <label htmlFor={id} className="font-mono text-[11px] tracking-[0.06em] text-text-3">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-text-3">{icon}</span>
        {children}
        {trailing && <span className="absolute right-1 top-1/2 flex -translate-y-1/2">{trailing}</span>}
      </div>
      {error && (
        <span id={`${id}-error`} role="alert" className="font-mono text-[11px] text-danger">
          {error}
        </span>
      )}
    </div>
  )
}

const inputClass =
  'w-full rounded-md border border-border bg-bg-2 py-2.5 pl-9 pr-3 text-[14px] text-text-1 outline-none transition placeholder:text-text-3 focus:border-teal focus:shadow-focus aria-[invalid=true]:border-danger'

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
    <div className="page-enter grid min-h-dvh bg-bg-0 lg:grid-cols-[42%_1fr]">
      <section className="flex flex-col justify-center gap-5 border-b border-border bg-bg-1 px-6 py-8 sm:px-10 lg:gap-8 lg:border-b-0 lg:border-r lg:px-16 lg:py-16">
        <div className="flex items-center gap-4 lg:block">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal lg:mb-6 lg:h-[52px] lg:w-[52px]">
            <span className="font-serif text-2xl italic text-bg-0 lg:text-[28px]">ψ</span>
          </div>
          <div>
            <h1 className="font-serif text-3xl leading-none text-text-1 lg:mb-3 lg:text-5xl">Psyke</h1>
            <p className="mt-1 font-mono text-[11px] tracking-[0.12em] text-text-3 lg:mt-0 lg:text-xs">Clinic OS — v2.0</p>
          </div>
        </div>
        <p className="hidden max-w-xs text-sm leading-relaxed text-text-2 lg:block">
          Sistema de gestão clínica para psicólogos e clínicas de psicologia. Prontuários, agenda, financeiro e muito mais.
        </p>
        <div className="hidden gap-2 lg:flex">
          {['Prontuário', 'Agenda', 'LGPD'].map((tag) => (
            <span key={tag} className="rounded-full border border-teal/20 bg-teal/10 px-2.5 py-1 font-mono text-[10px] text-teal">
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-8 sm:p-10">
        <div className="w-full max-w-[420px] rounded-xl border border-border bg-bg-1 p-6 sm:p-10">
          <h2 className="mb-2 font-serif text-[26px] text-text-1">Entrar</h2>
          <p className="mb-8 text-[13px] text-text-3">Acesse sua clínica com suas credenciais</p>

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
                className="animate-shake flex items-start gap-2 rounded-md border border-danger/30 bg-danger/10 px-3 py-2.5 text-[12px] text-danger"
              >
                <AlertCircle size={14} className="mt-px shrink-0" />
                <span>{getApiErrorMessage(error, 'Não foi possível entrar. Verifique os dados e tente novamente.')}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-teal px-5 py-2.5 text-sm font-semibold text-bg-0 transition hover:bg-teal-hi active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              Entrar
            </button>
            {isPending && (
              <p role="status" className="text-center text-[11px] text-text-3">
                Conectando… o primeiro acesso do dia pode levar alguns segundos.
              </p>
            )}

            <Link to="/forgot-password" className="mt-1 text-center text-xs text-text-3 transition hover:text-teal">
              Esqueceu a senha?
            </Link>
          </form>
        </div>
      </section>
    </div>
  )
}
