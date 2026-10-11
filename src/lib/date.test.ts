import { formatDate } from './date'

describe('formatDate', () => {
  it('keeps date-only values on the same calendar day (no UTC shift)', () => {
    expect(formatDate('1991-03-12')).toBe('12/03/1991')
    expect(formatDate('2026-01-01')).toBe('01/01/2026')
  })

  it('formats date-times in local time', () => {
    expect(formatDate('2026-07-01T09:30:00', 'dd/MM/yyyy HH:mm')).toBe('01/07/2026 09:30')
  })

  it('returns a dash for empty or invalid input', () => {
    expect(formatDate(undefined)).toBe('—')
    expect(formatDate(null)).toBe('—')
    expect(formatDate('')).toBe('—')
    expect(formatDate('not-a-date')).toBe('—')
  })
})
