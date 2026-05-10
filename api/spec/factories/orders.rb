FactoryBot.define do
  factory :order do
    first_name { "John" }
    last_name { "Smith" }
    address { "123 Main St" }
    city { "Springfield" }
    state { "IL" }
    zip { "62701" }
    phone { "555-555-5555" }
    sequence(:email) { |n| "customer#{n}@example.com" }
    status { "received" }
    product
  end
end
