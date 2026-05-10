Rails.application.routes.draw do
  devise_for :users, skip: :all

  devise_scope :user do
    post   "api/v1/auth/sign_in",  to: "users/sessions#create"
    delete "api/v1/auth/sign_out", to: "users/sessions#destroy"
  end

  namespace :api do
    namespace :v1 do
      get "me", to: "users#me"
      resources :products,     param: :slug,  except: [:new, :edit]
      resources :orders,       param: :token, only: [:index, :show, :create]
      resources :messages,                    only: [:index, :show, :create, :update]
      resources :testimonials, param: :slug,  except: [:new, :edit]
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
