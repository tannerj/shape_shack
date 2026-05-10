FactoryBot.define do
  factory :testimonial do
    sequence(:customer_name) { |n| "Customer #{n}" }
    testimonial { "Absolutely loved the product. Highly recommend!" }
    released { false }
  end
end
