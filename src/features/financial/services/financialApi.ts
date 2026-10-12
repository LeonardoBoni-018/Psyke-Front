import { api } from '@/lib/axios'
import type { Invoice, InvoiceStatus } from '@/types/financial'
import type { PaginatedResponse } from '@/types/api'

export interface InvoiceListParams {
  status?: InvoiceStatus
  patientId?: string
  page?: number
  size?: number
}

export interface FinancialSummary {
  /** Revenue received in the current month. */
  monthlyRevenue: number
  /** Total of invoices still PENDING. */
  pendingAmount: number
  pendingCount: number
  paidCount: number
}

export interface CreateInvoicePayload {
  patientId: string
  professionalId: string
  amount: number
  paymentMethod?: string
  notes?: string
}

export async function listInvoices(params?: InvoiceListParams): Promise<PaginatedResponse<Invoice>> {
  const response = await api.get<PaginatedResponse<Invoice>>('/invoices', {
    params: { sort: 'createdAt,desc', ...params },
  })
  return response.data
}

/** There is no dedicated summary endpoint: combine the dashboard totals with two cheap count queries. */
export async function getFinancialSummary(): Promise<FinancialSummary> {
  const [dashboard, pending, paid] = await Promise.all([
    api.get<{ monthlyRevenue: number; pendingAmount: number }>('/dashboard'),
    api.get<PaginatedResponse<Invoice>>('/invoices', { params: { status: 'PENDING', size: 1 } }),
    api.get<PaginatedResponse<Invoice>>('/invoices', { params: { status: 'PAID', size: 1 } }),
  ])
  return {
    monthlyRevenue: Number(dashboard.data.monthlyRevenue ?? 0),
    pendingAmount: Number(dashboard.data.pendingAmount ?? 0),
    pendingCount: pending.data.totalElements,
    paidCount: paid.data.totalElements,
  }
}

export async function createInvoice(data: CreateInvoicePayload): Promise<Invoice> {
  const response = await api.post<Invoice>('/invoices', data)
  return response.data
}

export async function markInvoicePaid(id: string, paymentMethod?: string): Promise<Invoice> {
  const response = await api.put<Invoice>(`/invoices/${id}`, {
    status: 'PAID',
    paymentDate: new Date().toISOString(),
    ...(paymentMethod ? { paymentMethod } : {}),
  })
  return response.data
}

export async function cancelInvoice(id: string): Promise<Invoice> {
  const response = await api.put<Invoice>(`/invoices/${id}`, { status: 'CANCELLED' })
  return response.data
}

export async function exportInvoicePdf(id: string): Promise<Blob> {
  const response = await api.get<Blob>(`/export/pdf/invoices/${id}`, { responseType: 'blob' })
  return response.data
}
