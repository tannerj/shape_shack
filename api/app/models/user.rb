class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  validates :first_name, :last_name, presence: true

  has_many :user_role_associations, dependent: :destroy
  has_many :roles, through: :user_role_associations

  def has_role?(role_name)
    if role_name.is_a?(Array)
      roles.any? { |role| role_name.include?(role.name) }
    else
      roles.any? { |role| role.name == role_name }
    end
  end

  def is_null_user?
    false
  end
end
