import { api } from '@/lib/axios'

export interface DashboardSummary {
  totalPatients: number
  activePatients: number
  sessionsToday: number
  pendingConfirmations: number
  totalAppointmentsMonth: number
  revenueMonth: number
}

export interface TodaySession {
  id: string
  patientName: string
  professionalName: string
  startTime: string
  endTime: string
  status: string
  approach?: string
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get<DashboardSummary>('/dashboard/summary')
  return response.data
}

export async function getTodaySessions(): Promise<TodaySession[]> {
  const response = await api.get<TodaySession[]>('/dashboard/today-sessions')
  return response.data
}
