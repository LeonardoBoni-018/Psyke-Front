import { useQuery } from '@tanstack/react-query'
import { getDashboardSummary, getTodaySessions } from '@/features/dashboard/services/dashboardApi'

export const DASHBOARD_SUMMARY_KEY = ['dashboard', 'summary'] as const
export const DASHBOARD_TODAY_KEY = ['dashboard', 'today-sessions'] as const

export function useDashboardSummary() {
  return useQuery({
    queryKey: DASHBOARD_SUMMARY_KEY,
    queryFn: getDashboardSummary,
    staleTime: 30_000,
    retry: 1,
  })
}

export function useTodaySessions() {
  return useQuery({
    queryKey: DASHBOARD_TODAY_KEY,
    queryFn: getTodaySessions,
    staleTime: 60_000,
    retry: 1,
    refetchInterval: 5 * 60 * 1000,
  })
}
