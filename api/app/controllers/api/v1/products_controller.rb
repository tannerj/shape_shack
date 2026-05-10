module Api
  module V1
    class ProductsController < BaseController
      before_action :set_product, only: [:show, :update, :destroy]
      before_action :authenticate_user!, only: [:create, :update, :destroy]

      def index
        if current_user.has_role?("admin")
          render json: {
            released:     ProductBlueprint.render_as_hash(Product.released,     view: :with_associations),
            unreleased:   ProductBlueprint.render_as_hash(Product.unreleased,   view: :with_associations),
            discontinued: ProductBlueprint.render_as_hash(Product.discontinued, view: :with_associations)
          }
        else
          render json: ProductBlueprint.render_as_hash(Product.released, view: :with_associations)
        end
      end

      def show
        authorize @product
        render json: ProductBlueprint.render_as_hash(@product, view: :with_associations)
      end

      def create
        @product = Product.new(product_params)
        authorize @product
        if @product.save
          render json: ProductBlueprint.render_as_hash(@product, view: :with_associations), status: :created
        else
          render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        authorize @product
        if @product.update(product_params)
          render json: ProductBlueprint.render_as_hash(@product, view: :with_associations)
        else
          render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        authorize @product
        @product.destroy
        head :no_content
      end

      private

      def set_product
        @product = Product.find_by!(slug: params[:slug])
      end

      def product_params
        params.require(:product).permit(
          :name, :sku, :short_description, :description, :base_price_cents,
          :released, :discontinued,
          sizes_attributes:  [:id, :name, :dimensions, :price_cents, :position, :_destroy],
          images_attributes: [:id, :image, :alt_text, :caption, :_destroy]
        )
      end
    end
  end
end
