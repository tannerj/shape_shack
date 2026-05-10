import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryClient } from '../lib/queryClient'
import type { Order } from '../types/api'

export interface OrderInput {
  first_name: string
  last_name: string
  address: string
  address_2?: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  product_id?: number
  product_size?: string
  order_description: string
}

export function usePlaceOrder() {
  return useMutation({
    mutationFn: (data: OrderInput) =>
      api.post('orders', { json: { order: data } }).json<Order>(),
    onSuccess: (order) => {
      queryClient.setQueryData(['order', order.token], order)
    },
  })
}
