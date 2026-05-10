require "rails_helper"

RSpec.describe Role, type: :model do
  describe "associations" do
    it { is_expected.to have_many(:user_role_associations).dependent(:destroy) }
    it { is_expected.to have_many(:users).through(:user_role_associations) }
  end

  describe "validations" do
    subject { build(:role) }

    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_uniqueness_of(:name) }
  end
end
