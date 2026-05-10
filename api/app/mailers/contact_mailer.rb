class ContactMailer < ApplicationMailer
  def contact_email
    @message = params[:message]
    mail(to: "ed@edsshapeshack.com", subject: "Ed's Shape Shack Contact: #{@message.subject}")
  end
end
