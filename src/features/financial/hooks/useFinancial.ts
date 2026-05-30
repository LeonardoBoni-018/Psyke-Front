import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createCharge,
  exportCharge,
  getFinancialSummary,
  listCharges,
  markChargePaid,
} from '@/features/financial/services/financialApi'
import type { ChargeListParams } from '@/features/financial/services/financialApi'

export const FINANCIAL_CHARGES_KEY = ['financial', 'charges'] as const
export const FINANCIAL_SUMMARY_KEY = ['financial', 'summary'] as const

export function useFinancialSummary() {
  return useQuery({
    queryKey: FINANCIAL_SUMMARY_KEY,
    queryFn: getFinancialSummary,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCharges(params?: ChargeListParams) {
  return useQuery({
    queryKey: [...FINANCIAL_CHARGES_KEY, params],
    queryFn: () => listCharges(params),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateCharge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCharge,
    onSuccess: () => {
      toast.success('Cobrança criada com sucesso')
      queryClient.invalidateQueries({ queryKey: FINANCIAL_CHARGES_KEY })
      queryClient.invalidateQueries({ queryKey: FINANCIAL_SUMMARY_KEY })
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar cobrança', { description: error.message })
    },
  })
}

export function useMarkChargePaid() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markChargePaid,
    onSuccess: () => {
      toast.success('Cobrança marcada como paga')
      queryClient.invalidateQueries({ queryKey: FINANCIAL_CHARGES_KEY })
      queryClient.invalidateQueries({ queryKey: FINANCIAL_SUMMARY_KEY })
    },
    onError: (error: Error) => {
      toast.error('Erro ao marcar cobrança', { description: error.message })
    },
  })
}

export function useExportCharge() {
  return useMutation({
    mutationFn: exportCharge,
    onError: (error: Error) => {
      toast.error('Erro ao exportar cobrança', { description: error.message })
    },
  })
}
