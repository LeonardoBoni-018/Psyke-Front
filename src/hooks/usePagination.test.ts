import { renderHook } from '@testing-library/react'
import { usePagination } from './usePagination'

describe('usePagination', () => {
  it('returns page 1 of 5 for 50 items with pageSize 10', () => {
    const { result } = renderHook(() => usePagination({ total: 50, page: 1, pageSize: 10 }))
    expect(result.current.totalPages).toBe(5)
    expect(result.current.hasNext).toBe(true)
    expect(result.current.hasPrevious).toBe(false)
  })

  it('returns last page correctly', () => {
    const { result } = renderHook(() => usePagination({ total: 30, page: 3, pageSize: 10 }))
    expect(result.current.totalPages).toBe(3)
    expect(result.current.hasNext).toBe(false)
    expect(result.current.hasPrevious).toBe(true)
  })

  it('handles single page', () => {
    const { result } = renderHook(() => usePagination({ total: 5, page: 1, pageSize: 10 }))
    expect(result.current.totalPages).toBe(1)
    expect(result.current.hasNext).toBe(false)
    expect(result.current.hasPrevious).toBe(false)
  })

  it('handles zero total', () => {
    const { result } = renderHook(() => usePagination({ total: 0, page: 1, pageSize: 10 }))
    expect(result.current.totalPages).toBe(1)
    expect(result.current.hasNext).toBe(false)
    expect(result.current.hasPrevious).toBe(false)
  })

  it('handles partial last page', () => {
    const { result } = renderHook(() => usePagination({ total: 12, page: 2, pageSize: 10 }))
    expect(result.current.totalPages).toBe(2)
    expect(result.current.hasNext).toBe(false)
    expect(result.current.hasPrevious).toBe(true)
  })

  it('returns pagination state object with all expected keys', () => {
    const { result } = renderHook(() => usePagination({ total: 100, page: 2, pageSize: 20 }))
    expect(result.current).toEqual({
      totalPages: 5,
      hasNext: true,
      hasPrevious: true,
      page: 2,
      pageSize: 20,
    })
  })
})
