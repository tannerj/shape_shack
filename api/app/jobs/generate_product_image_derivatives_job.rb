class GenerateProductImageDerivativesJob < ApplicationJob
  queue_as :default

  def perform(product_image)
    attacher = product_image.image_attacher
    return unless attacher.stored?

    attacher.create_derivatives
    attacher.atomic_persist
  end
end
