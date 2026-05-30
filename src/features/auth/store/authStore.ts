import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types/auth'

interface AuthState {
  token: string | null
  refreshToken: string | null
  tenantId: string | null
  user: User | null
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: User) => void
  logout: () => void
  isAuthenticated: () => boolean
  hasRole: (role: UserRole) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      tenantId: null,
      user: null,
      setTokens: (accessToken: string, refreshToken: string) =>
        set(() => ({ token: accessToken, refreshToken })),
      setUser: (user: User) =>
        set(() => ({ user, tenantId: user.tenantId })),
      logout: () =>
        set(() => ({ token: null, refreshToken: null, tenantId: null, user: null })),
      isAuthenticated: () => Boolean(get().token),
      hasRole: (role: UserRole) => get().user?.roles.includes(role) ?? false,
    }),
    {
      name: 'psyke-auth',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        tenantId: state.tenantId,
        user: state.user,
      }),
    },
  ),
)
