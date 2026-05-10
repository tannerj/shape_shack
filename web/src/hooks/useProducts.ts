import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { ProductWithAssociations } from '../types/api'

type AdminResponse = { released: ProductWithAssociations[] }

export function useProducts() {
  return useQuery({
    queryKey: ['products', 'public'],
    queryFn: async () => {
      const data = await api.get('products').json<ProductWithAssociations[] | AdminResponse>()
      return Array.isArray(data) ? data : data.released
    },
  })
}
