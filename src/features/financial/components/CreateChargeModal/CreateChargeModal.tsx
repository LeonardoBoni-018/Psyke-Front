import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { CreateInvoicePayload } from '@/features/financial/services/financialApi'

interface Option {
  id: string
  name: string
}

interface CreateChargeModalProps {
  patients: Option[]
  professionals: Option[]
  /** Suggested amount for the selected professional (their session value), when known. */
  suggestedAmount?: (professionalId: string) => number | undefined
  submitting?: boolean
  onCreate: (payload: CreateInvoicePayload) => void
  onClose: () => void
}

const methods = [
  { value: '', label: 'Definir depois' },
  { value: 'pix', label: 'Pix' },
  { value: 'credit_card', label: 'Cartão de crédito' },
  { value: 'debit_card', label: 'Cartão de débito' },
  { value: 'cash', label: 'Dinheiro' },
  { value: 'insurance', label: 'Convênio' },
]

const fieldClass =
  'mt-1.5 h-10 w-full rounded-lg border border-border bg-bg-1 px-3 text-[14px] text-text-1 shadow-sm outline-none transition focus:border-brand focus:shadow-focus'

export function CreateChargeModal({ patients, professionals, suggestedAmount, submitting, onCreate, onClose }: CreateChargeModalProps) {
  const [patientId, setPatientId] = useState(patients[0]?.id ?? '')
  const [professionalId, setProfessionalId] = useState(professionals[0]?.id ?? '')
  const [amount, setAmount] = useState(() => {
    const s = professionals[0] && suggestedAmount?.(professionals[0].id)
    return s ? String(s).replace('.', ',') : ''
  })
  const [method, setMethod] = useState('')
  const [notes, setNotes] = useState('')

  const value = Number(amount.replace(/\./g, '').replace(',', '.'))
  const canSubmit = !!patientId && !!professionalId && Number.isFinite(value) && value > 0

  const onProfessionalChange = (id: string) => {
    setProfessionalId(id)
    const suggestion = suggestedAmount?.(id)
    if (suggestion && !amount) setAmount(String(suggestion).replace('.', ','))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onCreate({
      patientId,
      professionalId,
      amount: value,
      paymentMethod: method || undefined,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="animate-fade-in fixed inset-0 z-[80] bg-[var(--scrim)] backdrop-blur-[2px]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="animate-pop-in fixed left-1/2 top-1/2 z-[81] max-h-[92dvh] w-[calc(100vw-24px)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-bg-1 p-6 shadow-lg"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="font-display text-[22px] font-semibold tracking-tight text-text-1">Nova cobrança</Dialog.Title>
              <p className="mt-1 text-[13px] text-text-2">Registre uma cobrança para um paciente.</p>
            </div>
            <Dialog.Close
              aria-label="Fechar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-3 transition hover:bg-bg-2 hover:text-text-1"
            >
              <X size={18} />
            </Dialog.Close>
          </div>

          <form onSubmit={submit} className="grid gap-4">
            <label className="block text-[13px] font-medium text-text-2">
              Paciente
              <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className={fieldClass}>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>

            <label className="block text-[13px] font-medium text-text-2">
              Profissional
              <select value={professionalId} onChange={(e) => onProfessionalChange(e.target.value)} className={fieldClass}>
                {professionals.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-[13px] font-medium text-text-2">
                Valor (R$)
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="decimal"
                  placeholder="0,00"
                  className={fieldClass}
                />
              </label>
              <label className="block text-[13px] font-medium text-text-2">
                Forma de pagamento
                <select value={method} onChange={(e) => setMethod(e.target.value)} className={fieldClass}>
                  {methods.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block text-[13px] font-medium text-text-2">
              Observação <span className="font-normal text-text-3">(opcional)</span>
              <input value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={200} placeholder="Ex.: sessão de acompanhamento" className={fieldClass} />
            </label>

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="mt-1 inline-flex h-11 items-center justify-center rounded-lg bg-brand px-4 text-[14px] font-semibold text-on-brand shadow-sm transition hover:bg-brand-hi active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Criando…' : 'Criar cobrança'}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
