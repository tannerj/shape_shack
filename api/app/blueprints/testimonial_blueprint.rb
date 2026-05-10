class TestimonialBlueprint < Blueprinter::Base
  identifier :id

  fields :customer_name, :excerpt, :testimonial, :quote, :slug, :released
end
