class OrderBlueprint < Blueprinter::Base
  identifier :id

  fields :first_name, :last_name, :address, :address_2, :city, :state, :zip,
         :phone, :email, :product_size, :order_description, :token, :status, :created_at

  association :product, blueprint: ProductBlueprint
end
