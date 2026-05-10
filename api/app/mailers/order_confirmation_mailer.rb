class OrderConfirmationMailer < ApplicationMailer
  def order_confirmation_email
    @order = params[:order]
    mail(
      to: ["ed@edsshapeshack.com", "paul@edsshapeshack.com", @order.email],
      subject: "Ed's Shape Shack Order Confirmation"
    )
  end
end
