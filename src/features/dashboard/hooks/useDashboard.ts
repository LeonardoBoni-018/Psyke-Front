import { useQuery } from '@tanstack/react-query'
import { addDays, endOfDay, startOfDay } from 'date-fns'
import { dashboardApi, getDashboardSummary, getTodaySessions } from '@/features/dashboard/services/dashboardApi'

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

export const DASHBOARD_WINDOW_KEY = ['dashboard', 'window'] as const

/** Appointments from `daysBack` days ago to `daysAhead` days from now (one request feeds the whole dashboard). */
export function useAgendaWindow(daysBack = 6, daysAhead = 7) {
  const day = startOfDay(new Date()).getTime()
  return useQuery({
    queryKey: [...DASHBOARD_WINDOW_KEY, day, daysBack, daysAhead],
    queryFn: () => dashboardApi.getRange(startOfDay(addDays(new Date(day), -daysBack)), endOfDay(addDays(new Date(day), daysAhead))),
    staleTime: 60_000,
    refetchInterval: 5 * 60 * 1000,
  })
}
