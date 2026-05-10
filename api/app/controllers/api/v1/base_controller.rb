module Api
  module V1
    class BaseController < ApplicationController
      private

      def current_user
        super || NullUser.new
      end
    end
  end
end
