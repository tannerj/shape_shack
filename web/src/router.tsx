import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { RootLayout } from './layouts/RootLayout'
import { PublicLayout } from './layouts/PublicLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { OrderPage } from './pages/OrderPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { ContactPage } from './pages/ContactPage'
import { AdminDashboardPage } from './pages/admin/DashboardPage'
import { AdminProductsPage } from './pages/admin/ProductsPage'
import { AdminProductNewPage } from './pages/admin/ProductNewPage'
import { AdminProductEditPage } from './pages/admin/ProductEditPage'
import { AdminOrdersPage } from './pages/admin/OrdersPage'
import { AdminOrderDetailPage } from './pages/admin/OrderDetailPage'
import { AdminMessagesPage } from './pages/admin/MessagesPage'
import { AdminMessageDetailPage } from './pages/admin/MessageDetailPage'
import { AdminTestimonialsPage } from './pages/admin/TestimonialsPage'
import { AdminTestimonialNewPage } from './pages/admin/TestimonialNewPage'
import { AdminTestimonialEditPage } from './pages/admin/TestimonialEditPage'

// ── Root ──────────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({ component: RootLayout })

// ── Public (pathless layout) ──────────────────────────────────────────────────

const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: PublicLayout,
})

const indexRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/', component: HomePage })
const aboutRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/about', component: AboutPage })
const productsRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/products', component: ProductsPage })
const productDetailRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/products/$slug', component: ProductDetailPage })
const orderRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/products/$slug/order', component: OrderPage })
const orderConfirmationRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/orders/$token/confirmation', component: OrderConfirmationPage })
const contactRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/contact', component: ContactPage })

// ── Login ─────────────────────────────────────────────────────────────────────

const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: LoginPage })

// ── Admin ─────────────────────────────────────────────────────────────────────

const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: AdminLayout })

const adminIndexRoute = createRoute({ getParentRoute: () => adminRoute, path: '/', component: AdminDashboardPage })

const adminProductsRoute = createRoute({ getParentRoute: () => adminRoute, path: '/products', component: AdminProductsPage })
const adminProductNewRoute = createRoute({ getParentRoute: () => adminRoute, path: '/products/new', component: AdminProductNewPage })
const adminProductEditRoute = createRoute({ getParentRoute: () => adminRoute, path: '/products/$slug/edit', component: AdminProductEditPage })

const adminOrdersRoute = createRoute({ getParentRoute: () => adminRoute, path: '/orders', component: AdminOrdersPage })
const adminOrderDetailRoute = createRoute({ getParentRoute: () => adminRoute, path: '/orders/$token', component: AdminOrderDetailPage })

const adminMessagesRoute = createRoute({ getParentRoute: () => adminRoute, path: '/messages', component: AdminMessagesPage })
const adminMessageDetailRoute = createRoute({ getParentRoute: () => adminRoute, path: '/messages/$id', component: AdminMessageDetailPage })

const adminTestimonialsRoute = createRoute({ getParentRoute: () => adminRoute, path: '/testimonials', component: AdminTestimonialsPage })
const adminTestimonialNewRoute = createRoute({ getParentRoute: () => adminRoute, path: '/testimonials/new', component: AdminTestimonialNewPage })
const adminTestimonialEditRoute = createRoute({ getParentRoute: () => adminRoute, path: '/testimonials/$slug/edit', component: AdminTestimonialEditPage })

// ── Tree ──────────────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    indexRoute,
    aboutRoute,
    productsRoute,
    productDetailRoute,
    orderRoute,
    orderConfirmationRoute,
    contactRoute,
  ]),
  loginRoute,
  adminRoute.addChildren([
    adminIndexRoute,
    adminProductsRoute,
    adminProductNewRoute,
    adminProductEditRoute,
    adminOrdersRoute,
    adminOrderDetailRoute,
    adminMessagesRoute,
    adminMessageDetailRoute,
    adminTestimonialsRoute,
    adminTestimonialNewRoute,
    adminTestimonialEditRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
