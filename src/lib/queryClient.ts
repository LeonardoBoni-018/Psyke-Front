import { MutationCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/errors'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** Set when the caller renders the error itself (e.g. inline on a form). */
      silent?: boolean
    }
  }
}

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    // Every failed mutation tells the user why, unless it opts out or already handles its own error.
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.silent || mutation.options.onError) return
      toast.error(getApiErrorMessage(error))
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 5,
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
