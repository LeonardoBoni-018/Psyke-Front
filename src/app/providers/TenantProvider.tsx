import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

interface Tenant {
  id: string
  name: string
}

interface TenantContextValue {
  currentTenant: Tenant
  switchTenant: (tenant: Tenant) => void
}

const TenantContext = createContext<TenantContextValue | null>(null)

interface TenantProviderProps {
  children: ReactNode
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [currentTenant, setCurrentTenant] = useState<Tenant>({
    id: 'default',
    name: 'Psyke Clinic',
  })

  const value = useMemo(
    () => ({
      currentTenant,
      switchTenant: (tenant: Tenant) => setCurrentTenant(tenant),
    }),
    [currentTenant],
  )

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider')
  }
  return context
}
