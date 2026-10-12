export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED'

/** Matches the API's InvoiceResponse (`/invoices`). */
export interface Invoice {
  id: string
  patientId: string
  professionalId: string
  appointmentId?: string | null
  amount: number
  status: InvoiceStatus
  paymentMethod?: string | null
  paymentDate?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  patientName?: string | null
  professionalName?: string | null
}
