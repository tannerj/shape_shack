import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryClient } from '../lib/queryClient'
import type { ProductWithAssociations } from '../types/api'

interface SizeAttribute {
  id?: number
  name: string
  dimensions?: string
  price_cents: number | null
  position?: number
  _destroy?: true
}

type ImageAttribute =
  | { id: number; alt_text?: string | null; caption?: string | null }
  | { id: number; _destroy: true }
  | { image: string; alt_text?: string | null; caption?: string | null }

export interface ProductInput {
  name: string
  sku?: string
  short_description?: string
  description?: string
  base_price_cents: number | null
  released: boolean
  discontinued: boolean
  sizes_attributes?: SizeAttribute[]
  images_attributes?: ImageAttribute[]
}

export interface AdminProductsResponse {
  released: ProductWithAssociations[]
  unreleased: ProductWithAssociations[]
  discontinued: ProductWithAssociations[]
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ['products', 'admin'],
    queryFn: () => api.get('products').json<AdminProductsResponse>(),
  })
}

export function useSaveProduct(slug?: string) {
  return useMutation({
    mutationFn: (data: ProductInput) =>
      slug
        ? api.patch(`products/${slug}`, { json: { product: data } }).json<ProductWithAssociations>()
        : api.post('products', { json: { product: data } }).json<ProductWithAssociations>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: (slug: string) => api.delete(`products/${slug}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}
