export interface FinancialReportSummary {
  totalRevenue: number
  totalReceivables: number
  totalPaid: number
  overdueAmount: number
  openInvoices: number
  revenueSeries: Array<{ month: string; amount: number }>
}

export interface ClinicalReportSummary {
  adherenceRate: number
  activeRecords: number
  newPatients: number
  topDiagnoses: Array<{ name: string; count: number }>
}

export interface FinancialReportParams {
  from: string
  to: string
}

export interface ClinicalReportParams {
  from: string
  to: string
  professionalId?: string
}
