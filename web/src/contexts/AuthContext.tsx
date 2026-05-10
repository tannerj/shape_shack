import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import {
  api,
  clearAuth,
  getStoredUser,
  setStoredUser,
  setToken,
} from '../lib/api'
import type { StoredUser } from '../lib/api'

interface AuthContextValue {
  user: StoredUser | null
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(getStoredUser)

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post('auth/sign_in', {
      json: { user: { email, password } },
    })
    const authHeader = response.headers.get('Authorization')
    if (authHeader) setToken(authHeader.replace('Bearer ', ''))
    const { user: userData } = await response.json<{ user: StoredUser }>()
    setStoredUser(userData)
    setUser(userData)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.delete('auth/sign_out')
    } finally {
      clearAuth()
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.roles.includes('admin') ?? false,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
