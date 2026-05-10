import { Link, useParams } from '@tanstack/react-router'
import { useAdminOrder } from '../../hooks/useAdminOrders'

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="grid grid-cols-3 py-2 border-b text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="col-span-2">{value || '—'}</span>
    </div>
  )
}

export function AdminOrderDetailPage() {
  const { token } = useParams({ from: '/admin/orders/$token' })
  const { data: order, isLoading, isError } = useAdminOrder(token)

  if (isLoading) return <p className="text-gray-500">Loading...</p>
  if (isError || !order) return <p className="text-red-600">Order not found.</p>

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/orders" className="text-sm text-gray-400 hover:text-black">← Orders</Link>
        <h1 className="text-xl font-semibold">Order Detail</h1>
      </div>

      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Customer</h2>
        <Row label="Name" value={`${order.first_name} ${order.last_name}`} />
        <Row label="Email" value={order.email} />
        <Row label="Phone" value={order.phone} />
        <Row label="Address" value={[order.address, order.address_2, order.city, order.state, order.zip].filter(Boolean).join(', ')} />
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Order</h2>
        <Row label="Product" value={order.product?.name} />
        <Row label="Size" value={order.product_size} />
        <Row label="Reference" value={order.token} />
        <Row label="Status" value={order.status} />
        <div className="py-2 text-sm border-b">
          <span className="text-gray-500 block mb-1">Description</span>
          <p className="whitespace-pre-wrap">{order.order_description}</p>
        </div>
      </section>
    </div>
  )
}
