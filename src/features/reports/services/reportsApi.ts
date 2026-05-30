import { api } from '@/lib/axios'
import type {
  ClinicalReportParams,
  ClinicalReportSummary,
  FinancialReportParams,
  FinancialReportSummary,
} from '@/types/reports'

export async function getFinancialReportSummary(
  params: FinancialReportParams,
): Promise<FinancialReportSummary> {
  const response = await api.get<FinancialReportSummary>('/reports/financial', {
    params,
  })
  return response.data
}

export async function getClinicalReportSummary(
  params: ClinicalReportParams,
): Promise<ClinicalReportSummary> {
  const response = await api.get<ClinicalReportSummary>('/reports/clinical', {
    params,
  })
  return response.data
}
