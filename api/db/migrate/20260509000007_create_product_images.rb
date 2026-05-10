class CreateProductImages < ActiveRecord::Migration[8.1]
  def change
    create_table :product_images do |t|
      t.string :alt_text, null: false
      t.string :caption
      t.jsonb :image_data
      t.references :product, foreign_key: true

      t.timestamps
    end
  end
end
