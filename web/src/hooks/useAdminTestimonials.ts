import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryClient } from '../lib/queryClient'
import type { Testimonial } from '../types/api'

export interface TestimonialInput {
  customer_name: string
  excerpt?: string
  quote?: string
  testimonial?: string
  released: boolean
}

export function useAdminTestimonials() {
  return useQuery({
    queryKey: ['testimonials', 'admin'],
    queryFn: () => api.get('testimonials').json<Testimonial[]>(),
  })
}

export function useSaveTestimonial(slug?: string) {
  return useMutation({
    mutationFn: (data: TestimonialInput) =>
      slug
        ? api
            .patch(`testimonials/${slug}`, { json: { testimonial: data } })
            .json<Testimonial>()
        : api.post('testimonials', { json: { testimonial: data } }).json<Testimonial>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  })
}

export function useDeleteTestimonial() {
  return useMutation({
    mutationFn: (slug: string) => api.delete(`testimonials/${slug}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  })
}
