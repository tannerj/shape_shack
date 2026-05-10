module Api
  module V1
    class UploadsController < BaseController
      before_action :authenticate_user!

      def create
        file = params.require(:file)
        attacher = ImageUploader::Attacher.new
        attacher.assign(file)
        render json: attacher.file.data
      end
    end
  end
end
