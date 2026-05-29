import { useMemo } from 'react'

interface PaginationOptions {
  total: number
  page: number
  pageSize: number
}

export function usePagination({ total, page, pageSize }: PaginationOptions) {
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])
  const hasNext = page < totalPages
  const hasPrevious = page > 1

  return {
    totalPages,
    hasNext,
    hasPrevious,
    page,
    pageSize,
  }
}
