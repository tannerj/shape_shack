FactoryBot.define do
  factory :product_size do
    name { "Small" }
    dimensions { '8" x 10"' }
    price_cents { 2500 }
    position { 1 }
    product
  end
end
