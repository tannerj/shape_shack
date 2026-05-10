import { Link } from '@tanstack/react-router'
import { useTestimonials } from '../hooks/useTestimonials'

export function HomePage() {
  const { data: testimonials } = useTestimonials()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">
        Makers of One of A Kind BBQ Butcher Blocks, Cutting Boards, Islands, and More!
      </h1>
      <p className="text-gray-700 mb-8 max-w-2xl leading-relaxed">
        Our boards have served in kitchens from the best BBQ and chop houses in the country
        to inspired home chefs. A trusted tool built with craftsmanship, Ed's Shape Shack
        blocks and boards are timeless and enduring with a quality meant to last for generations.
      </p>
      <Link
        to="/products"
        className="inline-block bg-black text-white px-6 py-3 rounded font-medium hover:bg-gray-800"
      >
        View Products
      </Link>

      {testimonials && testimonials.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">What Our Customers Say</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote key={t.id} className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 italic mb-3">
                  "{t.quote ?? t.excerpt ?? t.testimonial}"
                </p>
                <cite className="text-sm font-medium not-italic">— {t.customer_name}</cite>
              </blockquote>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
