class MessageBlueprint < Blueprinter::Base
  identifier :id

  fields :name, :email, :message, :subject,
         :address_one, :address_two, :city, :state, :zip_code, :phone,
         :read, :created_at
end
