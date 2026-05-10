class Product < ApplicationRecord
  include Shrine::Attachment(:list_image)
  include Shrine::Attachment(:banner_image)

  before_validation :generate_slug, on: :create

  validates :name, presence: true
  validates :slug, presence: true, on: :update
  validates :slug, uniqueness: true, allow_blank: true

  has_many :sizes, class_name: "ProductSize", inverse_of: :product, dependent: :destroy
  has_many :images, class_name: "ProductImage", inverse_of: :product, dependent: :destroy
  has_many :orders, dependent: :nullify

  accepts_nested_attributes_for :sizes, :images, reject_if: :all_blank, allow_destroy: true

  monetize :base_price_cents, allow_nil: true, numericality: { greater_than_or_equal_to: 0 }

  scope :released, -> { where(released: true, discontinued: false).order(:name) }
  scope :unreleased, -> { where(released: false, discontinued: false).order(:name) }
  scope :discontinued, -> { where(discontinued: true).order(:name) }

  def to_param
    slug
  end

  private

  def generate_slug
    self.slug ||= name&.parameterize
  end
end
