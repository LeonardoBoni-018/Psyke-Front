import { useAuthStore } from './authStore'
import type { UserResponse } from '@/types/auth'

const mockUser: UserResponse = {
  id: 'user-1',
  tenantId: 'tenant-1',
  fullName: 'Dr. Test',
  email: 'test@psyke.com',
  roles: ['ROLE_PROFESSIONAL'],
}

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, refreshToken: null, tenantId: null, user: null })
  })

  it('starts unauthenticated', () => {
    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated()).toBe(false)
  })

  it('setTokens stores tokens', () => {
    useAuthStore.getState().setTokens('access-123', 'refresh-456')
    const state = useAuthStore.getState()
    expect(state.token).toBe('access-123')
    expect(state.refreshToken).toBe('refresh-456')
  })

  it('setTokens marks as authenticated', () => {
    useAuthStore.getState().setTokens('access-123', 'refresh-456')
    expect(useAuthStore.getState().isAuthenticated()).toBe(true)
  })

  it('setUser stores user and tenantId', () => {
    useAuthStore.getState().setUser(mockUser)
    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.tenantId).toBe('tenant-1')
  })

  it('logout clears everything', () => {
    useAuthStore.getState().setTokens('access-123', 'refresh-456')
    useAuthStore.getState().setUser(mockUser)
    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.refreshToken).toBeNull()
    expect(state.tenantId).toBeNull()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated()).toBe(false)
  })

  it('hasRole returns true when user has the role', () => {
    useAuthStore.getState().setUser(mockUser)
    expect(useAuthStore.getState().hasRole('ROLE_PROFESSIONAL')).toBe(true)
  })

  it('hasRole returns false when user lacks the role', () => {
    useAuthStore.getState().setUser(mockUser)
    expect(useAuthStore.getState().hasRole('ROLE_ADMIN')).toBe(false)
  })

  it('hasRole returns false when user is null', () => {
    expect(useAuthStore.getState().hasRole('ROLE_PROFESSIONAL')).toBe(false)
  })
})
