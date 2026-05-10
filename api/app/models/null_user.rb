class NullUser
  attr_reader :first_name, :last_name, :email

  def initialize
    @first_name = nil
    @last_name = nil
    @email = nil
  end

  def has_role?(_role_name)
    false
  end

  def is_null_user?
    true
  end
end
