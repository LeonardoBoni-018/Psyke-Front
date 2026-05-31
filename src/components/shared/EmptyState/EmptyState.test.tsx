import { render, screen } from '@testing-library/react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders default title and description', () => {
    render(<EmptyState description="Nada aqui" />)
    expect(screen.getByText('Nenhum dado encontrado')).toBeInTheDocument()
    expect(screen.getByText('Nada aqui')).toBeInTheDocument()
  })

  it('renders custom title', () => {
    render(<EmptyState title="Custom title" />)
    expect(screen.getByText('Custom title')).toBeInTheDocument()
  })
})
