import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('renders with default label for known status', () => {
    render(<StatusBadge status="ACTIVE" />)
    expect(screen.getByText('Ativo')).toBeInTheDocument()
  })

  it('renders with custom label', () => {
    render(<StatusBadge status="ACTIVE" label="Custom" />)
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })

  it('renders raw status when no default label exists', () => {
    render(<StatusBadge status="UNKNOWN" />)
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument()
  })

  it('applies sm size class', () => {
    const { container } = render(<StatusBadge status="ACTIVE" size="sm" />)
    const span = container.firstChild as HTMLElement
    expect(span.className).toContain('text-[10px]')
  })
})
