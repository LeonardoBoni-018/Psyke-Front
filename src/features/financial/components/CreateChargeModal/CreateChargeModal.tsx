import { useMemo, useState } from 'react'

interface CreateChargeModalProps {
  patients: Array<{ id: string; name: string }>
  onCreate: (payload: { patientId: string; description: string; amount: number; dueDate: string }) => void
  onClose: () => void
}

export function CreateChargeModal({ patients, onCreate, onClose }: CreateChargeModalProps) {
  const [patientId, setPatientId] = useState(patients[0]?.id ?? '')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')

  const canSubmit = useMemo(
    () => !!patientId && !!description && !!amount && !!dueDate,
    [patientId, description, amount, dueDate],
  )

  const handleSubmit = () => {
    if (!canSubmit) return
    onCreate({
      patientId,
      description,
      amount: Number(amount.replace(',', '.')),
      dueDate,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-[var(--radius-2xl)] border border-border bg-bg-0 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-text-1">Nova cobrança</h2>
            <p className="text-sm text-text-3">Registre uma fatura para um paciente.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-3 py-2 text-sm text-text-2 transition hover:border-border-hi hover:text-text-1"
          >
            Fechar
          </button>
        </div>

        <div className="grid gap-4">
          <label className="block text-sm text-text-2">
            Paciente
            <select
              value={patientId}
              onChange={(event) => setPatientId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-bg-1 px-4 py-3 text-text-1"
            >
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-text-2">
            Descrição
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-bg-1 px-4 py-3 text-text-1"
              placeholder="Ex: Consulta psicológica"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-text-2">
              Valor
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-bg-1 px-4 py-3 text-text-1"
                placeholder="0,00"
                inputMode="decimal"
              />
            </label>
            <label className="block text-sm text-text-2">
              Data de vencimento
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-bg-1 px-4 py-3 text-text-1"
              />
            </label>
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-teal px-4 py-3 text-sm font-semibold text-bg-0 transition disabled:cursor-not-allowed disabled:bg-teal/50"
          >
            Criar cobrança
          </button>
        </div>
      </div>
    </div>
  )
}
