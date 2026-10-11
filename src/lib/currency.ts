const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** 2720 -> "R$ 2.720,00". Non-numeric input renders as a dash. */
export function formatCurrency(value?: number | string | null): string {
  if (value === null || value === undefined || value === '') return '—'
  const n = Number(value)
  return Number.isFinite(n) ? brl.format(n) : '—'
}
