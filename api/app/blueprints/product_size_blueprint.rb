class ProductSizeBlueprint < Blueprinter::Base
  identifier :id

  fields :name, :dimensions, :price_cents, :position
end
