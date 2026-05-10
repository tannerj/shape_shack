FactoryBot.define do
  factory :product do
    sequence(:name) { |n| "Product #{n}" }
    released { false }
    discontinued { false }
    base_price_cents { 5000 }
  end
end
