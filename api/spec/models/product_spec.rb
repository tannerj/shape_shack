require "rails_helper"

RSpec.describe Product, type: :model do
  describe "associations" do
    it { is_expected.to have_many(:sizes).class_name("ProductSize").dependent(:destroy) }
    it { is_expected.to have_many(:images).class_name("ProductImage").dependent(:destroy) }
    it { is_expected.to have_many(:orders).dependent(:nullify) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:name) }
  end

  describe "slug generation" do
    it "generates a slug from the name on create" do
      product = create(:product, name: "Sunset Shore")
      expect(product.slug).to eq("sunset-shore")
    end

    it "does not overwrite an existing slug" do
      product = create(:product, name: "Test Product", slug: "custom-slug")
      expect(product.slug).to eq("custom-slug")
    end
  end

  describe "#to_param" do
    it "returns the slug" do
      product = create(:product, name: "Wave Print")
      expect(product.to_param).to eq(product.slug)
    end
  end

  describe "scopes" do
    let!(:released_product) { create(:product, released: true, discontinued: false) }
    let!(:unreleased_product) { create(:product, released: false, discontinued: false) }
    let!(:discontinued_product) { create(:product, discontinued: true) }

    it ".released returns released, non-discontinued products" do
      expect(Product.released).to include(released_product)
      expect(Product.released).not_to include(unreleased_product, discontinued_product)
    end

    it ".unreleased returns unreleased, non-discontinued products" do
      expect(Product.unreleased).to include(unreleased_product)
      expect(Product.unreleased).not_to include(released_product, discontinued_product)
    end

    it ".discontinued returns discontinued products" do
      expect(Product.discontinued).to include(discontinued_product)
      expect(Product.discontinued).not_to include(released_product, unreleased_product)
    end
  end
end
