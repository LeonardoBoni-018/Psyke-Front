import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

function ThrowError({ message }: { message: string }): ReactNode {
  throw new Error(message)
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>Conteúdo normal</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('Conteúdo normal')).toBeInTheDocument()
  })

  it('renders fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Erro de teste" />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Algo deu errado')).toBeInTheDocument()
    expect(screen.getByText('Erro de teste')).toBeInTheDocument()
    expect(screen.getByText('Recarregar página')).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<p>Fallback customizado</p>}>
        <ThrowError message="Erro" />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Fallback customizado')).toBeInTheDocument()
    expect(screen.queryByText('Algo deu errado')).not.toBeInTheDocument()
  })
})
