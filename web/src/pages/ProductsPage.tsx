import { Link } from '@tanstack/react-router'
import { useProducts } from '../hooks/useProducts'

export function ProductsPage() {
  const { data: products, isLoading, isError } = useProducts()

  if (isLoading) {
    return <div className="max-w-5xl mx-auto px-4 py-12 text-gray-500">Loading...</div>
  }
  if (isError) {
    return <div className="max-w-5xl mx-auto px-4 py-12 text-red-600">Failed to load products.</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <Link
            key={product.id}
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="group block"
          >
            {product.list_image_url ? (
              <img
                src={product.list_image_url}
                alt={`${product.name} list image`}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400 text-sm">
                No image
              </div>
            )}
            <h2 className="font-semibold text-lg group-hover:underline">{product.name}</h2>
            {product.short_description && (
              <p className="text-gray-600 text-sm mt-1">{product.short_description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
