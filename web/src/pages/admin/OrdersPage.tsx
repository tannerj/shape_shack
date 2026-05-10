import { Link } from '@tanstack/react-router'
import { useAdminOrders } from '../../hooks/useAdminOrders'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function AdminOrdersPage() {
  const { data: orders, isLoading, isError } = useAdminOrders()

  if (isLoading) return <p className="text-gray-500">Loading...</p>
  if (isError) return <p className="text-red-600">Failed to load orders.</p>

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Orders</h1>
      {orders && orders.length === 0 ? (
        <p className="text-gray-400">No orders yet.</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b">
              <th className="pb-2 pr-4 font-normal">Date</th>
              <th className="pb-2 pr-4 font-normal">Customer</th>
              <th className="pb-2 pr-4 font-normal">Product</th>
              <th className="pb-2 pr-4 font-normal">Size</th>
              <th className="pb-2 font-normal">Reference</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-2 pr-4 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                <td className="py-2 pr-4 text-sm font-medium">
                  <Link to="/admin/orders/$token" params={{ token: order.token }} className="hover:underline">
                    {order.first_name} {order.last_name}
                  </Link>
                </td>
                <td className="py-2 pr-4 text-sm text-gray-600">{order.product?.name ?? '—'}</td>
                <td className="py-2 pr-4 text-sm text-gray-600">{order.product_size ?? '—'}</td>
                <td className="py-2 text-sm font-mono text-gray-400">{order.token.slice(0, 12)}…</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
