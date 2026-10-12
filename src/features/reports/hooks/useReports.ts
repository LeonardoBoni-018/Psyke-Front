import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { exportReportCsv, getReportSummary } from '@/features/reports/services/reportsApi'
import { getApiErrorMessage } from '@/lib/errors'
import type { ReportExport, ReportParams } from '@/types/reports'

export const REPORTS_SUMMARY_KEY = ['reports', 'summary'] as const

export function useReportSummary(params: ReportParams) {
  return useQuery({
    queryKey: [...REPORTS_SUMMARY_KEY, params],
    queryFn: () => getReportSummary(params),
    staleTime: 1000 * 60 * 3,
    // Keep the previous period on screen while a new one loads, so the layout does not jump.
    placeholderData: keepPreviousData,
  })
}

export function useExportReport() {
  return useMutation({
    mutationFn: ({ kind, params }: { kind: ReportExport; params: ReportParams }) => exportReportCsv(kind, params),
    onError: (error) => toast.error('Não foi possível exportar', { description: getApiErrorMessage(error) }),
  })
}
