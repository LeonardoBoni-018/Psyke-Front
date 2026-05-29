import { QueryProvider } from './app/providers/QueryProvider'
import { AuthProvider } from './app/providers/AuthProvider'
import { TenantProvider } from './app/providers/TenantProvider'
import { Router } from './app/Router'

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
