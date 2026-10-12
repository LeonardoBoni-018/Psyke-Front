import { api } from '@/lib/axios'
import { format } from 'date-fns'
import type { AppointmentResponse } from '@/types/appointment'

/** The API stores appointment times as local date-times without a zone, so send them the same way. */
const toLocalParam = (d: Date) => format(d, "yyyy-MM-dd'T'HH:mm:ss")

export interface DashboardSummary {
  totalPatients: number
  totalProfessionals: number
  todayAppointments: number
  appointmentsByStatus: Record<string, number>
  monthlyRevenue: number
  pendingAmount: number
}

export const dashboardApi = {
  getSummary: () =>
    api.get<DashboardSummary>('/dashboard').then((r) => r.data),

  getTodaySessions: () => {
    const today = new Date()
    const from = new Date(today)
    from.setHours(0, 0, 0, 0)
    const to = new Date(today)
    to.setHours(23, 59, 59, 999)
    return api.get<AppointmentResponse[]>('/appointments', {
      params: { from: toLocalParam(from), to: toLocalParam(to) },
    }).then((r) => r.data)
  },

  getRange: (from: Date, to: Date) =>
    api.get<AppointmentResponse[]>('/appointments', {
      params: { from: toLocalParam(from), to: toLocalParam(to) },
    }).then((r) => r.data),
}

export const getDashboardSummary = dashboardApi.getSummary
export const getTodaySessions = dashboardApi.getTodaySessions
