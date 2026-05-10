class CreateOrders < ActiveRecord::Migration[8.1]
  def change
    create_table :orders do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :address, null: false
      t.string :address_2
      t.string :city, null: false
      t.string :state, null: false
      t.string :zip, null: false
      t.string :phone, null: false
      t.string :email, null: false
      t.references :product, foreign_key: true
      t.string :product_size
      t.text :order_description
      t.string :token
      t.string :status, null: false, default: "received"

      t.timestamps
    end

    add_index :orders, :token, unique: true
  end
end
