class ProductImage < ApplicationRecord
  include ImageUploader::Attachment(:image)

  validates :alt_text, presence: true

  belongs_to :product, inverse_of: :images

  after_create :enqueue_derivatives

  private

  def enqueue_derivatives
    GenerateProductImageDerivativesJob.perform_later(self)
  end
end
