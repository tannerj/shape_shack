require "rails_helper"

RSpec.describe "Messages", type: :request do
  let(:admin_role) { create(:role, name: "admin") }
  let(:admin) { create(:user).tap { |u| u.roles << admin_role } }

  let(:valid_message_params) do
    {
      message: {
        name: "Alice", email: "alice@example.com",
        message: "Hello there.", subject: "Inquiry",
        address_one: "123 Oak St", city: "Portland",
        state: "OR", zip_code: "97201", phone: "555-000-0000"
      }
    }
  end

  describe "GET /api/v1/messages" do
    let!(:unread) { create(:message, read: false) }
    let!(:read)   { create(:message, read: true) }

    it "returns read and unread messages to admins" do
      get "/api/v1/messages", headers: auth_headers(admin), as: :json

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body).to have_key("unread")
      expect(body).to have_key("read")
    end

    it "returns 401 for unauthenticated users" do
      get "/api/v1/messages", as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "GET /api/v1/messages/:id" do
    let!(:message) { create(:message, read: false) }

    it "returns the message and marks it read for admins" do
      get "/api/v1/messages/#{message.id}", headers: auth_headers(admin), as: :json

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["read"]).to be true
      expect(message.reload.read).to be true
    end

    it "returns 401 for unauthenticated users" do
      get "/api/v1/messages/#{message.id}", as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "POST /api/v1/messages" do
    it "creates a message and returns 201 for anyone" do
      expect {
        post "/api/v1/messages", params: valid_message_params, as: :json
      }.to change(Message, :count).by(1)
        .and have_enqueued_job(ActionMailer::MailDeliveryJob)

      expect(response).to have_http_status(:created)
    end

    it "returns 422 on invalid params" do
      post "/api/v1/messages", params: { message: { name: "" } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "PATCH /api/v1/messages/:id" do
    let!(:message) { create(:message, read: false) }

    it "updates the message for admins" do
      patch "/api/v1/messages/#{message.id}",
            params: { message: { read: true } },
            headers: auth_headers(admin),
            as: :json

      expect(response).to have_http_status(:ok)
      expect(message.reload.read).to be true
    end

    it "returns 401 for unauthenticated users" do
      patch "/api/v1/messages/#{message.id}",
            params: { message: { read: true } },
            as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
