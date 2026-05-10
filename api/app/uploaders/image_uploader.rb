require "image_processing/mini_magick"

class ImageUploader < Shrine
  Attacher.default_url do |derivative: nil, **|
    "/default_images/#{derivative}.png" if derivative
  end

  Attacher.derivatives do |original|
    magick = ImageProcessing::MiniMagick.source(original)
    {
      thumb: magick.resize_to_fill!(150, 100),
    }
  end
end
