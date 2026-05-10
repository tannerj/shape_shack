import { useParams, useNavigate } from '@tanstack/react-router'
import { useProduct } from '../../hooks/useProduct'
import { useDeleteProduct } from '../../hooks/useAdminProducts'
import { ProductForm } from '../../components/admin/ProductForm'

export function AdminProductEditPage() {
  const { slug } = useParams({ from: '/admin/products/$slug/edit' })
  const { data: product, isLoading, isError } = useProduct(slug)
  const deleteMutation = useDeleteProduct()
  const navigate = useNavigate()

  const handleDelete = () => {
    if (!product) return
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    deleteMutation.mutate(product.slug, {
      onSuccess: () => navigate({ to: '/admin/products' }),
    })
  }

  if (isLoading) return <p className="text-gray-500">Loading...</p>
  if (isError || !product) return <p className="text-red-600">Product not found.</p>

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-xl font-semibold">Edit: {product.name}</h1>
        <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-700">
          Delete Product
        </button>
      </div>
      <ProductForm slug={product.slug} initialData={product} />
    </div>
  )
}
