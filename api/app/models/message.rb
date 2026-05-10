class Message < ApplicationRecord
  validates :name, :address_one, :city, :state, :zip_code, :phone, :email, :subject, :message,
            presence: true

  scope :read, -> { where(read: true).order(created_at: :desc) }
  scope :unread, -> { where(read: false).order(created_at: :desc) }
end
