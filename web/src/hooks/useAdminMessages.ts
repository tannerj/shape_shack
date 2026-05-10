import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryClient } from '../lib/queryClient'
import type { Message } from '../types/api'

export interface MessagesResponse {
  unread: Message[]
  read: Message[]
}

export function useAdminMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: () => api.get('messages').json<MessagesResponse>(),
    staleTime: 0,
  })
}

export function useAdminMessage(id: number) {
  return useQuery({
    queryKey: ['messages', id],
    queryFn: () => api.get(`messages/${id}`).json<Message>(),
  })
}

export function useUpdateMessage() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { read: boolean } }) =>
      api.patch(`messages/${id}`, { json: { message: data } }).json<Message>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  })
}
