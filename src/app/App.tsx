import { QueryProvider } from './providers/QueryProvider'
import { AuthProvider } from './providers/AuthProvider'
import { TenantProvider } from './providers/TenantProvider'
import { Router } from './Router'

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <TenantProvider>
          <Router />
        </TenantProvider>
      </AuthProvider>
    </QueryProvider>
  )
}

export default App
