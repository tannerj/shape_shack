class UserBlueprint < Blueprinter::Base
  identifier :id

  fields :email, :first_name, :last_name

  field :roles do |user|
    user.roles.map(&:name)
  end
end
