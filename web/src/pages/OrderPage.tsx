import { useNavigate, useParams } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ReactNode } from 'react'
import { useProduct } from '../hooks/useProduct'
import { usePlaceOrder } from '../hooks/usePlaceOrder'

const schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  address: z.string().min(1, 'Required'),
  address_2: z.string().optional(),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  zip: z.string().min(5, 'Required'),
  phone: z.string().min(10, 'Required'),
  email: z.string().email('Invalid email'),
  product_size: z.string().optional(),
  order_description: z.string().min(1, 'Please describe your order'),
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

export function OrderPage() {
  const { slug } = useParams({ from: '/public/products/$slug/order' })
  const { data: product } = useProduct(slug)
  const navigate = useNavigate()
  const mutation = usePlaceOrder()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    try {
      const order = await mutation.mutateAsync({ ...values, product_id: product?.id })
      navigate({ to: '/orders/$token/confirmation', params: { token: order.token } })
    } catch {
      setError('root', { message: 'Something went wrong. Please try again.' })
    }
  }

  const sizes = product
    ? [...product.sizes].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    : []

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">
        {product ? `${product.name} — Order Form` : 'Order Form'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" error={errors.first_name?.message}>
            <input {...register('first_name')} className={inputClass} />
          </Field>
          <Field label="Last Name" error={errors.last_name?.message}>
            <input {...register('last_name')} className={inputClass} />
          </Field>
        </div>

        <Field label="Address" error={errors.address?.message}>
          <input {...register('address')} className={inputClass} />
        </Field>
        <Field label="Address (cont.)">
          <input {...register('address_2')} className={inputClass} />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="City" error={errors.city?.message} className="col-span-1">
            <input {...register('city')} className={inputClass} />
          </Field>
          <Field label="State" error={errors.state?.message}>
            <input {...register('state')} className={inputClass} />
          </Field>
          <Field label="Zip" error={errors.zip?.message}>
            <input {...register('zip')} className={inputClass} />
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

        {sizes.length > 0 && (
          <Field label="Size">
            <select {...register('product_size')} className={inputClass}>
              <option value="">Select a size...</option>
              {sizes.map((size) => (
                <option key={size.id} value={size.name}>
                  {size.name}
                  {size.dimensions ? ` — ${size.dimensions}` : ''}
                  {size.price_cents != null
                    ? ` ($${(size.price_cents / 100).toFixed(2)})`
                    : ''}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Order Description" error={errors.order_description?.message}>
          <textarea
            {...register('order_description')}
            rows={5}
            className={inputClass}
            placeholder="Describe what you'd like..."
          />
        </Field>

        {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Placing order…' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}
