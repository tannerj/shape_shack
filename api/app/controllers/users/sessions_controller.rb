class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  # Warden hasn't run the JWT strategy yet when verify_signed_out_user fires,
  # so warden.user returns nil even with a valid token. Check the Authorization
  # header directly instead — presence means a sign-out is being attempted.
  def all_signed_out?
    !request.headers["Authorization"].present?
  end

  def respond_with(resource, _opts = {})
    render json: { user: UserBlueprint.render_as_hash(resource) }, status: :ok
  end

  def respond_to_on_destroy(non_navigational_status: :no_content)
    head non_navigational_status
  end
end
