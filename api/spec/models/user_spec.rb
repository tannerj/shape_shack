require "rails_helper"

RSpec.describe User, type: :model do
  describe "associations" do
    it { is_expected.to have_many(:user_role_associations).dependent(:destroy) }
    it { is_expected.to have_many(:roles).through(:user_role_associations) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:first_name) }
    it { is_expected.to validate_presence_of(:last_name) }
    it { is_expected.to validate_presence_of(:email) }
  end

  describe "#has_role?" do
    let(:user) { create(:user) }
    let(:admin_role) { create(:role, name: "admin") }

    before { user.roles << admin_role }

    it "returns true when user has the named role" do
      expect(user.has_role?("admin")).to be true
    end

    it "returns false when user does not have the named role" do
      expect(user.has_role?("moderator")).to be false
    end

    it "accepts an array and returns true when any role matches" do
      expect(user.has_role?(["admin", "moderator"])).to be true
    end

    it "accepts an array and returns false when no roles match" do
      expect(user.has_role?(["moderator", "editor"])).to be false
    end
  end

  describe "#is_null_user?" do
    it "returns false" do
      expect(build(:user).is_null_user?).to be false
    end
  end
end
