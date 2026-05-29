export type Response<T> = {
  data: T
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
  }
}
