class CreateProductSizes < ActiveRecord::Migration[8.1]
  def change
    create_table :product_sizes do |t|
      t.string :name, null: false
      t.string :dimensions, null: false
      t.integer :price_cents
      t.integer :position, default: 1
      t.references :product, foreign_key: true

      t.timestamps
    end
  end
end
