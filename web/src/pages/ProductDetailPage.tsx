import { useNavigate, useParams } from '@tanstack/react-router'
import { useProduct } from '../hooks/useProduct'

function formatCents(cents: number | null): string {
  if (cents == null) return 'Contact for pricing'
  return `$${(cents / 100).toFixed(2)}`
}

export function ProductDetailPage() {
  const { slug } = useParams({ from: '/products/$slug' })
  const { data: product, isLoading, isError } = useProduct(slug)
  const navigate = useNavigate()

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-gray-500">Loading...</div>
  }
  if (isError || !product) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-red-600">Product not found.</div>
  }

  const sizes = [...product.sizes].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {product.banner_image_url && (
        <img
          src={product.banner_image_url}
          alt={`${product.name} banner`}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}

      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>

      {product.description && (
        <div
          className="text-gray-700 leading-relaxed mb-8 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      )}

      {product.images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {product.images.map((image) =>
            image.thumb_url ? (
              <img
                key={image.id}
                src={image.thumb_url}
                alt={image.alt_text ?? product.name}
                className="w-full rounded-lg"
              />
            ) : null,
          )}
        </div>
      )}

      {sizes.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Available Sizes</h2>
          <ul className="divide-y">
            {sizes.map((size) => (
              <li key={size.id} className="flex justify-between py-3 text-sm">
                <span>
                  <strong>{size.name}</strong>
                  {size.dimensions && (
                    <span className="text-gray-500"> — {size.dimensions}</span>
                  )}
                </span>
                <span className="font-medium">{formatCents(size.price_cents)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <button
        onClick={() => navigate({ to: '/products/$slug/order', params: { slug } })}
        className="bg-black text-white px-8 py-3 rounded font-medium hover:bg-gray-800"
      >
        Place Order
      </button>
    </div>
  )
}
