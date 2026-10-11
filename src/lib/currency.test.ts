import { formatCurrency } from './currency'

describe('formatCurrency', () => {
  it('uses Brazilian grouping and decimals', () => {
    expect(formatCurrency(2720).replace(/\s/g, ' ')).toBe('R$ 2.720,00')
    expect(formatCurrency('220.5').replace(/\s/g, ' ')).toBe('R$ 220,50')
  })

  it('returns a dash for missing or invalid values', () => {
    expect(formatCurrency(undefined)).toBe('—')
    expect(formatCurrency(null)).toBe('—')
    expect(formatCurrency('abc')).toBe('—')
  })
})
