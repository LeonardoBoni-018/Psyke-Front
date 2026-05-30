import { api } from '@/lib/axios'
import { listCharges, getFinancialSummary, createCharge, markChargePaid, exportCharge } from './financialApi'
import type { Charge } from '@/types/financial'
import type { PaginatedResponse } from '@/types/api'
import type { FinancialSummary } from './financialApi'

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

const mockCharge: Charge = {
  id: 'charge-1',
  patientId: 'patient-1',
  description: 'Consulta',
  amount: 200,
  dueDate: '2026-06-15',
  paid: false,
}

describe('financialApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('listCharges', () => {
    it('calls GET /financial/charges with params', async () => {
      const response: PaginatedResponse<Charge> = {
        content: [mockCharge],
        totalElements: 1,
        totalPages: 1,
        number: 0,
        size: 10,
      }
      vi.mocked(api.get).mockResolvedValue({ data: response })

      const result = await listCharges({ status: 'open', page: 0, size: 10 })
      expect(api.get).toHaveBeenCalledWith('/financial/charges', { params: { status: 'open', page: 0, size: 10 } })
      expect(result).toEqual(response)
    })

    it('works without params', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 } })
      await listCharges()
      expect(api.get).toHaveBeenCalledWith('/financial/charges', { params: undefined })
    })
  })

  describe('getFinancialSummary', () => {
    it('calls GET /financial/summary', async () => {
      const summary: FinancialSummary = {
        totalRevenue: 5000,
        totalReceivables: 2000,
        totalPaid: 3000,
        overdueAmount: 500,
        openInvoices: 10,
        revenueSeries: [{ month: '2026-05', amount: 5000 }],
      }
      vi.mocked(api.get).mockResolvedValue({ data: summary })

      const result = await getFinancialSummary()
      expect(api.get).toHaveBeenCalledWith('/financial/summary')
      expect(result).toEqual(summary)
    })
  })

  describe('createCharge', () => {
    it('calls POST /financial/charges with data', async () => {
      const payload = { patientId: 'patient-1', description: 'Consulta', amount: 200, dueDate: '2026-06-15' }
      vi.mocked(api.post).mockResolvedValue({ data: mockCharge })

      const result = await createCharge(payload)
      expect(api.post).toHaveBeenCalledWith('/financial/charges', payload)
      expect(result).toEqual(mockCharge)
    })
  })

  describe('markChargePaid', () => {
    it('calls PATCH /financial/charges/:id/pay', async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { ...mockCharge, paid: true } })

      const result = await markChargePaid('charge-1')
      expect(api.patch).toHaveBeenCalledWith('/financial/charges/charge-1/pay')
      expect(result.paid).toBe(true)
    })
  })

  describe('exportCharge', () => {
    it('calls GET /financial/charges/:id/export with blob responseType', async () => {
      const blob = new Blob(['pdf-content'], { type: 'application/pdf' })
      vi.mocked(api.get).mockResolvedValue({ data: blob })

      const result = await exportCharge('charge-1')
      expect(api.get).toHaveBeenCalledWith('/financial/charges/charge-1/export', { responseType: 'blob' })
      expect(result).toBe(blob)
    })
  })
})
