module Api
  module V1
    class TestimonialsController < BaseController
      before_action :authenticate_user!, only: [:create, :update, :destroy]
      before_action :set_testimonial, only: [:show, :update, :destroy]

      def index
        testimonials = current_user.has_role?("admin") ? Testimonial.all : Testimonial.released
        render json: TestimonialBlueprint.render_as_hash(testimonials.order(:customer_name))
      end

      def show
        render json: TestimonialBlueprint.render_as_hash(@testimonial)
      end

      def create
        @testimonial = Testimonial.new(testimonial_params)
        authorize @testimonial
        if @testimonial.save
          render json: TestimonialBlueprint.render_as_hash(@testimonial), status: :created
        else
          render json: { errors: @testimonial.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        authorize @testimonial
        if @testimonial.update(testimonial_params)
          render json: TestimonialBlueprint.render_as_hash(@testimonial)
        else
          render json: { errors: @testimonial.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        authorize @testimonial
        @testimonial.destroy
        head :no_content
      end

      private

      def set_testimonial
        @testimonial = Testimonial.find_by!(slug: params[:slug])
      end

      def testimonial_params
        params.require(:testimonial).permit(
          :customer_name, :excerpt, :quote, :testimonial, :released
        )
      end
    end
  end
end
