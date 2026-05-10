class Role < ApplicationRecord
  validates :name, presence: true, uniqueness: true

  has_many :user_role_associations, dependent: :destroy
  has_many :users, through: :user_role_associations
end
