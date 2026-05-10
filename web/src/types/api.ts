export interface Product {
  id: number
  name: string
  slug: string
  sku: string | null
  released: boolean
  discontinued: boolean
  short_description: string | null
  description: string | null
  base_price_cents: number | null
  list_image_url: string | null
  banner_image_url: string | null
}

export interface ProductSize {
  id: number
  name: string
  dimensions: string | null
  price_cents: number | null
  position: number | null
}

export interface ProductImage {
  id: number
  alt_text: string | null
  caption: string | null
  image_url: string | null
  thumb_url: string | null
}

export interface ProductWithAssociations extends Product {
  sizes: ProductSize[]
  images: ProductImage[]
}

export interface Order {
  id: number
  first_name: string
  last_name: string
  address: string
  address_2: string | null
  city: string
  state: string
  zip: string
  phone: string
  email: string
  product_size: string | null
  order_description: string
  token: string
  status: string | null
  created_at: string
  product: Product | null
}

export interface Message {
  id: number
  name: string
  email: string
  message: string
  subject: string
  address_one: string
  address_two: string | null
  city: string
  state: string
  zip_code: string
  phone: string
  read: boolean
  created_at: string
}

export interface Testimonial {
  id: number
  customer_name: string
  excerpt: string | null
  testimonial: string | null
  quote: string | null
  slug: string
  released: boolean
}
