import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
      queryClient.invalidateQueries({ queryKey: FINANCIAL_CHARGES_KEY })
      queryClient.invalidateQueries({ queryKey: FINANCIAL_SUMMARY_KEY })
    },
  })
}

export function useMarkChargePaid() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markChargePaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCIAL_CHARGES_KEY })
      queryClient.invalidateQueries({ queryKey: FINANCIAL_SUMMARY_KEY })
    },
  })
}

export function useExportCharge() {
  return useMutation({
    mutationFn: exportCharge,
  })
}
