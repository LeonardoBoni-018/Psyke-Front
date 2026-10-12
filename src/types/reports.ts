/** Matches the API's ReportSummaryResponse (`GET /reports/summary`). */
export interface ReportSummary {
  from: string
  to: string
  /** Paid revenue in the period. */
  revenue: number
  /** Invoices issued in the period that are still pending. */
  pendingAmount: number
  invoicesByStatus: Record<string, number>
  totalAppointments: number
  appointmentsByStatus: Record<string, number>
  /** DONE / (DONE + NO_SHOW), 0-100. */
  attendanceRate: number
  /** CANCELLED / total, 0-100. */
  cancellationRate: number
  newPatients: number
  activePatients: number
  revenueByMonth: Array<{ month: string; amount: number }>
  sessionsByProfessional: Array<{ professionalId: string; name: string; sessions: number }>
}

export interface ReportParams {
  /** ISO date, yyyy-MM-dd. */
  from: string
  to: string
}

export type ReportExport = 'appointments' | 'invoices'
