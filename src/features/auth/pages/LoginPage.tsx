import { useState, cloneElement } from 'react'
import type { ReactNode, ReactElement, CSSProperties } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Building2, Mail, Lock } from 'lucide-react'
import { useLogin } from '../hooks/useAuth'

const schema = z.object({
  tenantId: z.string().min(1, 'ID da clínica obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

interface FieldProps {
  label: string
  icon?: ReactNode
  iconRight?: ReactNode
  error?: string
  children: ReactElement<{ className?: string; style?: CSSProperties }>
}

function Field({ label, icon, iconRight, error, children }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-3)', pointerEvents: 'none', display: 'flex',
          }}>
            {icon}
          </span>
        )}
        {cloneElement(children, {
          style: {
            ...children.props.style,
            paddingLeft: icon ? '34px' : '12px',
            paddingRight: iconRight ? '36px' : '12px',
          },
        })}
        {iconRight && (
          <span style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          }}>
            {iconRight}
          </span>
        )}
      </div>
      {error && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--danger)' }}>
          {error}
        </span>
      )}
    </div>
  )
}

const inputStyle: CSSProperties = {
  width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)', padding: '9px 12px',
  fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-1)',
  outline: 'none', transition: 'border-color 150ms, box-shadow 150ms',
}

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const { mutate: login, isPending } = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <div className="page-enter" style={{
      display: 'flex', height: '100vh', background: 'var(--bg-0)',
      backgroundImage: `
        linear-gradient(var(--border) 1px, transparent 1px),
        linear-gradient(90deg, var(--border) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    }}>
      <div style={{
        width: '42%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px',
        background: 'rgba(13, 19, 24, 0.95)',
        borderRight: '1px solid var(--border)',
      }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{
            width: 52, height: 52, background: 'var(--teal)',
            borderRadius: 12, display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: 24,
          }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontStyle: 'italic', color: 'var(--bg-0)' }}>ψ</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 48, color: 'var(--text-1)', lineHeight: 1.1, marginBottom: 12 }}>
            Psyke
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Clinic OS — v2.0
          </p>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, maxWidth: 320 }}>
          Sistema de gestão clínica para psicólogos e clínicas de psicologia.
          Prontuários, agenda, financeiro e muito mais.
        </p>
        <div style={{ marginTop: 48, display: 'flex', gap: 8 }}>
          {['Prontuário', 'Agenda', 'LGPD'].map((tag) => (
            <span key={tag} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 10px',
              borderRadius: 20, background: 'rgba(14,196,160,0.1)',
              border: '1px solid rgba(14,196,160,0.2)', color: 'var(--teal)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{
          width: '100%', maxWidth: 420,
          background: 'var(--bg-1)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', padding: '40px',
        }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, color: 'var(--text-1)', marginBottom: 8 }}>
            Entrar
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 32 }}>
            Acesse sua clínica com suas credenciais
          </p>

          <form onSubmit={handleSubmit((d) => login(d))} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="ID da clínica" icon={<Building2 size={15} />} error={errors.tenantId?.message}>
              <input {...register('tenantId')} placeholder="ex: demo" style={{ ...inputStyle, paddingLeft: 34 }} />
            </Field>
            <Field label="E-mail" icon={<Mail size={15} />} error={errors.email?.message}>
              <input {...register('email')} type="email" placeholder="seu@email.com" style={{ ...inputStyle, paddingLeft: 34 }} />
            </Field>
            <Field
              label="Senha"
              icon={<Lock size={15} />}
              error={errors.password?.message}
              iconRight={
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            >
              <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="••••••••" style={{ ...inputStyle, paddingLeft: 34, paddingRight: 36 }} />
            </Field>

            <button type="submit" disabled={isPending} style={{
              marginTop: 8, padding: '10px 20px',
              background: 'var(--teal)', color: 'var(--bg-0)',
              border: 'none', borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
              cursor: isPending ? 'not-allowed' : 'pointer',
              opacity: isPending ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 150ms',
            }}>
              {isPending && <Loader2 size={16} className="animate-spin" />}
              Entrar
            </button>

            <a href="#" style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', textDecoration: 'none', marginTop: 4 }}
              onClick={(e) => e.preventDefault()}>
              Esqueceu a senha?
            </a>
          </form>
        </div>
      </div>
    </div>
  )
}
