require "rails_helper"

RSpec.describe "Auth", type: :request do
  let(:password) { "password123" }
  let(:user) { create(:user, password: password) }

  describe "POST /api/v1/auth/sign_in" do
    it "returns 200 and user JSON with a JWT token on valid credentials" do
      post "/api/v1/auth/sign_in",
           params: { user: { email: user.email, password: password } },
           as: :json

      expect(response).to have_http_status(:ok)
      expect(response.headers["Authorization"]).to be_present
      body = JSON.parse(response.body)
      expect(body["user"]["email"]).to eq(user.email)
    end

    it "returns 401 on invalid credentials" do
      post "/api/v1/auth/sign_in",
           params: { user: { email: user.email, password: "wrong" } },
           as: :json

      expect(response).to have_http_status(:unauthorized)
      expect(response.headers["Authorization"]).to be_nil
    end
  end

  describe "DELETE /api/v1/auth/sign_out" do
    it "returns 204 with a valid token" do
      headers = auth_headers(user)
      delete "/api/v1/auth/sign_out", headers: headers, as: :json

      expect(response).to have_http_status(:no_content)
    end

    it "returns 401 without a token" do
      delete "/api/v1/auth/sign_out", as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
