import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'

export interface MessageInput {
  name: string
  address_one: string
  address_two?: string
  city: string
  state: string
  zip_code: string
  phone: string
  email: string
  subject: string
  message: string
}

export function useContactForm() {
  return useMutation({
    mutationFn: (data: MessageInput) =>
      api.post('messages', { json: { message: data } }).json(),
  })
}
