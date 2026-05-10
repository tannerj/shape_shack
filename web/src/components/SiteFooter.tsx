import { Link } from '@tanstack/react-router'

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16 py-10">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row gap-10 text-sm">
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <ul className="space-y-1">
            <li>
              <Link to="/contact" className="hover:text-white">
                Email Us
              </Link>
            </li>
            <li>Edmund "Ed" Swinson</li>
            <li>
              <a href="tel:9199200200" className="hover:text-white">
                (919) 920-0020
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Place Order</h3>
          <ul>
            <li>
              <Link to="/products" className="hover:text-white">
                View Products
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
