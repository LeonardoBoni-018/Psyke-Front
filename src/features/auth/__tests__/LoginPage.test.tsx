import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginPage from '../pages/LoginPage'
import type { ReactNode } from 'react'

vi.mock('../hooks/useAuth', () => ({
  useLogin: () => ({ mutate: vi.fn(), isPending: false }),
}))

function wrap(ui: ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('LoginPage', () => {
  it('renders brand section with Psyke logo', () => {
    wrap(<LoginPage />)
    expect(screen.getByText('Psyke')).toBeInTheDocument()
    expect(screen.getByText('Clinic OS — v2.0')).toBeInTheDocument()
  })

  it('renders all form fields', () => {
    wrap(<LoginPage />)
    expect(screen.getByPlaceholderText('ex: demo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    wrap(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    await waitFor(() => {
      expect(screen.getByText('ID da clínica obrigatório')).toBeInTheDocument()
    })
  })

  it('shows email validation error for invalid email', async () => {
    wrap(<LoginPage />)
    const emailInput = screen.getByPlaceholderText('seu@email.com')
    fireEvent.change(emailInput, { target: { value: 'invalid' } })
    fireEvent.submit(emailInput.closest('form')!)
    await waitFor(() => {
      expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
    })
  })

  it('toggles password visibility', () => {
    wrap(<LoginPage />)
    const input = screen.getByPlaceholderText('••••••••') as HTMLInputElement
    expect(input.type).toBe('password')
    const buttons = screen.getAllByRole('button')
    const toggleBtn = buttons.find((b) => b.querySelector('svg'))
    if (toggleBtn) fireEvent.click(toggleBtn)
    expect(input.type).toBe('text')
  })

  it('renders feature tags', () => {
    wrap(<LoginPage />)
    expect(screen.getByText('Prontuário')).toBeInTheDocument()
    expect(screen.getByText('Agenda')).toBeInTheDocument()
    expect(screen.getByText('LGPD')).toBeInTheDocument()
  })
})
