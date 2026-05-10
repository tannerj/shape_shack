import { describe, it, expect, beforeEach } from 'vitest'
import { getToken, setToken, clearAuth, getStoredUser, setStoredUser } from './api'
import type { StoredUser } from './api'

const testUser: StoredUser = {
  id: 1,
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  roles: ['admin'],
}

describe('auth storage helpers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when no token is set', () => {
    expect(getToken()).toBeNull()
  })

  it('stores and retrieves a token', () => {
    setToken('abc123')
    expect(getToken()).toBe('abc123')
  })

  it('returns null when no user is stored', () => {
    expect(getStoredUser()).toBeNull()
  })

  it('stores and retrieves a user', () => {
    setStoredUser(testUser)
    expect(getStoredUser()).toEqual(testUser)
  })

  it('clearAuth removes token and user', () => {
    setToken('abc123')
    setStoredUser(testUser)
    clearAuth()
    expect(getToken()).toBeNull()
    expect(getStoredUser()).toBeNull()
  })
})
