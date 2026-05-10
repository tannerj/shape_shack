FactoryBot.define do
  factory :product_image do
    alt_text { "A beautiful product" }
    product
  end
end
