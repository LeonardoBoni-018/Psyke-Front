import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { QueryProvider } from './providers/QueryProvider'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { router } from './Router'

export function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <RouterProvider router={router} />
        <Toaster
          richColors
          closeButton
          position="top-right"
          toastOptions={{ style: { fontFamily: 'var(--font-sans)' } }}
        />
      </QueryProvider>
    </ErrorBoundary>
  )
}
