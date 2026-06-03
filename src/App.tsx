import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from './app/providers/QueryProvider'
import { AuthProvider } from './app/providers/AuthProvider'
import { TenantProvider } from './app/providers/TenantProvider'
import { router } from './app/Router'

if (import.meta.env.DEV) {
  import('@/scripts/index')
}

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <TenantProvider>
          <RouterProvider router={router} />
        </TenantProvider>
      </AuthProvider>
    </QueryProvider>
  )
}

export default App
