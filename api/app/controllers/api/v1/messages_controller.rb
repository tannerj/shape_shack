module Api
  module V1
    class MessagesController < BaseController
      before_action :authenticate_user!, only: [:index, :show, :update]
      before_action :set_message, only: [:show, :update]

      def index
        authorize Message
        render json: {
          unread: MessageBlueprint.render_as_hash(Message.unread),
          read:   MessageBlueprint.render_as_hash(Message.read)
        }
      end

      def show
        authorize @message
        @message.update!(read: true)
        render json: MessageBlueprint.render_as_hash(@message)
      end

      def create
        @message = Message.new(message_params)
        authorize @message
        if @message.save
          ContactMailer.with(message: @message).contact_email.deliver_later
          render json: MessageBlueprint.render_as_hash(@message), status: :created
        else
          render json: { errors: @message.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        authorize @message
        if @message.update(message_params)
          render json: MessageBlueprint.render_as_hash(@message)
        else
          render json: { errors: @message.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_message
        @message = Message.find(params[:id])
      end

      def message_params
        params.require(:message).permit(
          :name, :address_one, :address_two, :city, :state, :zip_code,
          :phone, :email, :subject, :message, :read
        )
      end
    end
  end
end
