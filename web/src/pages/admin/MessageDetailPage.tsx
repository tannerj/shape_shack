import { useEffect } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { useAdminMessage } from '../../hooks/useAdminMessages'
import { queryClient } from '../../lib/queryClient'

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="grid grid-cols-3 py-2 border-b text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="col-span-2">{value || '—'}</span>
    </div>
  )
}

export function AdminMessageDetailPage() {
  const { id } = useParams({ from: '/admin/messages/$id' })
  const messageId = parseInt(id, 10)
  const { data: message, isLoading, isError } = useAdminMessage(messageId)

  useEffect(() => {
    if (message) {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    }
  }, [message?.id])

  if (isLoading) return <p className="text-gray-500">Loading...</p>
  if (isError || !message) return <p className="text-red-600">Message not found.</p>

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/messages" className="text-sm text-gray-400 hover:text-black">← Messages</Link>
        <h1 className="text-xl font-semibold">{message.subject}</h1>
      </div>

      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">From</h2>
        <Row label="Name" value={message.name} />
        <Row label="Email" value={message.email} />
        <Row label="Phone" value={message.phone} />
        <Row label="Address" value={[message.address_one, message.address_two, message.city, message.state, message.zip_code].filter(Boolean).join(', ')} />
      </section>

      <section>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Message</h2>
        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
      </section>
    </div>
  )
}
