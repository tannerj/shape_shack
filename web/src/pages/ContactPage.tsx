import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ReactNode } from 'react'
import { useContactForm } from '../hooks/useContactForm'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  address_one: z.string().min(1, 'Required'),
  address_two: z.string().optional(),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  zip_code: z.string().min(5, 'Required'),
  phone: z.string().min(10, 'Required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(1, 'Required'),
  message: z.string().min(1, 'Required'),
})

type FormValues = z.infer<typeof schema>

const inputClass = 'w-full border rounded px-3 py-2 text-sm'

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export function ContactPage() {
  const mutation = useContactForm()
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    try {
      await mutation.mutateAsync(values)
      setSubmitted(true)
    } catch {
      setError('root', { message: 'Something went wrong. Please try again.' })
    }
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Message Sent!</h1>
        <p className="text-gray-700">Thanks for reaching out. We'll get back to you soon.</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Name" error={errors.name?.message}>
          <input {...register('name')} className={inputClass} />
        </Field>
        <Field label="Address" error={errors.address_one?.message}>
          <input {...register('address_one')} className={inputClass} />
        </Field>
        <Field label="Address (cont.)">
          <input {...register('address_two')} className={inputClass} />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="City" error={errors.city?.message} className="col-span-1">
            <input {...register('city')} className={inputClass} />
          </Field>
          <Field label="State" error={errors.state?.message}>
            <input {...register('state')} className={inputClass} />
          </Field>
          <Field label="Zip" error={errors.zip_code?.message}>
            <input {...register('zip_code')} className={inputClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone" error={errors.phone?.message}>
            <input {...register('phone')} type="tel" className={inputClass} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input {...register('email')} type="email" className={inputClass} />
          </Field>
        </div>
        <Field label="Subject" error={errors.subject?.message}>
          <input {...register('subject')} className={inputClass} />
        </Field>
        <Field label="Message" error={errors.message?.message}>
          <textarea {...register('message')} rows={5} className={inputClass} />
        </Field>

        {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-2 rounded text-sm font-medium disabled:opacity-50"
        >
          {isSubmitting ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
