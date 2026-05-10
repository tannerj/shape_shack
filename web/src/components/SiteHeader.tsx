import { Link } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'

export function SiteHeader() {
  const { user } = useAuth()

  return (
    <header className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="font-bold text-lg">Ed's Shape Shack</Link>
          <div className="text-right text-xs text-gray-600">
            <a href="tel:9199200200" className="hover:text-black">(919) 920-0020</a>
            <span className="block">Greenville, NC</span>
            {user && (
              <Link to="/admin" className="text-gray-400 hover:text-black">
                Admin
              </Link>
            )}
          </div>
        </div>
        <nav className="flex gap-6 pb-3 text-sm">
          <Link to="/about" className="hover:underline [&.active]:font-semibold">About</Link>
          <Link to="/products" className="hover:underline [&.active]:font-semibold">Products</Link>
          <Link to="/contact" className="hover:underline [&.active]:font-semibold">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
