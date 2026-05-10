import { Link } from '@tanstack/react-router'

const sections = [
  { to: '/admin/products', label: 'Products', description: 'Manage the product catalog, sizes, and visibility.' },
  { to: '/admin/orders', label: 'Orders', description: 'View all customer orders.' },
  { to: '/admin/messages', label: 'Messages', description: 'Read and respond to contact form submissions.' },
  { to: '/admin/testimonials', label: 'Testimonials', description: 'Manage customer testimonials and release status.' },
] as const

export function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 max-w-xl">
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="block border rounded-lg p-5 bg-white hover:shadow-sm transition-shadow"
          >
            <h2 className="font-medium mb-1">{s.label}</h2>
            <p className="text-sm text-gray-500">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
