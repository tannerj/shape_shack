module Api
  module V1
    class OrdersController < BaseController
      before_action :authenticate_user!, only: [:index, :show]
      before_action :set_order, only: [:show]

      def index
        authorize Order
        render json: OrderBlueprint.render_as_hash(Order.order(created_at: :desc))
      end

      def show
        authorize @order
        render json: OrderBlueprint.render_as_hash(@order)
      end

      def create
        @order = Order.new(order_params)
        authorize @order
        if @order.save
          OrderConfirmationMailer.with(order: @order).order_confirmation_email.deliver_later
          render json: OrderBlueprint.render_as_hash(@order), status: :created
        else
          render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_order
        @order = Order.find_by!(token: params[:token])
      end

      def order_params
        params.require(:order).permit(
          :first_name, :last_name, :address, :address_2,
          :city, :state, :zip, :phone, :email,
          :product_id, :product_size, :order_description
        )
      end
    end
  end
end
