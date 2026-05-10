import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from '@tanstack/react-router'
import { useSaveTestimonial } from '../../hooks/useAdminTestimonials'
import type { TestimonialInput } from '../../hooks/useAdminTestimonials'
import type { Testimonial } from '../../types/api'

const schema = z.object({
  customer_name: z.string().min(1, 'Required'),
  excerpt: z.string().optional(),
  quote: z.string().optional(),
  testimonial: z.string().optional(),
  released: z.boolean().default(false),
})

type FormValues = z.infer<typeof schema>

const input = 'w-full border rounded px-3 py-2 text-sm'

interface Props {
  slug?: string
  initialData?: Testimonial
}

export function TestimonialForm({ slug, initialData }: Props) {
  const mutation = useSaveTestimonial(slug)
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)

  const defaultValues: FormValues = initialData
    ? {
        customer_name: initialData.customer_name,
        excerpt: initialData.excerpt ?? '',
        quote: initialData.quote ?? '',
        testimonial: initialData.testimonial ?? '',
        released: initialData.released,
      }
    : { customer_name: '', excerpt: '', quote: '', testimonial: '', released: false }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues })

  const onSubmit = async (values: FormValues) => {
    setApiError(null)
    const data: TestimonialInput = {
      customer_name: values.customer_name,
      excerpt: values.excerpt || undefined,
      quote: values.quote || undefined,
      testimonial: values.testimonial || undefined,
      released: values.released,
    }
    try {
      await mutation.mutateAsync(data)
      navigate({ to: '/admin/testimonials' })
    } catch {
      setApiError('Save failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Customer Name *</label>
        <input {...register('customer_name')} className={input} />
        {errors.customer_name && (
          <p className="text-red-500 text-xs mt-1">{errors.customer_name.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Quote</label>
        <textarea {...register('quote')} rows={3} className={input} placeholder="Short quote shown on home page" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Excerpt</label>
        <textarea {...register('excerpt')} rows={2} className={input} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Full Testimonial</label>
        <textarea {...register('testimonial')} rows={5} className={input} />
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input {...register('released')} type="checkbox" />
        Released (visible on public site)
      </label>

      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white px-5 py-2 rounded text-sm font-medium disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : 'Save Testimonial'}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: '/admin/testimonials' })}
          className="border px-5 py-2 rounded text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
