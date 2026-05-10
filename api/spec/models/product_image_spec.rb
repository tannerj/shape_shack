require "rails_helper"

RSpec.describe ProductImage, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:product) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:alt_text) }
  end

  describe "after_create" do
    it "enqueues a GenerateProductImageDerivativesJob" do
      product = create(:product)
      expect {
        create(:product_image, product: product)
      }.to have_enqueued_job(GenerateProductImageDerivativesJob)
    end
  end
end
