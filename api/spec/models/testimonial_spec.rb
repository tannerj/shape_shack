require "rails_helper"

RSpec.describe Testimonial, type: :model do
  describe "validations" do
    it { is_expected.to validate_presence_of(:customer_name) }
    it { is_expected.to validate_presence_of(:testimonial) }

    it "requires a slug" do
      testimonial = build(:testimonial, customer_name: nil)
      expect(testimonial).not_to be_valid
      expect(testimonial.errors[:slug]).to be_present
    end

    it "enforces slug uniqueness" do
      create(:testimonial, customer_name: "Unique Name")
      duplicate = build(:testimonial, customer_name: "Unique Name")
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:slug]).to be_present
    end
  end

  describe "slug generation" do
    it "generates a slug from customer_name" do
      testimonial = create(:testimonial, customer_name: "Mary Jane")
      expect(testimonial.slug).to eq("mary-jane")
    end

    it "regenerates the slug when customer_name changes" do
      testimonial = create(:testimonial, customer_name: "Old Name")
      testimonial.update!(customer_name: "New Name")
      expect(testimonial.slug).to eq("new-name")
    end
  end

  describe "#to_param" do
    it "returns the slug" do
      testimonial = create(:testimonial, customer_name: "Bob Test")
      expect(testimonial.to_param).to eq("bob-test")
    end
  end

  describe "scopes" do
    let!(:released) { create(:testimonial, released: true, customer_name: "Customer A") }
    let!(:unreleased) { create(:testimonial, released: false, customer_name: "Customer B") }

    it ".released returns released testimonials" do
      expect(Testimonial.released).to include(released)
      expect(Testimonial.released).not_to include(unreleased)
    end

    it ".unreleased returns unreleased testimonials" do
      expect(Testimonial.unreleased).to include(unreleased)
      expect(Testimonial.unreleased).not_to include(released)
    end
  end
end
