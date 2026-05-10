require "rails_helper"

RSpec.describe "Testimonials", type: :request do
  let(:admin_role) { create(:role, name: "admin") }
  let(:admin) { create(:user).tap { |u| u.roles << admin_role } }
  let(:user)  { create(:user) }

  describe "GET /api/v1/testimonials" do
    let!(:released)   { create(:testimonial, released: true,  customer_name: "Customer A") }
    let!(:unreleased) { create(:testimonial, released: false, customer_name: "Customer B") }

    it "returns only released testimonials to unauthenticated users" do
      get "/api/v1/testimonials", as: :json

      expect(response).to have_http_status(:ok)
      names = JSON.parse(response.body).map { |t| t["customer_name"] }
      expect(names).to include("Customer A")
      expect(names).not_to include("Customer B")
    end

    it "returns all testimonials to admins" do
      get "/api/v1/testimonials", headers: auth_headers(admin), as: :json

      names = JSON.parse(response.body).map { |t| t["customer_name"] }
      expect(names).to include("Customer A", "Customer B")
    end
  end

  describe "GET /api/v1/testimonials/:slug" do
    let(:testimonial) { create(:testimonial, released: true, customer_name: "Pat Smith") }

    it "returns the testimonial" do
      get "/api/v1/testimonials/#{testimonial.slug}", as: :json

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["customer_name"]).to eq("Pat Smith")
    end

    it "returns 404 for a non-existent slug" do
      get "/api/v1/testimonials/nobody", as: :json

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/testimonials" do
    let(:valid_params) { { testimonial: { customer_name: "New Customer", testimonial: "Great product!" } } }

    it "creates a testimonial and returns 201 for admins" do
      post "/api/v1/testimonials", params: valid_params, headers: auth_headers(admin), as: :json

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["customer_name"]).to eq("New Customer")
    end

    it "returns 401 for unauthenticated users" do
      post "/api/v1/testimonials", params: valid_params, as: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns 403 for non-admin users" do
      post "/api/v1/testimonials", params: valid_params, headers: auth_headers(user), as: :json

      expect(response).to have_http_status(:forbidden)
    end
  end

  describe "PATCH /api/v1/testimonials/:slug" do
    let!(:testimonial) { create(:testimonial, customer_name: "Before Update") }

    it "updates the testimonial for admins" do
      patch "/api/v1/testimonials/#{testimonial.slug}",
            params: { testimonial: { released: true } },
            headers: auth_headers(admin),
            as: :json

      expect(response).to have_http_status(:ok)
      expect(testimonial.reload.released).to be true
    end

    it "returns 403 for non-admin users" do
      patch "/api/v1/testimonials/#{testimonial.slug}",
            params: { testimonial: { released: true } },
            headers: auth_headers(user),
            as: :json

      expect(response).to have_http_status(:forbidden)
    end
  end

  describe "DELETE /api/v1/testimonials/:slug" do
    let!(:testimonial) { create(:testimonial, customer_name: "To Delete") }

    it "destroys the testimonial and returns 204 for admins" do
      delete "/api/v1/testimonials/#{testimonial.slug}", headers: auth_headers(admin), as: :json

      expect(response).to have_http_status(:no_content)
    end

    it "returns 401 for unauthenticated users" do
      delete "/api/v1/testimonials/#{testimonial.slug}", as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
