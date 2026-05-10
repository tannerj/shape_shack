import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { TestimonialForm } from '../../components/admin/TestimonialForm'
import type { Testimonial } from '../../types/api'

export function AdminTestimonialEditPage() {
  const { slug } = useParams({ from: '/admin/testimonials/$slug/edit' })
  const { data: testimonial, isLoading, isError } = useQuery({
    queryKey: ['testimonials', slug],
    queryFn: () => api.get(`testimonials/${slug}`).json<Testimonial>(),
  })

  if (isLoading) return <p className="text-gray-500">Loading...</p>
  if (isError || !testimonial) return <p className="text-red-600">Testimonial not found.</p>

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Edit: {testimonial.customer_name}</h1>
      <TestimonialForm slug={testimonial.slug} initialData={testimonial} />
    </div>
  )
}
