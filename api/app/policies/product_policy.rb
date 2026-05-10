class ProductPolicy < ApplicationPolicy
  def index?   = true
  def show?    = record.released? || admin?
  def create?  = admin?
  def update?  = admin?
  def destroy? = admin?
end
