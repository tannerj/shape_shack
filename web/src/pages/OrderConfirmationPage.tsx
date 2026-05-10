import { Link, useParams } from '@tanstack/react-router'
import { queryClient } from '../lib/queryClient'
import type { Order } from '../types/api'

export function OrderConfirmationPage() {
  const { token } = useParams({ from: '/orders/$token/confirmation' })
  const order = queryClient.getQueryData<Order>(['order', token])

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Thanks for your order!</h1>
      {order ? (
        <p className="text-gray-700 mb-4">
          {order.first_name}, we've received your order
          {order.product ? ` for the ${order.product.name}` : ''} and will be in touch
          via the phone number you provided shortly. A confirmation has been sent to{' '}
          <strong>{order.email}</strong>.
        </p>
      ) : (
        <p className="text-gray-700 mb-4">
          Your order has been received. We'll be in touch via the phone number you provided
          shortly.
        </p>
      )}
      <p className="text-sm text-gray-400 mb-8">Reference: {token}</p>
      <Link
        to="/"
        className="inline-block bg-black text-white px-6 py-3 rounded font-medium hover:bg-gray-800"
      >
        Back to Home
      </Link>
    </div>
  )
}
