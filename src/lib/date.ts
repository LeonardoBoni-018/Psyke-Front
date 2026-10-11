import { format, isValid, parseISO } from 'date-fns'

/**
 * Formats an ISO date or date-time as dd/MM/yyyy in the user's local time zone.
 *
 * `new Date('1991-03-12')` is parsed as UTC midnight, which shows as the previous day in Brazil (UTC-3).
 * `parseISO` treats date-only strings as local dates, so birth dates and due dates stay correct.
 */
export function formatDate(value?: string | null, pattern = 'dd/MM/yyyy'): string {
  if (!value) return '—'
  const date = parseISO(value)
  return isValid(date) ? format(date, pattern) : '—'
}
