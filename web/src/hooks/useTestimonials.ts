import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Testimonial } from '../types/api'

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: () => api.get('testimonials').json<Testimonial[]>(),
  })
}
