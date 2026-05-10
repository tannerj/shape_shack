require "rails_helper"

RSpec.describe "Products", type: :request do
  let(:admin_role) { create(:role, name: "admin") }
  let(:admin) { create(:user).tap { |u| u.roles << admin_role } }
  let(:user)  { create(:user) }

  describe "GET /api/v1/products" do
    let!(:released)     { create(:product, released: true,  discontinued: false, name: "A") }
    let!(:unreleased)   { create(:product, released: false, discontinued: false, name: "B") }
    let!(:discontinued) { create(:product, discontinued: true, name: "C") }

    it "returns released products to unauthenticated users" do
      get "/api/v1/products", as: :json

      expect(response).to have_http_status(:ok)
      names = JSON.parse(response.body).map { |p| p["name"] }
      expect(names).to include("A")
      expect(names).not_to include("B", "C")
    end

    it "returns all products grouped by state to admins" do
      get "/api/v1/products", headers: auth_headers(admin), as: :json

      body = JSON.parse(response.body)
      expect(body).to have_key("released")
      expect(body).to have_key("unreleased")
      expect(body).to have_key("discontinued")
    end
  end

  describe "GET /api/v1/products/:slug" do
    let(:released_product)   { create(:product, released: true, name: "Released") }
    let(:unreleased_product) { create(:product, released: false, name: "Unreleased") }

    it "returns a released product to unauthenticated users" do
      get "/api/v1/products/#{released_product.slug}", as: :json

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["name"]).to eq("Released")
    end

    it "returns 403 for an unreleased product to unauthenticated users" do
      get "/api/v1/products/#{unreleased_product.slug}", as: :json

      expect(response).to have_http_status(:forbidden)
    end

    it "returns an unreleased product to admins" do
      get "/api/v1/products/#{unreleased_product.slug}", headers: auth_headers(admin), as: :json

      expect(response).to have_http_status(:ok)
    end

    it "returns 404 for a non-existent slug" do
      get "/api/v1/products/no-such-product", as: :json

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/products" do
    let(:valid_params) { { product: { name: "New Shape" } } }

    it "returns 401 for unauthenticated users" do
      post "/api/v1/products", params: valid_params, as: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns 403 for non-admin users" do
      post "/api/v1/products", params: valid_params, headers: auth_headers(user), as: :json

      expect(response).to have_http_status(:forbidden)
    end

    it "creates a product and returns 201 for admins" do
      post "/api/v1/products", params: valid_params, headers: auth_headers(admin), as: :json

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["name"]).to eq("New Shape")
    end

    it "returns 422 on invalid params" do
      post "/api/v1/products", params: { product: { name: "" } }, headers: auth_headers(admin), as: :json

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "PATCH /api/v1/products/:slug" do
    let(:product) { create(:product) }

    it "updates the product and returns 200 for admins" do
      patch "/api/v1/products/#{product.slug}",
            params: { product: { name: "Updated" } },
            headers: auth_headers(admin),
            as: :json

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["name"]).to eq("Updated")
    end

    it "returns 403 for non-admin users" do
      patch "/api/v1/products/#{product.slug}",
            params: { product: { name: "Updated" } },
            headers: auth_headers(user),
            as: :json

      expect(response).to have_http_status(:forbidden)
    end
  end

  describe "DELETE /api/v1/products/:slug" do
    let!(:product) { create(:product) }

    it "destroys the product and returns 204 for admins" do
      delete "/api/v1/products/#{product.slug}", headers: auth_headers(admin), as: :json

      expect(response).to have_http_status(:no_content)
      expect(Product.find_by(slug: product.slug)).to be_nil
    end

    it "returns 401 for unauthenticated users" do
      delete "/api/v1/products/#{product.slug}", as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
