class ProductBlueprint < Blueprinter::Base
  identifier :id

  fields :name, :slug, :sku, :released, :discontinued, :short_description, :description, :base_price_cents

  field(:list_image_url)  { |p| p.list_image_url }
  field(:banner_image_url) { |p| p.banner_image_url }

  view :with_associations do
    association :sizes,  blueprint: ProductSizeBlueprint
    association :images, blueprint: ProductImageBlueprint
  end
end
