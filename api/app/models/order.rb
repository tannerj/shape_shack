class Order < ApplicationRecord
  has_secure_token

  validates :first_name, :last_name, :address, :city, :state, :zip, :phone, :email, presence: true

  belongs_to :product, optional: true

  def to_param
    token
  end
end
