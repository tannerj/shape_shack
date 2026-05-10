import { Outlet, Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'

function NavLink({ to, exact = false, children }: { to: string; exact?: boolean; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isActive = exact
    ? pathname === to
    : pathname === to || pathname.startsWith(to + '/')

  return (
    <Link
      to={to}
      className={[
        'flex items-center px-3 py-2 rounded text-sm',
        isActive
          ? 'bg-gray-100 font-medium text-black'
          : 'text-gray-600 hover:bg-gray-50',
      ].join(' ')}
    >
      {children}
    </Link>
  )
}

export function AdminLayout() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate({ to: '/login' })
    else if (!isAdmin) navigate({ to: '/' })
  }, [user, isAdmin, navigate])

  if (!user || !isAdmin) return null

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-48 bg-white border-r flex flex-col flex-shrink-0">
        <div className="p-4 border-b">
          <span className="font-semibold text-sm">Shape Shack</span>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <NavLink to="/admin" exact>Dashboard</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/messages">Messages</NavLink>
          <NavLink to="/admin/testimonials">Testimonials</NavLink>
        </nav>
        <div className="p-3 border-t">
          <button
            onClick={logout}
            className="w-full text-left text-sm text-gray-500 hover:text-black px-3 py-2"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
