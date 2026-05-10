import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Order } from '../types/api'

export function useAdminOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('orders').json<Order[]>(),
  })
}

export function useAdminOrder(token: string) {
  return useQuery({
    queryKey: ['order', token],
    queryFn: () => api.get(`orders/${token}`).json<Order>(),
  })
}
