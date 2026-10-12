import { api } from '@/lib/axios'
import type { ReportExport, ReportParams, ReportSummary } from '@/types/reports'

export async function getReportSummary(params: ReportParams): Promise<ReportSummary> {
  const response = await api.get<ReportSummary>('/reports/summary', { params })
  return response.data
}

/** Downloads a CSV export (`appointments` or `invoices`) for the period as a Blob. */
export async function exportReportCsv(kind: ReportExport, params: ReportParams): Promise<Blob> {
  const response = await api.get<Blob>(`/reports/${kind}`, { params, responseType: 'blob' })
  return response.data
}
