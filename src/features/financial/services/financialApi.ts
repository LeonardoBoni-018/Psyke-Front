import { api } from '@/lib/axios'
import type { Charge } from '@/types/financial'
import type { PaginatedResponse } from '@/types/api'

export interface ChargeListParams {
  status?: 'open' | 'paid' | 'overdue'
  page?: number
  size?: number
  search?: string
}

export interface FinancialSummary {
  totalRevenue: number
  totalReceivables: number
  totalPaid: number
  overdueAmount: number
  openInvoices: number
  revenueSeries: Array<{ month: string; amount: number }>
}

export async function listCharges(params?: ChargeListParams): Promise<PaginatedResponse<Charge>> {
  const response = await api.get<PaginatedResponse<Charge>>('/financial/charges', {
    params,
  })
  return response.data
}

export async function getFinancialSummary(): Promise<FinancialSummary> {
  const response = await api.get<FinancialSummary>('/financial/summary')
  return response.data
}

export async function createCharge(data: {
  patientId: string
  description: string
  amount: number
  dueDate: string
}): Promise<Charge> {
  const response = await api.post<Charge>('/financial/charges', data)
  return response.data
}

export async function markChargePaid(id: string): Promise<Charge> {
  const response = await api.patch<Charge>(`/financial/charges/${id}/pay`)
  return response.data
}

export async function exportCharge(id: string): Promise<Blob> {
  const response = await api.get<Blob>(`/financial/charges/${id}/export`, {
    responseType: 'blob',
  })
  return response.data
}
