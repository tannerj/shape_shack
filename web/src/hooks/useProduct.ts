import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { ProductWithAssociations } from '../types/api'

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['products', slug],
    queryFn: () => api.get(`products/${slug}`).json<ProductWithAssociations>(),
  })
}
