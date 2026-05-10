class ProductSize < ApplicationRecord
  validates :name, :dimensions, presence: true

  monetize :price_cents

  belongs_to :product, inverse_of: :sizes
end
