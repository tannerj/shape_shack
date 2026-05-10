module Api
  module V1
    class UsersController < BaseController
      before_action :authenticate_user!

      def me
        render json: { user: UserBlueprint.render_as_hash(current_user) }
      end
    end
  end
end
