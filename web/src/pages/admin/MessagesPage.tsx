import { Link } from '@tanstack/react-router'
import { useAdminMessages } from '../../hooks/useAdminMessages'
import type { Message } from '../../types/api'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function MessageRow({ message }: { message: Message }) {
  return (
    <Link
      to="/admin/messages/$id"
      params={{ id: String(message.id) }}
      className="flex items-start gap-4 py-3 border-b hover:bg-gray-50 px-2 -mx-2 rounded"
    >
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <span className={`text-sm ${message.read ? 'font-normal text-gray-700' : 'font-semibold'}`}>
            {message.name}
          </span>
          <span className="text-xs text-gray-400 ml-2 shrink-0">{formatDate(message.created_at)}</span>
        </div>
        <p className="text-sm text-gray-500 truncate">{message.subject} — {message.message}</p>
      </div>
      {!message.read && (
        <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
      )}
    </Link>
  )
}

export function AdminMessagesPage() {
  const { data, isLoading, isError } = useAdminMessages()

  if (isLoading) return <p className="text-gray-500">Loading...</p>
  if (isError) return <p className="text-red-600">Failed to load messages.</p>

  const unread = data?.unread ?? []
  const read = data?.read ?? []

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-6">Messages</h1>

      {unread.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Unread ({unread.length})
          </h2>
          {unread.map((m) => <MessageRow key={m.id} message={m} />)}
        </section>
      )}

      {read.length > 0 && (
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Read</h2>
          {read.map((m) => <MessageRow key={m.id} message={m} />)}
        </section>
      )}

      {unread.length === 0 && read.length === 0 && (
        <p className="text-gray-400">No messages yet.</p>
      )}
    </div>
  )
}
