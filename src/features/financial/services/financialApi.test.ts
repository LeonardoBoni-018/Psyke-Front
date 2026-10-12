import { api } from '@/lib/axios'
import {
  cancelInvoice,
  createInvoice,
  exportInvoicePdf,
  getFinancialSummary,
  listInvoices,
  markInvoicePaid,
} from './financialApi'
import type { Invoice } from '@/types/financial'
import type { PaginatedResponse } from '@/types/api'

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

const invoice: Invoice = {
  id: 'inv-1',
  patientId: 'p1',
  professionalId: 'pr1',
  amount: 200,
  status: 'PENDING',
  createdAt: '2026-06-01T10:00:00Z',
  updatedAt: '2026-06-01T10:00:00Z',
}

const page = (content: Invoice[], totalElements = content.length): PaginatedResponse<Invoice> => ({
  content,
  totalElements,
  totalPages: 1,
  number: 0,
  size: 10,
})

describe('financialApi (talks to /invoices)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists invoices newest first with the given filters', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: page([invoice]) })

    const result = await listInvoices({ status: 'PENDING', page: 1, size: 10 })

    expect(api.get).toHaveBeenCalledWith('/invoices', {
      params: { sort: 'createdAt,desc', status: 'PENDING', page: 1, size: 10 },
    })
    expect(result.content[0].id).toBe('inv-1')
  })

  it('builds the summary from the dashboard totals plus pending/paid counts', async () => {
    vi.mocked(api.get).mockImplementation((url: string, config?: { params?: { status?: string } }) => {
      if (url === '/dashboard') return Promise.resolve({ data: { monthlyRevenue: '3200.00', pendingAmount: 2720 } })
      return Promise.resolve({ data: page([], config?.params?.status === 'PENDING' ? 7 : 50) })
    })

    const summary = await getFinancialSummary()

    expect(summary).toEqual({ monthlyRevenue: 3200, pendingAmount: 2720, pendingCount: 7, paidCount: 50 })
  })

  it('creates an invoice with POST /invoices', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: invoice })

    await createInvoice({ patientId: 'p1', professionalId: 'pr1', amount: 200 })

    expect(api.post).toHaveBeenCalledWith('/invoices', { patientId: 'p1', professionalId: 'pr1', amount: 200 })
  })

  it('marks an invoice as paid with the payment date', async () => {
    vi.mocked(api.put).mockResolvedValue({ data: { ...invoice, status: 'PAID' } })

    await markInvoicePaid('inv-1')

    const [url, body] = vi.mocked(api.put).mock.calls[0] as [string, { status: string; paymentDate: string }]
    expect(url).toBe('/invoices/inv-1')
    expect(body.status).toBe('PAID')
    expect(Number.isNaN(Date.parse(body.paymentDate))).toBe(false)
  })

  it('cancels an invoice', async () => {
    vi.mocked(api.put).mockResolvedValue({ data: { ...invoice, status: 'CANCELLED' } })

    await cancelInvoice('inv-1')

    expect(api.put).toHaveBeenCalledWith('/invoices/inv-1', { status: 'CANCELLED' })
  })

  it('downloads the PDF as a blob', async () => {
    const blob = new Blob(['pdf'])
    vi.mocked(api.get).mockResolvedValue({ data: blob })

    const result = await exportInvoicePdf('inv-1')

    expect(api.get).toHaveBeenCalledWith('/export/pdf/invoices/inv-1', { responseType: 'blob' })
    expect(result).toBe(blob)
  })
})
