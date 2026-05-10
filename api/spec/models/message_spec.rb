require "rails_helper"

RSpec.describe Message, type: :model do
  describe "validations" do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_presence_of(:message) }
    it { is_expected.to validate_presence_of(:subject) }
    it { is_expected.to validate_presence_of(:address_one) }
    it { is_expected.to validate_presence_of(:city) }
    it { is_expected.to validate_presence_of(:state) }
    it { is_expected.to validate_presence_of(:zip_code) }
    it { is_expected.to validate_presence_of(:phone) }
  end

  describe "scopes" do
    let!(:read_message) { create(:message, read: true) }
    let!(:unread_message) { create(:message, read: false) }

    it ".read returns only read messages" do
      expect(Message.read).to include(read_message)
      expect(Message.read).not_to include(unread_message)
    end

    it ".unread returns only unread messages" do
      expect(Message.unread).to include(unread_message)
      expect(Message.unread).not_to include(read_message)
    end
  end
end
