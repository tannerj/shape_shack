require "rails_helper"

RSpec.describe "Uploads", type: :request do
  let(:admin_role) { create(:role, name: "admin") }
  let(:admin) { create(:user).tap { |u| u.roles << admin_role } }
  let(:user)  { create(:user) }

  let(:image_file) do
    Rack::Test::UploadedFile.new(
      Rails.root.join("spec/fixtures/files/test_image.jpg"),
      "image/jpeg"
    )
  end

  before { FileUtils.mkdir_p(Rails.root.join("spec/fixtures/files")) }

  describe "POST /api/v1/uploads" do
    it "returns 401 without auth" do
      post "/api/v1/uploads"
      expect(response).to have_http_status(:unauthorized)
    end

    it "caches the file and returns shrine data for authenticated users" do
      # Write a minimal JPEG fixture so tests don't need a real image file
      jpeg_path = Rails.root.join("spec/fixtures/files/test_image.jpg")
      unless File.exist?(jpeg_path)
        # Minimal valid JPEG bytes
        File.binwrite(jpeg_path, "\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xFF\xDB\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0C\x14\r\x0C\x0B\x0B\x0C\x19\x12\x13\x0F\x14\x1D\x1A\x1F\x1E\x1D\x1A\x1C\x1C $.' \",#\x1C\x1C(7),01444\x1F'9=82<.342\x1EDL\xED\xED\xED\xED\xED\xED\xED\xFF\xD9")
      end

      file = Rack::Test::UploadedFile.new(jpeg_path, "image/jpeg")
      post "/api/v1/uploads",
           params: { file: file },
           headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body).to include("id", "storage", "metadata")
      expect(body["storage"]).to eq("cache")
    end
  end
end
