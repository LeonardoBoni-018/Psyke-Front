import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  cancelInvoice,
  createInvoice,
  exportInvoicePdf,
  getFinancialSummary,
  listInvoices,
  markInvoicePaid,
} from '@/features/financial/services/financialApi'
import type { InvoiceListParams } from '@/features/financial/services/financialApi'
import { getApiErrorMessage } from '@/lib/errors'

export const INVOICES_KEY = ['financial', 'invoices'] as const
export const FINANCIAL_SUMMARY_KEY = ['financial', 'summary'] as const

export function useFinancialSummary() {
  return useQuery({
    queryKey: FINANCIAL_SUMMARY_KEY,
    queryFn: getFinancialSummary,
    staleTime: 1000 * 60,
  })
}

export function useInvoices(params?: InvoiceListParams) {
  return useQuery({
    queryKey: [...INVOICES_KEY, params],
    queryFn: () => listInvoices(params),
    staleTime: 1000 * 30,
  })
}

function useRefreshFinancial() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: INVOICES_KEY })
    void queryClient.invalidateQueries({ queryKey: FINANCIAL_SUMMARY_KEY })
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }
}

export function useCreateInvoice() {
  const refresh = useRefreshFinancial()
  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      toast.success('Cobrança criada')
      refresh()
    },
    onError: (error) => toast.error('Não foi possível criar a cobrança', { description: getApiErrorMessage(error) }),
  })
}

export function useMarkInvoicePaid() {
  const refresh = useRefreshFinancial()
  return useMutation({
    mutationFn: (id: string) => markInvoicePaid(id),
    onSuccess: () => {
      toast.success('Cobrança marcada como paga')
      refresh()
    },
    onError: (error) => toast.error('Não foi possível atualizar a cobrança', { description: getApiErrorMessage(error) }),
  })
}

export function useCancelInvoice() {
  const refresh = useRefreshFinancial()
  return useMutation({
    mutationFn: cancelInvoice,
    onSuccess: () => {
      toast.success('Cobrança cancelada')
      refresh()
    },
    onError: (error) => toast.error('Não foi possível cancelar a cobrança', { description: getApiErrorMessage(error) }),
  })
}

export function useExportInvoice() {
  return useMutation({
    mutationFn: exportInvoicePdf,
    onError: (error) => toast.error('Não foi possível gerar o PDF', { description: getApiErrorMessage(error) }),
  })
}
