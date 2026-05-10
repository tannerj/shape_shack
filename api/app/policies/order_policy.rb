class OrderPolicy < ApplicationPolicy
  def index?  = admin?
  def show?   = admin?
  def create? = true
end
