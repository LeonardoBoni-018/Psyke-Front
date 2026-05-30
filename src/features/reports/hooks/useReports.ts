import { useQuery } from '@tanstack/react-query'
import { getClinicalReportSummary, getFinancialReportSummary } from '@/features/reports/services/reportsApi'
import type { ClinicalReportParams, FinancialReportParams } from '@/types/reports'

export const REPORTS_FINANCIAL_KEY = ['reports', 'financial'] as const
export const REPORTS_CLINICAL_KEY = ['reports', 'clinical'] as const

export function useFinancialReport(params: FinancialReportParams) {
  return useQuery({
    queryKey: [...REPORTS_FINANCIAL_KEY, params],
    queryFn: () => getFinancialReportSummary(params),
    staleTime: 1000 * 60 * 3,
  })
}

export function useClinicalReport(params: ClinicalReportParams) {
  return useQuery({
    queryKey: [...REPORTS_CLINICAL_KEY, params],
    queryFn: () => getClinicalReportSummary(params),
    staleTime: 1000 * 60 * 3,
  })
}
