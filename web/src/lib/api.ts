import ky from 'ky'

const TOKEN_KEY = 'ss_token'
const USER_KEY = 'ss_user'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export interface StoredUser {
  id: number
  email: string
  first_name: string
  last_name: string
  roles: string[]
}

export const getStoredUser = (): StoredUser | null => {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? (JSON.parse(raw) as StoredUser) : null
}

export const setStoredUser = (user: StoredUser) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user))

export const api = ky.create({
  prefixUrl: '/api/v1',
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getToken()
        if (token) request.headers.set('Authorization', `Bearer ${token}`)
      },
    ],
    afterResponse: [
      (request, _options, response) => {
        // Don't redirect on 401 from sign_in — the form handles that error
        if (response.status === 401 && !request.url.includes('auth/sign_in')) {
          clearAuth()
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
        }
      },
    ],
  },
})
