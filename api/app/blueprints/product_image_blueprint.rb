class ProductImageBlueprint < Blueprinter::Base
  identifier :id

  fields :alt_text, :caption

  field(:image_url) { |img| img.image_url }
  field(:thumb_url) { |img| img.image_url(:thumb) }
end
