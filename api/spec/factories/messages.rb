FactoryBot.define do
  factory :message do
    name { "Alice Johnson" }
    sequence(:email) { |n| "alice#{n}@example.com" }
    message { "I have a question about your products." }
    subject { "Product inquiry" }
    address_one { "456 Oak Ave" }
    city { "Portland" }
    state { "OR" }
    zip_code { "97201" }
    phone { "555-123-4567" }
    read { false }
  end
end
