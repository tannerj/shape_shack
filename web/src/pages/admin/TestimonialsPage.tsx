import { Link, useNavigate } from '@tanstack/react-router'
import { useAdminTestimonials, useDeleteTestimonial, useSaveTestimonial } from '../../hooks/useAdminTestimonials'
import type { Testimonial } from '../../types/api'

function TestimonialRow({ t }: { t: Testimonial }) {
  const toggleMutation = useSaveTestimonial(t.slug)
  const deleteMutation = useDeleteTestimonial()

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-2 pr-4 text-sm font-medium">{t.customer_name}</td>
      <td className="py-2 pr-4 text-sm text-gray-500 max-w-xs truncate">{t.quote ?? t.excerpt ?? '—'}</td>
      <td className="py-2 pr-4">
        <button
          onClick={() => toggleMutation.mutate({ customer_name: t.customer_name, released: !t.released })}
          className={`text-xs px-2 py-0.5 rounded-full ${
            t.released ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {t.released ? 'Released' : 'Unreleased'}
        </button>
      </td>
      <td className="py-2 text-sm flex gap-3">
        <Link
          to="/admin/testimonials/$slug/edit"
          params={{ slug: t.slug }}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={() => { if (confirm(`Delete testimonial from "${t.customer_name}"?`)) deleteMutation.mutate(t.slug) }}
          className="text-red-500 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  )
}

export function AdminTestimonialsPage() {
  const { data: testimonials, isLoading, isError } = useAdminTestimonials()
  const navigate = useNavigate()

  if (isLoading) return <p className="text-gray-500">Loading...</p>
  if (isError) return <p className="text-red-600">Failed to load testimonials.</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Testimonials</h1>
        <button
          onClick={() => navigate({ to: '/admin/testimonials/new' })}
          className="bg-black text-white px-4 py-2 rounded text-sm font-medium"
        >
          New Testimonial
        </button>
      </div>
      {testimonials && testimonials.length === 0 ? (
        <p className="text-gray-400">No testimonials yet.</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b">
              <th className="pb-2 pr-4 font-normal">Customer</th>
              <th className="pb-2 pr-4 font-normal">Quote / Excerpt</th>
              <th className="pb-2 pr-4 font-normal">Status</th>
              <th className="pb-2 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials?.map((t) => <TestimonialRow key={t.id} t={t} />)}
          </tbody>
        </table>
      )}
    </div>
  )
}
