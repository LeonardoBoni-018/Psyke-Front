import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2, Mail, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useLogin } from '@/features/auth/hooks/useAuth'
import type { LoginRequest } from '@/types/auth'

const loginSchema = z.object({
  tenantId: z.string().min(1, 'ID da clínica obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínima 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useLogin()

  const { register, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  })

  const onSubmit = async (values: LoginFormValues) => {
    loginMutation.mutate({
      tenantId: values.tenantId,
      email: values.email,
      password: values.password,
    } as LoginRequest)
  }

  const errorMessage = loginMutation.error instanceof Error ? loginMutation.error.message : undefined

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-[var(--radius-xl)] border border-border bg-bg-1 p-8 shadow-none">
      <div className="space-y-1">
        <label htmlFor="tenantId" className="block text-sm font-medium text-text-2">
          ID da clínica
        </label>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-2 px-3 py-2 transition focus-within:border-teal focus-within:ring-0">
          <Building2 size={18} className="text-text-3" />
          <input
            id="tenantId"
            type="text"
            autoComplete="organization"
            {...register('tenantId')}
            className="w-full bg-transparent text-text-1 outline-none placeholder:text-text-3"
          />
        </div>
        {formState.errors.tenantId ? (
          <p className="mt-1 text-[11px] text-danger font-mono">{formState.errors.tenantId.message}</p>
        ) : null}
      </div>
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-text-2">
          E-mail
        </label>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-2 px-3 py-2 transition focus-within:border-teal focus-within:ring-0">
          <Mail size={18} className="text-text-3" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className="w-full bg-transparent text-text-1 outline-none placeholder:text-text-3"
          />
        </div>
        {formState.errors.email ? (
          <p className="mt-1 text-[11px] text-danger font-mono">{formState.errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-1">
        <label htmlFor="senha" className="block text-sm font-medium text-text-2">
          Senha
        </label>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-2 px-3 py-2 transition focus-within:border-teal focus-within:ring-0">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            {...register('password')}
            className="w-full bg-transparent text-text-1 outline-none placeholder:text-text-3"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="text-text-3 transition hover:text-text-1"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {formState.errors.password ? (
          <p className="mt-1 text-[11px] text-danger font-mono">{formState.errors.password.message}</p>
        ) : null}
      </div>
      <div className="space-y-3">
        <Button type="submit" loading={loginMutation.isLoading} className="w-full justify-center">
          {loginMutation.isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
        {errorMessage ? <p className="text-center text-[12px] text-danger">{errorMessage}</p> : null}
      </div>
    </form>
  )
}
