import { useRef, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from '@tanstack/react-router'
import { useSaveProduct } from '../../hooks/useAdminProducts'
import type { ProductInput } from '../../hooks/useAdminProducts'
import type { ProductWithAssociations } from '../../types/api'
import { uploadFile } from '../../lib/api'

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

type ExistingImage = {
  id: number
  altText: string
  captionText: string
  thumb_url: string | null
  image_url: string | null
}

type PendingImage = {
  key: string
  shrineData: string
  altText: string
  captionText: string
  uploading: boolean
  error?: string
  previewUrl: string
}

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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    initialData?.images.map((img) => ({
      id: img.id,
      altText: img.alt_text ?? '',
      captionText: img.caption ?? '',
      thumb_url: img.thumb_url,
      image_url: img.image_url,
    })) ?? []
  )
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([])
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])

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

  const handleRemoveExistingImage = (id: number) => {
    setRemovedImageIds((prev) => [...prev, id])
    setExistingImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleRemovePendingImage = (key: string) => {
    setPendingImages((prev) => {
      const img = prev.find((p) => p.key === key)
      if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl)
      return prev.filter((p) => p.key !== key)
    })
  }

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    for (const file of Array.from(files)) {
      const key = `${Date.now()}-${Math.random()}`
      const previewUrl = URL.createObjectURL(file)
      setPendingImages((prev) => [
        ...prev,
        { key, shrineData: '', altText: '', captionText: '', uploading: true, previewUrl },
      ])
      try {
        const data = await uploadFile(file)
        setPendingImages((prev) =>
          prev.map((p) =>
            p.key === key ? { ...p, uploading: false, shrineData: JSON.stringify(data) } : p
          )
        )
      } catch {
        setPendingImages((prev) =>
          prev.map((p) =>
            p.key === key ? { ...p, uploading: false, error: 'Upload failed' } : p
          )
        )
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
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
      images_attributes: [
        ...existingImages.map((img) => ({
          id: img.id,
          alt_text: img.altText || null,
          caption: img.captionText || null,
        })),
        ...removedImageIds.map((id) => ({ id, _destroy: true as const })),
        ...pendingImages
          .filter((p) => p.shrineData && !p.uploading && !p.error)
          .map((p) => ({
            image: p.shrineData,
            alt_text: p.altText || null,
            caption: p.captionText || null,
          })),
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

      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-sm">Images</h3>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs border rounded px-2 py-1 hover:bg-gray-50"
          >
            + Add Images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFilesSelected(e.target.files)}
          />
        </div>

        {existingImages.length === 0 && pendingImages.length === 0 && (
          <p className="text-gray-400 text-sm">No images yet.</p>
        )}

        <div className="space-y-3">
          {existingImages.map((img) => (
            <div key={img.id} className="flex gap-3 items-start border rounded p-2">
              <div className="w-16 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                {img.thumb_url ? (
                  <img src={img.thumb_url} alt={img.altText} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">img</div>
                )}
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  value={img.altText}
                  onChange={(e) =>
                    setExistingImages((prev) =>
                      prev.map((i) => (i.id === img.id ? { ...i, altText: e.target.value } : i))
                    )
                  }
                  placeholder="Alt text"
                  className={input}
                />
                <input
                  value={img.captionText}
                  onChange={(e) =>
                    setExistingImages((prev) =>
                      prev.map((i) => (i.id === img.id ? { ...i, captionText: e.target.value } : i))
                    )
                  }
                  placeholder="Caption"
                  className={input}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveExistingImage(img.id)}
                className="text-red-400 hover:text-red-600 py-2 px-1 text-sm flex-shrink-0"
              >
                ✕
              </button>
            </div>
          ))}

          {pendingImages.map((img) => (
            <div key={img.key} className="flex gap-3 items-start border rounded p-2">
              <div className="w-16 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                {img.uploading ? (
                  <p className="text-xs text-gray-400 py-2">Uploading…</p>
                ) : img.error ? (
                  <p className="text-xs text-red-500 py-2">{img.error}</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={img.altText}
                      onChange={(e) =>
                        setPendingImages((prev) =>
                          prev.map((p) => (p.key === img.key ? { ...p, altText: e.target.value } : p))
                        )
                      }
                      placeholder="Alt text"
                      className={input}
                    />
                    <input
                      value={img.captionText}
                      onChange={(e) =>
                        setPendingImages((prev) =>
                          prev.map((p) => (p.key === img.key ? { ...p, captionText: e.target.value } : p))
                        )
                      }
                      placeholder="Caption"
                      className={input}
                    />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemovePendingImage(img.key)}
                className="text-red-400 hover:text-red-600 py-2 px-1 text-sm flex-shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || pendingImages.some((p) => p.uploading)}
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
