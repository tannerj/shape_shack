require "rails_helper"

RSpec.describe "Orders", type: :request do
  let(:admin_role) { create(:role, name: "admin") }
  let(:admin)   { create(:user).tap { |u| u.roles << admin_role } }
  let(:product) { create(:product) }

  let(:valid_order_params) do
    {
      order: {
        first_name: "John", last_name: "Smith",
        address: "123 Main St", city: "Springfield",
        state: "IL", zip: "62701",
        phone: "555-555-5555", email: "john@example.com",
        product_id: product.id
      }
    }
  end

  describe "GET /api/v1/orders" do
    let!(:order) { create(:order) }

    it "returns all orders to admins" do
      get "/api/v1/orders", headers: auth_headers(admin), as: :json

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).length).to be >= 1
    end

    it "returns 401 for unauthenticated users" do
      get "/api/v1/orders", as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "GET /api/v1/orders/:token" do
    let!(:order) { create(:order) }

    it "returns the order to admins" do
      get "/api/v1/orders/#{order.token}", headers: auth_headers(admin), as: :json

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["token"]).to eq(order.token)
    end

    it "returns 401 for unauthenticated users" do
      get "/api/v1/orders/#{order.token}", as: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns 404 for a non-existent token" do
      get "/api/v1/orders/badtoken", headers: auth_headers(admin), as: :json

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/orders" do
    it "creates an order and returns 201 for anyone" do
      expect {
        post "/api/v1/orders", params: valid_order_params, as: :json
      }.to change(Order, :count).by(1)
        .and have_enqueued_job(ActionMailer::MailDeliveryJob)

      expect(response).to have_http_status(:created)
      body = JSON.parse(response.body)
      expect(body["token"]).to be_present
      expect(body["status"]).to eq("received")
    end

    it "returns 422 on invalid params" do
      post "/api/v1/orders", params: { order: { email: "bad@example.com" } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
