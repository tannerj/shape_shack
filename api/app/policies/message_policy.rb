class MessagePolicy < ApplicationPolicy
  def index?  = admin?
  def show?   = admin?
  def create? = true
  def update? = admin?
end
