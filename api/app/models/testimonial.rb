class Testimonial < ApplicationRecord
  before_validation :generate_slug

  validates :customer_name, :testimonial, :slug, presence: true
  validates :slug, uniqueness: true, allow_blank: true

  scope :released, -> { where(released: true) }
  scope :unreleased, -> { where(released: false) }

  def to_param
    slug
  end

  private

  def generate_slug
    self.slug = customer_name&.parameterize
  end
end
