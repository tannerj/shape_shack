require "rails_helper"

RSpec.describe Order, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:product).optional }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:first_name) }
    it { is_expected.to validate_presence_of(:last_name) }
    it { is_expected.to validate_presence_of(:address) }
    it { is_expected.to validate_presence_of(:city) }
    it { is_expected.to validate_presence_of(:state) }
    it { is_expected.to validate_presence_of(:zip) }
    it { is_expected.to validate_presence_of(:phone) }
    it { is_expected.to validate_presence_of(:email) }
  end

  describe "token" do
    it "generates a token on create" do
      order = create(:order)
      expect(order.token).to be_present
    end
  end

  describe "#to_param" do
    it "returns the token" do
      order = create(:order)
      expect(order.to_param).to eq(order.token)
    end
  end
end
