class CreateProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.string :sku
      t.boolean :released, default: false
      t.text :short_description
      t.text :description
      t.integer :base_price_cents
      t.jsonb :list_image_data
      t.jsonb :banner_image_data
      t.boolean :discontinued, default: false

      t.timestamps
    end

    add_index :products, :slug, unique: true
  end
end
