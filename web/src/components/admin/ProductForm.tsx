import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from '@tanstack/react-router'
import { useSaveProduct } from '../../hooks/useAdminProducts'
import type { ProductInput } from '../../hooks/useAdminProducts'
import type { ProductWithAssociations } from '../../types/api'

function toCents(val: string | undefined): number | null {
  if (!val || !val.trim()) return null
  const n = parseFloat(val)
  return isNaN(n) ? null : Math.round(n * 100)
}

function fromCents(cents: number | null): string {
  return cents == null ? '' : (cents / 100).toFixed(2)
}

const sizeSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Required'),
  dimensions: z.string().optional(),
  price_dollars: z.string().optional(),
  position: z.coerce.number().int().optional(),
})

const schema = z.object({
  name: z.string().min(1, 'Required'),
  sku: z.string().optional(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  base_price_dollars: z.string().optional(),
  released: z.boolean().default(false),
  discontinued: z.boolean().default(false),
  sizes: z.array(sizeSchema).default([]),
})

type FormValues = z.infer<typeof schema>

const input = 'w-full border rounded px-3 py-2 text-sm'

interface Props {
  slug?: string
  initialData?: ProductWithAssociations
}

export function ProductForm({ slug, initialData }: Props) {
  const mutation = useSaveProduct(slug)
  const navigate = useNavigate()
  const [removedSizeIds, setRemovedSizeIds] = useState<number[]>([])
  const [apiError, setApiError] = useState<string | null>(null)

  const defaultValues: FormValues = initialData
    ? {
        name: initialData.name,
        sku: initialData.sku ?? '',
        short_description: initialData.short_description ?? '',
        description: initialData.description ?? '',
        base_price_dollars: fromCents(initialData.base_price_cents),
        released: initialData.released,
        discontinued: initialData.discontinued,
        sizes: initialData.sizes.map((s) => ({
          id: s.id,
          name: s.name,
          dimensions: s.dimensions ?? '',
          price_dollars: fromCents(s.price_cents),
          position: s.position ?? 0,
        })),
      }
    : {
        name: '',
        sku: '',
        short_description: '',
        description: '',
        base_price_dollars: '',
        released: false,
        discontinued: false,
        sizes: [],
      }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues })

  const { fields, append, remove } = useFieldArray({ control, name: 'sizes', keyName: 'key' })

  const handleRemoveSize = (index: number) => {
    const sizeId = fields[index].id
    if (sizeId) setRemovedSizeIds((prev) => [...prev, sizeId])
    remove(index)
  }

  const onSubmit = async (values: FormValues) => {
    setApiError(null)
    const data: ProductInput = {
      name: values.name,
      sku: values.sku || undefined,
      short_description: values.short_description || undefined,
      description: values.description || undefined,
      base_price_cents: toCents(values.base_price_dollars),
      released: values.released,
      discontinued: values.discontinued,
      sizes_attributes: [
        ...values.sizes.map((s, i) => ({
          id: s.id,
          name: s.name,
          dimensions: s.dimensions || undefined,
          price_cents: toCents(s.price_dollars),
          position: s.position ?? i,
        })),
        ...removedSizeIds.map((id) => ({ id, name: '', price_cents: null, _destroy: true as const })),
      ],
    }
    try {
      const saved = await mutation.mutateAsync(data)
      navigate({ to: '/admin/products/$slug/edit', params: { slug: saved.slug } })
    } catch {
      setApiError('Save failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input {...register('name')} className={input} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <input {...register('sku')} className={input} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Short Description</label>
        <input {...register('short_description')} className={input} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea {...register('description')} rows={6} className={input} />
      </div>

      <div className="flex gap-6 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Base Price ($)</label>
          <input {...register('base_price_dollars')} placeholder="0.00" className="border rounded px-3 py-2 text-sm w-32" />
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer pb-2">
          <input {...register('released')} type="checkbox" />
          Released
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer pb-2">
          <input {...register('discontinued')} type="checkbox" />
          Discontinued
        </label>
      </div>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-sm">Sizes</h3>
          <button
            type="button"
            onClick={() => append({ name: '', dimensions: '', price_dollars: '', position: fields.length })}
            className="text-xs border rounded px-2 py-1 hover:bg-gray-50"
          >
            + Add Size
          </button>
        </div>
        {fields.length === 0 && <p className="text-gray-400 text-sm">No sizes yet.</p>}
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.key} className="flex gap-2 items-start">
              <div className="flex-1">
                <input {...register(`sizes.${index}.name`)} placeholder="Name" className={input} />
                {errors.sizes?.[index]?.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.sizes[index].name?.message}</p>
                )}
              </div>
              <input {...register(`sizes.${index}.dimensions`)} placeholder="Dimensions" className="border rounded px-3 py-2 text-sm w-36" />
              <input {...register(`sizes.${index}.price_dollars`)} placeholder="$ Price" className="border rounded px-3 py-2 text-sm w-24" />
              <input {...register(`sizes.${index}.position`)} placeholder="Pos" type="number" className="border rounded px-3 py-2 text-sm w-16" />
              <button type="button" onClick={() => handleRemoveSize(index)} className="text-red-400 hover:text-red-600 py-2 px-1 text-sm">✕</button>
            </div>
          ))}
        </div>
      </section>

      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white px-5 py-2 rounded text-sm font-medium disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : 'Save Product'}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: '/admin/products' })}
          className="border px-5 py-2 rounded text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
