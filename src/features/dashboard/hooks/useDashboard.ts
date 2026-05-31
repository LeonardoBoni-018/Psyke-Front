import { useQuery } from '@tanstack/react-query'
import { getDashboardSummary, getTodaySessions } from '@/features/dashboard/services/dashboardApi'
import type { DashboardSummary, TodaySession } from '@/features/dashboard/services/dashboardApi'

export const DASHBOARD_SUMMARY_KEY = ['dashboard', 'summary'] as const
export const DASHBOARD_TODAY_KEY = ['dashboard', 'today'] as const

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: DASHBOARD_SUMMARY_KEY,
    queryFn: getDashboardSummary,
    staleTime: 1000 * 60 * 2,
  })
}

export function useTodaySessions() {
  return useQuery<TodaySession[]>({
    queryKey: DASHBOARD_TODAY_KEY,
    queryFn: getTodaySessions,
    staleTime: 1000 * 60,
  })
}
