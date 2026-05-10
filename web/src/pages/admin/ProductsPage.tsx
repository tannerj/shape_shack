import { Link, useNavigate } from '@tanstack/react-router'
import { useAdminProducts, useDeleteProduct } from '../../hooks/useAdminProducts'
import type { ProductWithAssociations } from '../../types/api'

function ProductRow({ product, onDelete }: { product: ProductWithAssociations; onDelete: (slug: string) => void }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-2 pr-4 text-sm font-medium">{product.name}</td>
      <td className="py-2 pr-4 text-sm text-gray-500">{product.sku ?? '—'}</td>
      <td className="py-2 pr-4 text-sm text-gray-500">
        {product.base_price_cents != null ? `$${(product.base_price_cents / 100).toFixed(2)}` : '—'}
      </td>
      <td className="py-2 pr-4 text-sm">{product.sizes.length} size{product.sizes.length !== 1 ? 's' : ''}</td>
      <td className="py-2 text-sm flex gap-3">
        <Link to="/admin/products/$slug/edit" params={{ slug: product.slug }} className="text-blue-600 hover:underline">
          Edit
        </Link>
        <button
          onClick={() => { if (confirm(`Delete "${product.name}"?`)) onDelete(product.slug) }}
          className="text-red-500 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  )
}

function Section({ title, products, onDelete }: { title: string; products: ProductWithAssociations[]; onDelete: (slug: string) => void }) {
  if (products.length === 0) return null
  return (
    <section className="mb-8">
      <h2 className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-3">{title}</h2>
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-gray-400 border-b">
            <th className="pb-2 pr-4 font-normal">Name</th>
            <th className="pb-2 pr-4 font-normal">SKU</th>
            <th className="pb-2 pr-4 font-normal">Price</th>
            <th className="pb-2 pr-4 font-normal">Sizes</th>
            <th className="pb-2 font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => <ProductRow key={p.id} product={p} onDelete={onDelete} />)}
        </tbody>
      </table>
    </section>
  )
}

export function AdminProductsPage() {
  const { data, isLoading, isError } = useAdminProducts()
  const deleteMutation = useDeleteProduct()
  const navigate = useNavigate()

  if (isLoading) return <p className="text-gray-500">Loading...</p>
  if (isError) return <p className="text-red-600">Failed to load products.</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Products</h1>
        <button
          onClick={() => navigate({ to: '/admin/products/new' })}
          className="bg-black text-white px-4 py-2 rounded text-sm font-medium"
        >
          New Product
        </button>
      </div>
      <Section title="Released" products={data?.released ?? []} onDelete={(s) => deleteMutation.mutate(s)} />
      <Section title="Unreleased" products={data?.unreleased ?? []} onDelete={(s) => deleteMutation.mutate(s)} />
      <Section title="Discontinued" products={data?.discontinued ?? []} onDelete={(s) => deleteMutation.mutate(s)} />
      {data && data.released.length === 0 && data.unreleased.length === 0 && data.discontinued.length === 0 && (
        <p className="text-gray-400">No products yet.</p>
      )}
    </div>
  )
}
